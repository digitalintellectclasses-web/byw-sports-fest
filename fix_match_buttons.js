const fs = require('fs');

// Fix MatchActionButtons.tsx - it got corrupted by the emoji replacement
const correctContent = `'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';


interface Props {
  matchId: string;
  team1Id: string | null;
  team2Id: string | null;
}

export default function MatchActionButtons({ matchId, team1Id, team2Id }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  const handleWin = (winnerId: string | null) => {
    if (!winnerId) return;
    
    startTransition(async () => {
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, winnerId, score1, score2 })
        });
        if (!res.ok) throw new Error("Failed to update match");
        
        router.refresh();
        
        // Visual Reward!
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
        
      } catch (e: any) {
        alert('Error updating match: ' + e.message);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6 p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Enter Score & Select Winner</p>
      
      <div className="flex items-center gap-4 w-full px-4">
        <div className="flex-1 flex flex-col items-center">
          <label className="text-xs text-slate-500 dark:text-slate-400 mb-1">{team1Id || 'Team 1'} Score</label>
          <input 
            type="text" 
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
            className="w-full text-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-900 dark:text-white"
            placeholder="e.g. 21"
          />
        </div>
        <span className="text-slate-400 dark:text-slate-600 font-bold">-</span>
        <div className="flex-1 flex flex-col items-center">
          <label className="text-xs text-slate-500 dark:text-slate-400 mb-1">{team2Id || 'Team 2'} Score</label>
          <input 
            type="text" 
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
            className="w-full text-center p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-900 dark:text-white"
            placeholder="e.g. 19"
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button 
          onClick={() => handleWin(team1Id)} 
          disabled={isPending || !team1Id} 
          className="flex-1 py-3 px-4 rounded-xl font-bold transition-all bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border-2 border-indigo-100 dark:border-indigo-900 hover:border-indigo-300 dark:hover:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPending ? 'Updating...' : (\`\u{1F3C6} \${team1Id ? \`Team \${team1Id} Wins\` : 'TBD'}\`)}
        </button>
        <button 
          onClick={() => handleWin(team2Id)} 
          disabled={isPending || !team2Id}
          className="flex-1 py-3 px-4 rounded-xl font-bold transition-all bg-white dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-900/30 border-2 border-pink-100 dark:border-pink-900 hover:border-pink-300 dark:hover:border-pink-700 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          {isPending ? 'Updating...' : (\`\u{1F3C6} \${team2Id ? \`Team \${team2Id} Wins\` : 'TBD'}\`)}
        </button>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('app/matches/MatchActionButtons.tsx', correctContent, 'utf8');
console.log('MatchActionButtons.tsx fixed!');
