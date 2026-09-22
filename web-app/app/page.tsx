import { getMatches, getTeams, getPlayers } from "./lib/data";
import { Trophy, Users, Activity, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import TiltCard from "./components/TiltCard";

export default async function Home() {
  const matches = await getMatches();
  const teams = await getTeams();
  const players = await getPlayers();
  
  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => m.completed === "YES").length;
  const completionPercentage = totalMatches > 0 ? Math.round((completedMatches / totalMatches) * 100) : 0;
  
  const totalTeams = teams.length;
  const totalPlayers = players.length;

  const upcomingMatches = matches.filter(m => m.completed !== "YES").slice(0, 8);

  return (
    <div className="space-y-8 ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Tournament Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Live status and key metrics from the sports fest.</p>
        </div>
        <div className="relative flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-semibold text-sm border border-red-100 dark:border-red-900/50 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute"></div>
          <div className="w-2 h-2 rounded-full bg-red-500 relative"></div>
          LIVE TRACKING
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <TiltCard>
          <div className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Activity size={24} />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Completion</p>
              <div className="flex items-end gap-2 mb-4">
                <p className="text-4xl font-black text-slate-900 dark:text-white">{completionPercentage}%</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-3">{completedMatches} of {totalMatches} matches done</p>
            </div>
          </div>
        </TiltCard>
        
        {/* Teams Card */}
        <TiltCard>
          <div className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 dark:bg-purple-900/30 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Trophy size={24} />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Teams</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{totalTeams}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-3">Competing across 4 sports</p>
            </div>
          </div>
        </TiltCard>
        
        {/* Players Card */}
        <TiltCard>
          <div className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Users size={24} />
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Players</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{totalPlayers}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-3">Active participants</p>
            </div>
          </div>
        </TiltCard>
      </div>
      
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PlayCircle className="text-indigo-600 dark:text-indigo-400" />
            Up Next
          </h3>
          <a href="/matches" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">View All Fixtures &rarr;</a>
        </div>
        
        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingMatches.map((match, i) => (
              <TiltCard key={match.id}>
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 flex items-center justify-between group h-full">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="flex gap-2 items-center mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">{match.sport}</span>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{match.stage}</span>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white">Match {match.id} • {match.category}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{match.time || 'TBD'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-black text-lg text-slate-800 dark:text-white">{match.team1Id || '?'}</span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">vs</span>
                    <span className="font-black text-lg text-slate-800 dark:text-white">{match.team2Id || '?'}</span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tournament Complete!</h3>
            <p className="text-slate-500 dark:text-slate-400">All matches have been concluded.</p>
          </div>
        )}
      </div>
    </div>
  );
}
