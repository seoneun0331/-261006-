'use client';

import React, { useState } from 'react';
import { Simulation, Comment } from '@/types';
import PendulumSim from './simulations/PendulumSim';
import OpticsSim from './simulations/OpticsSim';
import WaveSim from './simulations/WaveSim';
import CommentSection from './CommentSection';
import { Heart, BookOpen, GraduationCap, CheckCircle2, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface SimulationCardProps {
  simulation: Simulation;
  comments: Comment[];
  onOpenQuiz: (sim: Simulation) => void;
}

export default function SimulationCard({
  simulation,
  comments,
  onOpenQuiz
}: SimulationCardProps) {
  const [likes, setLikes] = useState<number>(simulation.likes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showTeacherNote, setShowTeacherNote] = useState<boolean>(true);

  const handleLikeToggle = async () => {
    const nextLiked = !isLiked;
    const nextLikes = nextLiked ? likes + 1 : Math.max(0, likes - 1);
    setIsLiked(nextLiked);
    setLikes(nextLikes);

    try {
      await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulationId: simulation.id, increment: nextLiked })
      });
    } catch {
      // ignore
    }
  };

  return (
    <article className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden transition-all duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {simulation.subject}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-300/30">
              {simulation.targetGrade}
            </span>
            <span className="text-xs text-slate-400">
              작성: {simulation.author}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {simulation.title}
          </h3>
        </div>

        {/* Actions: Like button & Quiz Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Neumorphic Like Toggle Button */}
          <button
            onClick={handleLikeToggle}
            className={`neu-button px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all ${
              isLiked
                ? 'active text-rose-500 ring-2 ring-rose-400/50'
                : 'text-slate-600 dark:text-slate-300'
            }`}
            title="좋아요"
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isLiked ? 'fill-rose-500 scale-110' : 'hover:scale-110'
              }`}
            />
            <span>{likes}</span>
          </button>

          {/* Quiz / Assessment Button */}
          <button
            onClick={() => onOpenQuiz(simulation)}
            className="neu-button px-4 py-2.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:scale-105"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>탐구 퀴즈 도전</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {simulation.description}
      </p>

      {/* Learning Objectives */}
      <div className="neu-inset p-4 rounded-2xl flex flex-col gap-2">
        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          학습 성취 기준 및 탐구 목표
        </h5>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {simulation.learningObjectives.map((obj, i) => (
            <li
              key={i}
              className="text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-white/40 dark:border-slate-700/50 flex items-start gap-1.5"
            >
              <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Teacher Note Toggle */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setShowTeacherNote(!showTeacherNote)}
          className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors w-full p-1"
        >
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            교사 지도 길잡이 & 수업 팁
          </span>
          {showTeacherNote ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {showTeacherNote && (
          <div className="glass-panel p-3.5 rounded-xl border-l-4 border-l-blue-500 text-xs text-slate-700 dark:text-slate-200 bg-blue-50/30 dark:bg-blue-950/20">
            {simulation.teacherNote}
          </div>
        )}
      </div>

      {/* Interactive Simulation Frame */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            [교사 시뮬레이션 인터랙티브 교구]
          </span>
          <span className="text-[11px] text-slate-400">슬라이더를 조작하여 실시간 반응을 확인하세요</span>
        </div>

        <div className="bg-slate-100/60 dark:bg-slate-900/60 rounded-3xl border border-white/60 dark:border-white/5 overflow-hidden">
          {simulation.type === 'pendulum' && <PendulumSim />}
          {simulation.type === 'optics' && <OpticsSim />}
          {simulation.type === 'wave' && <WaveSim />}
        </div>
      </div>

      {/* Student Comments Section */}
      <CommentSection
        simulationId={simulation.id}
        initialComments={comments}
      />
    </article>
  );
}
