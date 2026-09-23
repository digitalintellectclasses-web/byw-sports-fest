"use client";

import { useState, useEffect } from "react";
import { Megaphone, Trophy } from "lucide-react";

export default function LiveTicker({ 
  announcements, 
  recentMatches 
}: { 
  announcements: any[], 
  recentMatches: any[] 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const items = [
    ...announcements.map(a => ({ type: 'announcement', text: a.message, id: `a-${a.id}` })),
    ...recentMatches.map(m => ({ 
      type: 'match', 
      text: `${m.sport} ${m.category}: ${m.winnerId ? `Team ${m.winnerId} won` : 'Match Completed'} (Match #${m.id})`,
      id: `m-${m.id}`
    }))
  ];

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-900 dark:bg-black text-white text-sm font-semibold py-2 px-4 overflow-hidden relative flex items-center border-b border-slate-800">
      <div className="flex items-center gap-2 mr-4 shrink-0 z-10 bg-slate-900 dark:bg-black pr-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
        <span className="uppercase tracking-widest text-xs text-slate-300">Live</span>
      </div>
      
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          {items.map((item, i) => (
            <span key={`${item.id}-${i}`} className="inline-flex items-center mx-8">
              {item.type === 'announcement' ? (
                <Megaphone size={14} className="mr-2 text-amber-400" />
              ) : (
                <Trophy size={14} className="mr-2 text-emerald-400" />
              )}
              {item.text}
            </span>
          ))}
          {/* Duplicate for infinite seamless scroll */}
          {items.map((item, i) => (
            <span key={`${item.id}-dup-${i}`} className="inline-flex items-center mx-8">
              {item.type === 'announcement' ? (
                <Megaphone size={14} className="mr-2 text-amber-400" />
              ) : (
                <Trophy size={14} className="mr-2 text-emerald-400" />
              )}
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
