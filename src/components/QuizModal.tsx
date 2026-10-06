'use client';

import React, { useState } from 'react';
import { Simulation, LeaderboardEntry } from '@/types';
import { X, Award, CheckCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  simulation: Simulation | null;
  onClose: () => void;
  onScoreSubmitted: (entry: LeaderboardEntry) => void;
}

interface Question {
  q: string;
  options: string[];
  answer: number;
}

const QUIZZES: Record<string, Question[]> = {
  pendulum: [
    {
      q: '단진자의 진폭이 충분히 작을 때, 왕복 주기 T에 직접적인 영향을 주는 요인은 무엇인가요?',
      options: ['추의 질량 (m)', '실의 길이 (L)', '추의 부피', '실의 색깔'],
      answer: 1
    },
    {
      q: '지구(g=9.8)에서 주기가 2초인 단진자를 중력이 약한 달(g=1.62)로 가져가면 주기는 어떻게 될까요?',
      options: ['더 짧아진다 (빨라진다)', '더 길어진다 (느려진다)', '변함없다', '정지한다'],
      answer: 1
    },
    {
      q: '실의 길이를 4배로 늘리면 단진자의 주기는 몇 배가 될까요?',
      options: ['1/2배', '2배', '4배', '16배'],
      answer: 1
    }
  ],
  optics: [
    {
      q: '빛이 굴절률이 큰 매질에서 작은 매질로 진행할 때, 입사각이 임계각보다 커지면 발생하는 현상은?',
      options: ['빛의 흡수', '전반사 (Total Internal Reflection)', '빛의 분산', '간섭'],
      answer: 1
    },
    {
      q: '스넬의 법칙 공식으로 올바른 것은?',
      options: ['n₁·sinθ₁ = n₂·sinθ₂', 'n₁·cosθ₁ = n₂·cosθ₂', 'n₁ / n₂ = sinθ₁ / sinθ₂', 'n₁·n₂ = sinθ₁·sinθ₂'],
      answer: 0
    },
    {
      q: '현대 인터넷 통신의 핵심인 광섬유(광케이블)는 빛의 어떤 성질을 응용한 것인가요?',
      options: ['편광', '전반사', '회절', '산란'],
      answer: 1
    }
  ],
  wave: [
    {
      q: '두 파동이 중첩될 때, 어느 한 점에서의 합성 변위는 두 변위의 대수적 합과 같다는 원리는?',
      options: ['파동의 독립성', '중첩의 원리', '도플러 효과', '하위헌스의 원리'],
      answer: 1
    },
    {
      q: '푸리에 급수(Fourier Series)에 따르면 복잡한 주기 함수는 어떤 기본 파동들의 합으로 표현될 수 있나요?',
      options: ['정사각형 파동', '단순 사인(사인/코사인) 함수', '지수 함수', '로그 함수'],
      answer: 1
    },
    {
      q: '기본 주파수(f₁) 외에 3f₁, 5f₁ 등의 고조파(배음)의 비율에 따라 결정되는 소리의 요소는?',
      options: ['소리의 세기', '소리의 높낮이', '소리의 맵시 (음색)', '소리의 전파 속도'],
      answer: 2
    }
  ]
};

export default function QuizModal({
  simulation,
  onClose,
  onScoreSubmitted
}: QuizModalProps) {
  if (!simulation) return null;

  const questions = QUIZZES[simulation.type] || QUIZZES.pendulum;

  const [nickname, setNickname] = useState('');
  const [schoolGrade, setSchoolGrade] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleSelect = (qIdx: number, optIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setFinalScore(score);
    setIsFinished(true);

    if (score >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }

    const entry: LeaderboardEntry = {
      id: 'lb-' + Date.now(),
      nickname: nickname.trim(),
      schoolGrade: schoolGrade.trim() || '학생',
      score,
      simulationTitle: simulation.title,
      playedAt: new Date().toLocaleString('ko-KR')
    };

    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch {
      // ignore
    }

    onScoreSubmitted(entry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl border border-white/60 dark:border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full neu-button text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1">
            <Award className="w-4 h-4" />
            탐구 성취도 퀴즈 & 랭킹 등록
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {simulation.title}
          </h3>
        </div>

        {!isFinished ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* User Info */}
            <div className="neu-inset p-3.5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  닉네임 (필수)
                </label>
                <input
                  type="text"
                  placeholder="예: 물리탐구왕"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-white/70 dark:bg-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  학교 및 학년
                </label>
                <input
                  type="text"
                  placeholder="예: 서울중 2학년"
                  value={schoolGrade}
                  onChange={(e) => setSchoolGrade(e.target.value)}
                  className="w-full bg-white/70 dark:bg-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-4">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="neu-inset p-4 rounded-2xl flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      Q{qIdx + 1}
                    </span>
                    <span>{q.q}</span>
                  </span>

                  <div className="grid grid-cols-1 gap-1.5 mt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={`text-left text-xs p-2.5 rounded-xl transition-all border ${
                            isSelected
                              ? 'bg-blue-500 text-white font-bold border-blue-600 shadow-md'
                              : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {optIdx + 1}. {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={!nickname.trim() || Object.keys(selectedAnswers).length < questions.length}
              className="neu-button py-3 rounded-2xl text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 disabled:opacity-40 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>퀴즈 답안 제출 및 랭킹 등록</span>
            </button>
          </form>
        ) : (
          /* Finished Result View */
          <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
            <div className="w-20 h-20 rounded-full neu-button flex items-center justify-center text-amber-500 animate-bounce">
              <Award className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                퀴즈 채점 완료!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {nickname} 학생의 탐구 점수가 리더보드에 기록되었습니다.
              </p>
            </div>
            <div className="text-4xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {finalScore}점 <span className="text-sm font-normal text-slate-400">/ 100점</span>
            </div>
            <button
              onClick={onClose}
              className="neu-button px-6 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              확인 및 리더보드 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
