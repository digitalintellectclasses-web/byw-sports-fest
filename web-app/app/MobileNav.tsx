"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users, Trophy, BookOpen, Settings } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Matches", href: "/matches", icon: <CalendarDays size={20} /> },
    { name: "Teams", href: "/teams", icon: <Users size={20} /> },
    { name: "Standings", href: "/standings", icon: <Trophy size={20} /> },
    { name: "Rules", href: "/rules", icon: <BookOpen size={20} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-sm">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-2 flex justify-between items-center relative overflow-hidden ring-1 ring-slate-900/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 pointer-events-none"></div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`relative z-10 flex flex-col items-center justify-center w-[60px] h-[60px] rounded-2xl transition-all duration-300
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300/50 -translate-y-2 scale-110" 
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
                }`}
            >
              {item.icon}
              <span className={`text-[9px] mt-1 font-bold ${isActive ? "opacity-100" : "opacity-0 h-0 hidden"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
