import { getTeamPoints, getCategoryStandings } from "../lib/standings";
import { getTeams } from "../lib/data";
import { Trophy, Medal, AlertCircle, ChevronRight } from "lucide-react";
import { getRankColor } from "../utils";
import PrintButton from "../components/PrintButton";

export const dynamic = 'force-dynamic';
export default async function StandingsPage() {
  const pointsData = await getTeamPoints();
  const teams = await getTeams();
  const categoryStandings = await getCategoryStandings();
  
  // Overall standings (Sort by points descending)
  const standings = Object.entries(pointsData).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-12">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
              <Trophy size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overall Championship</h1>
              <p className="text-slate-500 dark:text-slate-400">Cumulative points across all sports.</p>
            </div>
          </div>
          <div className="print:hidden">
            <PrintButton />
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto hover:shadow-xl hover:-translate-y-1 transition-all duration-300 max-w-4xl">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-20">Rank</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Team</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Penalties</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Points</th>
              </tr>
            </thead>
            <tbody className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg divide-y divide-slate-100 dark:divide-slate-800/50">
              {standings.map(([teamId, points], idx) => {
                const team = teams.find(t => t.id === teamId);
                const rankClass = getRankColor(idx);
                return (
                  <tr key={teamId} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${idx < 3 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm shadow-sm ${rankClass}`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-black shadow-md border border-slate-700">
                          {teamId}
                        </div>
                        {idx === 0 && <Medal className="text-amber-500" size={20} />}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      {team?.penalty_points && team.penalty_points > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 font-semibold text-sm">
                          <AlertCircle size={14} />
                          -{team.penalty_points}
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700 font-medium">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{points}</span>
                      <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1">pts</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Semi-Final Qualifiers</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">Top 2 teams from each group advance to the Semi-Finals.</p>
        </div>
        
        <div className="space-y-12">
          {Object.entries(categoryStandings).map(([sport, categories]) => (
            <div key={sport} className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ChevronRight className="text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{sport}</h3>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {Object.entries(categories).map(([category, groups]) => (
                  <div key={category} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-slate-900 dark:bg-black px-5 py-4 border-b border-slate-800">
                      <h4 className="font-bold text-lg text-white">{category}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800">
                      {["Group A", "Group B"].map(group => {
                        const groupStandings = Object.entries(groups[group as keyof typeof groups]).sort((a, b) => b[1] - a[1]);
                        return (
                          <div key={group} className="p-5">
                            <h5 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{group}</h5>
                            <ul className="space-y-3">
                              {groupStandings.length > 0 ? groupStandings.map(([teamId, points], idx) => (
                                <li key={teamId} className={`flex justify-between items-center p-3 rounded-xl border ${idx < 2 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-400 shadow-sm' : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-black ${idx < 2 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{teamId}</span>
                                    {idx < 2 && <span className="text-xs font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-300 dark:border-emerald-700">Q</span>}
                                  </div>
                                  <span className="font-bold">{points} <span className="text-xs opacity-70 font-normal">pts</span></span>
                                </li>
                              )) : (
                                <li className="p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm text-slate-400 dark:text-slate-500">No matches yet</li>
                              )}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
