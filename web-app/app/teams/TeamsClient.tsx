"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Users, Search, AlertTriangle } from "lucide-react";
import { TeamActionButtons } from "./TeamActionButtons";
import TiltCard from "../components/TiltCard";

type Player = {
  code: string;
  name: string;
  gender: string;
};

type Team = {
  id: string;
  players: Player[];
};

export default function TeamsClient({ teams, isAdmin = false }: { teams: Team[], isAdmin?: boolean }) {
  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {
    let result = teams;

    if (search.trim()) {
      const fuse = new Fuse(result, {
        keys: ["id", "players.name", "players.code"],
        threshold: 0.3,
        ignoreLocation: true,
        useExtendedSearch: true
      });
      result = fuse.search(search).map(r => r.item);
    }

    return result;
  }, [teams, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Teams Directory</h1>
            <p className="text-slate-500 dark:text-slate-400">Browse all participating teams and players.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search team, player name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
        </div>
      </div>
      
      {filteredTeams.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 font-semibold text-lg">No teams found matching your search.</p>
          <button onClick={() => setSearch("")} className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Clear Search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map((team) => {
            const maleCount = team.players.filter(p => p.gender === 'Male').length;
            const femaleCount = team.players.filter(p => p.gender === 'Female').length;
            
            return (
              <TiltCard key={team.id}>
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Team ID</span>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{team.id}</h2>
                      </div>
                      
                      <div className="flex gap-1">
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-bold" title="Male Players">{maleCount}M</span>
                        <span className="px-2 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded text-xs font-bold" title="Female Players">{femaleCount}F</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {team.players.map(player => (
                        <li key={player.code} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${player.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'}`}></span>
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[120px]" title={player.name}>{player.name}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 dark:border-slate-700">{player.code}</span>
                        </li>
                      ))}
                      {team.players.length === 0 && (
                        <li className="text-center py-4 text-sm text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
                          <AlertTriangle size={14} className="text-amber-500" /> No players registered
                        </li>
                      )}
                    </ul>

                    {isAdmin && <TeamActionButtons teamId={team.id} />}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
