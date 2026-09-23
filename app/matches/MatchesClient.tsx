"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { CalendarDays, CheckCircle2, Clock, Search, Filter } from "lucide-react";
import MatchActionButtons from "./MatchActionButtons";
import TiltCard from "../components/TiltCard";

type Match = any; // We'll rely on any or infer it

export default function MatchesClient({ matches, isAdmin = false }: { matches: Match[], isAdmin?: boolean }) {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const getSportColor = (sport: string | null) => {
    switch (sport) {
      case "Badminton": return "bg-teal-50 text-teal-700 border-teal-200";
      case "Table Tennis": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Football Turf":
      case "Football": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pickleball": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Carrom": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Tug of War": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const sportsList = ["All", ...Array.from(new Set(matches.map(m => m.sport).filter(Boolean)))];

  const filteredMatches = useMemo(() => {
    let result = matches.filter((match) => {
      if (sportFilter !== "All" && match.sport !== sportFilter) return false;
      if (statusFilter === "Upcoming" && match.completed === "YES") return false;
      if (statusFilter === "Completed" && match.completed !== "YES") return false;
      return true;
    });

    if (search.trim()) {
      const fuse = new Fuse(result, {
        keys: ["id", "team1Id", "team2Id", "category", "stage", "winnerId"],
        threshold: 0.3,
        ignoreLocation: true
      });
      result = fuse.search(search).map(r => r.item);
    }

    return result;
  }, [matches, search, sportFilter, statusFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl">
            <CalendarDays size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Fixtures & Results</h1>
            <p className="text-slate-500 dark:text-slate-400">All matches across every sport and category.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search team, stage..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            />
          </div>

          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <Filter size={16} className="text-slate-400 mr-2 shrink-0" />
            <select 
              value={sportFilter} 
              onChange={(e) => setSportFilter(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none pr-4"
            >
              {sportsList.map(sport => (
                <option key={sport} value={sport} className="text-slate-900">{sport}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setStatusFilter("All")}
              className={`px-3 py-1 text-sm font-semibold rounded-lg transition-all ${statusFilter === "All" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("Upcoming")}
              className={`px-3 py-1 text-sm font-semibold rounded-lg transition-all ${statusFilter === "Upcoming" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setStatusFilter("Completed")}
              className={`px-3 py-1 text-sm font-semibold rounded-lg transition-all ${statusFilter === "Completed" ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      {filteredMatches.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 font-semibold text-lg">No matches found for these filters.</p>
          <button onClick={() => {setSearch(""); setSportFilter("All"); setStatusFilter("All")}} className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <TiltCard key={match.id}>
              <div className={`h-full flex flex-col rounded-2xl border transition-all duration-300 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg ${match.completed === 'YES' ? 'border-slate-200 dark:border-slate-800' : 'border-indigo-100 dark:border-indigo-900/50 shadow-sm'}`}>
                {match.completed !== 'YES' && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-100 dark:from-indigo-900/30 to-transparent opacity-50"></div>
                )}
                
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                  <div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mb-2 ${getSportColor(match.sport)}`}>
                      {match.sport}
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{match.category}</h3>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{match.stage}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-300 dark:text-slate-700">#{match.id}</span>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 justify-end">
                      <Clock size={12} /> {match.time || 'TBD'}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border ${match.completed === 'YES' && match.winnerId === match.team1Id ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white/80 dark:bg-slate-800 backdrop-blur-lg text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>
                        {match.team1Id || '?'}
                      </div>
                    </div>
                    
                    <div className="px-4 flex flex-col items-center">
                      <span className="text-xs font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-1">VS</span>
                      {match.completed === 'YES' && (
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-1 rounded-full"><CheckCircle2 size={16} /></span>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border ${match.completed === 'YES' && match.winnerId === match.team2Id ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white/80 dark:bg-slate-800 backdrop-blur-lg text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>
                        {match.team2Id || '?'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {match.completed === "YES" ? (
                  <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col items-center p-4">
                    {(match.score1 || match.score2) && (
                      <div className="mb-2 font-mono font-bold text-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                        {match.score1 || '-'} : {match.score2 || '-'}
                      </div>
                    )}
                    <div className="text-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 font-bold py-2 px-4 rounded-lg w-full border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                      WINNER: {match.winnerId}
                    </div>
                  </div>
                ) : (
                  isAdmin && <MatchActionButtons matchId={match.id} team1Id={match.team1Id || ''} team2Id={match.team2Id || ''} />
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
