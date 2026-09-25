const fs = require('fs');

// Fix layout.tsx - the template literal in className was mangled by PowerShell heredoc interpolation
const correctContent = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import LiveTicker from "./components/LiveTicker";
import AutoRefresh from "./components/AutoRefresh";
import { getAnnouncements, getRecentMatches } from "./lib/data";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BYW Sports Fest Live",
  description: "Brotherhood Youth Sports Fest Tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcements = await getAnnouncements();
  const recentMatches = await getRecentMatches();
  const isAdmin = (await cookies()).get("admin_session")?.value === "true";

  return (
    <html lang="en" className={\`\${geistSans.variable} \${geistMono.variable} antialiased h-full\`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col selection:bg-indigo-500 selection:text-white bg-transparent dark:bg-black transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50/50 dark:bg-black/90 transition-colors duration-300">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/60 dark:bg-indigo-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob"></div>
            <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] bg-purple-200/60 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-pink-200/60 dark:bg-pink-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-amber-100/50 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,rgba(248,250,252,0.9)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(10,10,10,0.9)_100%)]"></div>
          </div>

          <LiveTicker announcements={announcements} recentMatches={recentMatches} />

          <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
                    SF
                  </div>
                  <div className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400">
                    BYW Sports Fest
                  </div>
                </div>
                <DesktopNav isAdmin={isAdmin} />
              </div>
            </div>
          </header>
          <MobileNav isAdmin={isAdmin} />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 md:pb-10">
            {children}
          </main>
          <AutoRefresh />
        </ThemeProvider>
      </body>
    </html>
  );
}
`;

fs.writeFileSync('app/layout.tsx', correctContent, 'utf8');
console.log('layout.tsx fixed!');
