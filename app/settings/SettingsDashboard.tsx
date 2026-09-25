"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateRules, addParticipant, resetTournamentData } from "./actions";

import { Settings, Users, FileText, AlertTriangle, CheckCircle2, Save, RotateCcw, LogOut } from "lucide-react";

export default function SettingsDashboard({ initialRules, teams }: { initialRules: string, teams: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Rules");
  const [rulesInput, setRulesInput] = useState(initialRules);
  const [rulesStatus, setRulesStatus] = useState("");

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };
  
  const [playerForm, setPlayerForm] = useState({ code: "", name: "", gender: "Male", teamId: teams[0]?.id || "" });
  const [playerStatus, setPlayerStatus] = useState("");

  const [resetStatus, setResetStatus] = useState("");

  const handleSaveRules = async () => {
    setRulesStatus("Saving...");
    try {
      // Validate JSON first
      JSON.parse(rulesInput);
      const res = await updateRules(rulesInput);
      if (res.success) {
        setRulesStatus("Saved successfully!");
        setTimeout(() => setRulesStatus(""), 3000);
      } else {
        setRulesStatus("Error saving.");
      }
    } catch (e) {
      setRulesStatus("Invalid JSON Format.");
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlayerStatus("Adding...");
    const res = await addParticipant(playerForm);
    if (res.success) {
      setPlayerStatus("Player added successfully!");
      setPlayerForm({ ...playerForm, code: "", name: "" }); // reset text inputs
      setTimeout(() => setPlayerStatus(""), 3000);
    } else {
      setPlayerStatus(res.error || "Error adding player.");
    }
  };

  const handleReset = async () => {
    if (confirm("WARNING: This will erase all match scores, winners, and team penalties! Are you absolutely sure?")) {
      setResetStatus("Resetting...");
      const res = await resetTournamentData();
      if (res.success) {
        setResetStatus("Data reset successfully!");
        setTimeout(() => setResetStatus(""), 3000);
      } else {
        setResetStatus("Error resetting data.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800 text-white rounded-xl">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500">Manage tournament rules, participants, and data.</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full lg:w-1/4 shrink-0">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-3 lg:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("Rules")}
              className={`shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:py-3 rounded-2xl text-left transition-all font-semibold ${
                activeTab === "Rules" ? "bg-slate-800 dark:bg-slate-700 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileText size={18} /> <span className="whitespace-nowrap">Edit Rules</span>
            </button>
            <button
              onClick={() => setActiveTab("Participants")}
              className={`shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:py-3 rounded-2xl text-left transition-all font-semibold ${
                activeTab === "Participants" ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Users size={18} /> <span className="whitespace-nowrap">Add Participant</span>
            </button>
            <button
              onClick={() => setActiveTab("Danger")}
              className={`shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:py-3 rounded-2xl text-left transition-all font-semibold ${
                activeTab === "Danger" ? "bg-rose-600 dark:bg-rose-500 text-white shadow-md" : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30"
              }`}
            >
              <AlertTriangle size={18} /> <span className="whitespace-nowrap">Danger Zone</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-3/4">
          
          {activeTab === "Rules" && (
            <div className="animate-fade-in-up bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Tournament Rules Configuration</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Modify the JSON configuration to instantly update the Rules page across the application.</p>
              
              <textarea 
                value={rulesInput}
                onChange={(e) => setRulesInput(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm bg-slate-900 dark:bg-black text-slate-300 rounded-xl border border-slate-700 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                spellCheck="false"
              />
              
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-sm font-bold ${rulesStatus.includes("Error") || rulesStatus.includes("Invalid") ? "text-rose-500" : "text-emerald-500"}`}>
                  {rulesStatus}
                </span>
                <button 
                  onClick={handleSaveRules}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Save size={18} /> Save Rules
                </button>
              </div>
            </div>
          )}

          {activeTab === "Participants" && (
            <div className="animate-fade-in-up bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Register New Participant</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add a new player to a team. Ensure the Player Code is strictly unique.</p>
              
              <form onSubmit={handleAddPlayer} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Player Code (Unique ID)</label>
                  <input required type="text" value={playerForm.code} onChange={(e) => setPlayerForm({...playerForm, code: e.target.value})} placeholder="e.g. M1_G2" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input required type="text" value={playerForm.name} onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})} placeholder="e.g. John Doe" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select value={playerForm.gender} onChange={(e) => setPlayerForm({...playerForm, gender: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Team</label>
                  <select required value={playerForm.teamId} onChange={(e) => setPlayerForm({...playerForm, teamId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-2 flex items-center justify-between">
                  <span className={`text-sm font-bold ${playerStatus.includes("Error") ? "text-rose-500" : "text-emerald-500"}`}>
                    {playerStatus}
                  </span>
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
                    <Users size={18} /> Add Player
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "Danger" && (
            <div className="animate-fade-in-up bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-6 border border-rose-200 dark:border-rose-900/50 shadow-sm ring-1 ring-rose-50 dark:ring-rose-900/20">
              <h2 className="text-xl font-bold text-rose-800 dark:text-rose-500 mb-2">Danger Zone</h2>
              <p className="text-sm text-rose-600 dark:text-rose-400 mb-6">Actions here are destructive and cannot be easily undone.</p>
              
              <div className="p-5 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-rose-900 dark:text-rose-400">Factory Reset Tournament Data</h4>
                  <p className="text-sm text-rose-700 dark:text-rose-500 mt-1">This will erase all match scores, remove winners, and reset team penalty points to zero. Player and Team lists will remain intact.</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="shrink-0 flex items-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                  <RotateCcw size={18} /> Reset Data
                </button>
              </div>
              
              {resetStatus && (
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-center">
                  <CheckCircle2 className="inline mr-2" size={18}/> {resetStatus}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
