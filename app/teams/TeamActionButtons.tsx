'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { AlertTriangle } from 'lucide-react';

export function TeamActionButtons({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePenalty = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/penalty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId, points: 20 })
        });
        if (!res.ok) throw new Error("Failed to add penalty");
        router.refresh();
      } catch (e: any) {
        alert('Error adding penalty: ' + e.message);
      }
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <button 
        onClick={handlePenalty} 
        disabled={isPending}
        className="w-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 py-2 rounded-lg transition-colors flex justify-center items-center gap-1 disabled:opacity-50"
      >
        <AlertTriangle size={14} /> {isPending ? 'Adding Penalty...' : 'Add -20 Penalty'}
      </button>
    </div>
  );
}
