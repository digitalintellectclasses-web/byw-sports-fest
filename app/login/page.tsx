"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { authenticate } from "./actions";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authenticate(pin);
    if (success) {
      router.push("/settings");
    } else {
      setError("Invalid PIN");
      setPin("");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-slate-600 dark:text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Login</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">Enter the admin PIN to access settings and manage the tournament.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-3xl tracking-[1em] font-mono py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••"
              autoFocus
            />
          </div>
          {error && <p className="text-rose-500 text-sm font-semibold animate-pulse">{error}</p>}
          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
