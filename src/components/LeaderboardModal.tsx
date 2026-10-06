'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types';
import { X, Trophy, Medal, Flame } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
}

export default function LeaderboardModal({
  isOpen,
  onClose,
  entries = []
}: LeaderboardModalProps) {
  if (!isOpen) return null;

  const safeEntries = Array.isArray(entries) ? entries : [];
  const sorted = [...safeEntries].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl border border-white/60 dark:border-white/10 max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full neu-button text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl neu-button flex items-center justify-center text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              실시간 명예의 전당 랭킹
              <Flame className="w-5 h-5 text-rose-500" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              시뮬레이션 탐구 퀴즈에 참여한 학생들의 최고 점수 리더보드입니다.
            </p>
          </div>
        </div>

        {/* Table / List */}
        <div className="neu-inset p-3 rounded-2xl flex flex-col gap-2">
          {sorted.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              아직 등록된 탐구 점수가 없습니다. 시뮬레이션 퀴즈에 도전해 보세요!
            </div>
          ) : (
            sorted.map((item, idx) => {
              const isTop3 = idx < 3;
              const rankColor =
                idx === 0
                  ? 'text-amber-500 bg-amber-500/10'
                  : idx === 1
                  ? 'text-slate-400 bg-slate-400/10'
                  : idx === 2
                  ? 'text-amber-700 bg-amber-700/10'
                  : 'text-slate-500 bg-slate-500/10';

              return (
                <div
                  key={item.id}
                  className="glass-panel p-3 sm:p-4 rounded-xl flex items-center justify-between gap-3 border border-white/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${rankColor}`}
                    >
                      {isTop3 ? (
                        <Medal className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {item.nickname}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium shrink-0">
                          {item.schoolGrade}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.simulationTitle} · {item.playedAt}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-lg font-black font-mono text-blue-600 dark:text-blue-400">
                      {item.score}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-0.5">점</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
