"use client";

import { useState, useEffect } from "react";
import { PlayCircle, Eye, AlertTriangle } from "lucide-react";
import { startTournamentAction } from "../setupActions";

export default function WelcomeModal() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem("app_mode");
    if (!mode) {
      setShow(true);
    }
  }, []);

  const handleDemo = () => {
    localStorage.setItem("app_mode", "demo");
    setShow(false);
  };

  const handleStart = async () => {
    if (!confirm("Are you sure? This will overwrite the database with fresh seed data and erase dummy scores.")) {
      return;
    }
    setLoading(true);
    try {
      await startTournamentAction();
      localStorage.setItem("app_mode", "real");
      setShow(false);
      window.location.reload();
    } catch (e) {
      alert("Failed to start tournament");
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 text-center">Welcome!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          Please select how you want to run the application.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleDemo}
            disabled={loading}
            className="flex items-center p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl text-indigo-600 dark:text-indigo-400 mr-4 shrink-0">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Demo Version</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Explore the app with dummy data and pre-filled scores.</p>
            </div>
          </button>

          <button 
            onClick={handleStart}
            disabled={loading}
            className="flex items-center p-4 rounded-2xl border-2 border-rose-200 dark:border-rose-900/50 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left opacity-100 disabled:opacity-50"
          >
            <div className="bg-rose-100 dark:bg-rose-900/50 p-3 rounded-xl text-rose-600 dark:text-rose-400 mr-4 shrink-0">
              <PlayCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                Start Match <span className="text-[10px] uppercase bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">Reset Data</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Resets the database, clears all dummy scores, and updates teams & players.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
