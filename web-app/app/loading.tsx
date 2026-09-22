import { Activity } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-200 dark:bg-indigo-900/40 rounded-full blur-xl animate-pulse"></div>
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center relative z-10 animate-bounce">
          <Activity size={32} className="text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Loading Live Data...</h3>
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">Connecting to courtside</p>
      </div>
      
      {/* Skeletons */}
      <div className="w-full max-w-2xl mt-8 space-y-4 opacity-50">
        <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
        <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse delay-75"></div>
        <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse delay-150"></div>
      </div>
    </div>
  );
}
