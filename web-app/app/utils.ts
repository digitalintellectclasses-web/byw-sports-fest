export function getRankColor(index: number): string {
  if (index === 0) return "bg-amber-100 text-amber-700 border-amber-200"; // Gold
  if (index === 1) return "bg-slate-100 text-slate-700 border-slate-200"; // Silver
  if (index === 2) return "bg-orange-100 text-orange-800 border-orange-200"; // Bronze
  return "bg-white/80 backdrop-blur-lg text-slate-600 border-slate-100";
}

export function calculatePoints(wins: number, penalties: number): number {
  return (wins * 50) - penalties;
}
