'use client';

import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Atom, Trophy, Server, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenLeaderboard: () => void;
}

export default function Navbar({ onOpenLeaderboard }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/50 backdrop-blur-xl px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-button flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Atom className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                김선은시뮬레이션(시험)(261006)
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Vercel icn1 서울
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              중·고등학교 교사와 학생을 위한 인터랙티브 탐구 교구 플랫폼
            </p>
          </div>
        </div>

        {/* Right Menu Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="neu-button px-3.5 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:scale-105 transition-all"
            title="실시간 명예의 전당"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">명예의 전당</span>
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
