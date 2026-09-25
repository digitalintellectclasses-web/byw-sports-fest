const fs = require('fs');

const desktopNav = `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DesktopNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Matches", href: "/matches" },
    { name: "Teams", href: "/teams" },
    { name: "Standings", href: "/standings" },
    { name: "Rules", href: "/rules" },
    { name: isAdmin ? "Settings" : "Referee Login", href: isAdmin ? "/settings" : "/login" },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.name}
            href={item.href} 
            className={\`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2
              \${isActive 
                ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm" 
                : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800"
              }\`}
          >
            {item.name}
          </Link>
        );
      })}
      
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="ml-2 p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      )}
    </nav>
  );
}
`;
fs.writeFileSync('app/DesktopNav.tsx', desktopNav, 'utf8');
console.log('DesktopNav fixed!');

const mobileNav = `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users, Trophy, BookOpen, Settings, LogIn } from "lucide-react";

export default function MobileNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Matches", href: "/matches", icon: <CalendarDays size={20} /> },
    { name: "Teams", href: "/teams", icon: <Users size={20} /> },
    { name: "Standings", href: "/standings", icon: <Trophy size={20} /> },
    { name: "Rules", href: "/rules", icon: <BookOpen size={20} /> },
    { name: isAdmin ? "Settings" : "Login", href: isAdmin ? "/settings" : "/login", icon: isAdmin ? <Settings size={20} /> : <LogIn size={20} /> },
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
              className={\`relative z-10 flex flex-col items-center justify-center w-[60px] h-[60px] rounded-2xl transition-all duration-300
                \${isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300/50 -translate-y-2 scale-110" 
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
                }\`}
            >
              {item.icon}
              <span className={\`text-[9px] mt-1 font-bold \${isActive ? "opacity-100" : "opacity-0 h-0 hidden"}\`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('app/MobileNav.tsx', mobileNav, 'utf8');
console.log('MobileNav fixed!');
