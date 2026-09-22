"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      router.refresh();
      
      // Reset spinning animation after a brief moment
      setTimeout(() => setIsRefreshing(false), 1000);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return (
    <div 
      title="Auto-refreshing live data"
      className="fixed bottom-24 md:bottom-6 right-6 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-lg border border-slate-200 dark:border-slate-800 z-40 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
      onClick={() => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 1000);
      }}
    >
      <RefreshCw size={20} className={isRefreshing ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""} />
    </div>
  );
}
