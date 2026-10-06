'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SimulationCard from '@/components/SimulationCard';
import QuizModal from '@/components/QuizModal';
import LeaderboardModal from '@/components/LeaderboardModal';
import { Simulation, Comment, LeaderboardEntry } from '@/types';
import { INITIAL_SIMULATIONS, INITIAL_COMMENTS, INITIAL_LEADERBOARD } from '@/lib/mockData';
import { Sparkles, Database } from 'lucide-react';

export default function HomePage() {
  const [simulations, setSimulations] = useState<Simulation[]>(INITIAL_SIMULATIONS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeQuizSim, setActiveQuizSim] = useState<Simulation | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    async function loadData() {
      try {
        const [simRes, comRes, lbRes] = await Promise.all([
          fetch('/api/simulations'),
          fetch('/api/comments'),
          fetch('/api/leaderboard')
        ]);
        if (simRes.ok) {
          const simData = await simRes.json();
          if (Array.isArray(simData) && simData.length > 0) setSimulations(simData);
        }
        if (comRes.ok) {
          const comData = await comRes.json();
          if (Array.isArray(comData) && comData.length > 0) setComments(comData);
        }
        if (lbRes.ok) {
          const lbData = await lbRes.json();
          if (Array.isArray(lbData) && lbData.length > 0) setLeaderboard(lbData);
        }
      } catch {
        // Safe mock fallback
      }
    }
    loadData();
  }, []);

  const safeSimulations = Array.isArray(simulations) ? simulations : INITIAL_SIMULATIONS;
  const safeComments = Array.isArray(comments) ? comments : INITIAL_COMMENTS;
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : INITIAL_LEADERBOARD;

  const filteredSimulations = safeSimulations.filter((s) => {
    if (!s) return false;
    if (activeFilter === 'all') return true;
    return s.subject === activeFilter;
  });

  const handleScoreSubmitted = (entry: LeaderboardEntry) => {
    setLeaderboard(prev => [entry, ...(prev || [])]);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Sticky Header */}
      <Navbar onOpenLeaderboard={() => setIsLeaderboardOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Hero Section with Glass & Neumorphic styling */}
        <section className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2026 차세대 미래지향 교육용 디지털 교구</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                교사의 수업 시뮬레이션 & <br className="hidden sm:inline" />
                학생 실시간 탐구 토론 플랫폼
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                직접 변수를 조작하며 자연법칙의 원리를 직관적으로 이해하고, 
                학생들의 자유로운 질문과 토론 의견을 나누는 살아있는 인터랙티브 실험실입니다.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="neu-inset p-4 rounded-2xl flex flex-col gap-2 shrink-0 md:w-64">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                인프라 최적화 상태
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span>Vercel 함수:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">icn1 (서울)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Supabase DB:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">ap-northeast-2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>RTT 응답속도:</span>
                  <span className="font-semibold text-blue-500">&lt; 5ms 극초저지연</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
            <span className="text-xs font-bold text-slate-500 mr-2">교과 영역:</span>
            {[
              { id: 'all', label: '전체 교구 보기' },
              { id: '물리', label: '물리학 (단진자/역학)' },
              { id: '광학', label: '광학 (스넬의법칙/전반사)' },
              { id: '파동/수학', label: '파동/수학 (푸리에합성)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`neu-button px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? 'active text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/40'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Simulation Cards List */}
        <section className="flex flex-col gap-8">
          {filteredSimulations.map((sim) => (
            <SimulationCard
              key={sim.id}
              simulation={sim}
              comments={safeComments.filter((c) => c.simulationId === sim.id)}
              onOpenQuiz={(s) => setActiveQuizSim(s)}
            />
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/40 mt-12 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              김선은시뮬레이션(시험)(261006)
            </span>
            <span>· 중·고등 교육용 시뮬레이션 교구</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Region: Seoul (icn1 / ap-northeast-2)</span>
            <span>Next.js 14 &amp; Supabase</span>
            <span>© 2026 김선은 교사 All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Quiz Modal */}
      {activeQuizSim && (
        <QuizModal
          simulation={activeQuizSim}
          onClose={() => setActiveQuizSim(null)}
          onScoreSubmitted={handleScoreSubmitted}
        />
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={safeLeaderboard}
      />
    </div>
  );
}
