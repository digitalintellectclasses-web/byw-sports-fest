'use client';

import { useTransition } from 'react';
import { addPenalty } from '../actions';
import { AlertTriangle } from 'lucide-react';

export function TeamActionButtons({ teamId }: { teamId: string }) {
  const [isPending, startTransition] = useTransition();

  const handlePenalty = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('teamId', teamId);
        formData.append('points', '20');
        await addPenalty(formData);
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
        <AlertTriangle size={14} /> Add -20 Penalty
      </button>
    </div>
  );
}
