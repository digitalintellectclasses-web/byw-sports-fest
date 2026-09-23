"use client";

import { useState } from "react";
import { ShieldCheck, BookOpen, ArrowRight, Users as UsersIcon, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

export default function RulesClient({ rulesData }: { rulesData: any }) {
  const [activeTab, setActiveTab] = useState("General");
  
  const { generalRules, participationRules, sportsRules } = rulesData;

  const renderContent = () => {
    if (activeTab === "General") {
      return (
        <div className="animate-fade-in-up space-y-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-100 dark:from-slate-800 to-transparent opacity-50"></div>
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">General Rules</h2>
            </div>
            <div className="grid gap-4 relative">
              {generalRules.map((rule: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{rule.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-8 border border-indigo-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden ring-1 ring-indigo-50 dark:ring-indigo-900/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 dark:from-indigo-900/30 to-transparent opacity-50"></div>
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <UsersIcon size={24} />
              </div>
              <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-400 tracking-tight">Participation Quota</h2>
            </div>
            <div className="grid gap-4 relative">
              {participationRules.map((rule: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/50 hover:shadow-md transition-shadow">
                  <AlertTriangle size={20} className="text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg mb-1">{rule.title}</h4>
                    <p className="text-indigo-800/80 dark:text-indigo-400/80 leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const sport = sportsRules.find((s: any) => s.sport === activeTab);
    if (sport) {
      return (
        <div className="animate-fade-in-up bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className={`p-4 ${sport.color} dark:bg-slate-800 ${sport.textColor} dark:text-slate-200 rounded-2xl`}>
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{sport.sport} Rules</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Specific regulations and formats for {sport.sport}.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sport.rules.map((rule: any, ruleIdx: number) => (
              <div key={ruleIdx} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${sport.activeBg}`}></div>
                  {rule.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Official Rules</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg max-w-2xl">Select a category below to view the comprehensive guidelines and regulations for the Sports Fest.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-1/4 shrink-0">
          <div className="sticky top-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl p-3 lg:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar">
            
            <div className="hidden lg:block px-3 pb-2 pt-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tournament</p>
            </div>
            <button
              onClick={() => setActiveTab("General")}
              className={`shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:py-3 rounded-2xl text-left transition-all duration-300 font-semibold ${
                activeTab === "General" 
                  ? "bg-slate-800 dark:bg-slate-700 text-white shadow-md shadow-slate-200 dark:shadow-none" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BookOpen size={18} className={activeTab === "General" ? "text-slate-300" : "text-slate-400"} />
              <span className="whitespace-nowrap">General & Quota</span>
            </button>

            <div className="hidden lg:block px-3 pb-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sports</p>
            </div>
            
            {sportsRules.map((sport: any) => (
              <button
                key={sport.sport}
                onClick={() => setActiveTab(sport.sport)}
                className={`shrink-0 flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:py-3 rounded-2xl text-left transition-all duration-300 font-semibold group ${
                  activeTab === sport.sport 
                    ? `${sport.activeBg} dark:bg-slate-700 text-white shadow-md` 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className={`${activeTab === sport.sport ? "text-white/80" : sport.textColor}`}>
                  <Activity size={18} />
                </div>
                <span className="whitespace-nowrap">{sport.sport}</span>
                {activeTab !== sport.sport && (
                  <ArrowRight size={16} className="hidden lg:block ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-3/4 min-h-[600px]" key={activeTab}>
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
