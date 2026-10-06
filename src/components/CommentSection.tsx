'use client';

import React, { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { Send, MessageSquare, User, Clock, Trash2 } from 'lucide-react';

interface CommentSectionProps {
  simulationId: string;
  initialComments: Comment[];
  onCommentAdded?: () => void;
}

export default function CommentSection({
  simulationId,
  initialComments = [],
  onCommentAdded
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [studentName, setStudentName] = useState('');
  const [gradeClass, setGradeClass] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Array.isArray(initialComments)) {
      setComments(initialComments);
    }
  }, [initialComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newComment: Comment = {
      id: 'c-' + Date.now(),
      simulationId,
      studentName: studentName.trim(),
      gradeClass: gradeClass.trim() || '학생',
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });
      if (res.ok) {
        const saved = await res.json();
        setComments(prev => [saved, ...(prev || [])]);
      } else {
        setComments(prev => [newComment, ...(prev || [])]);
      }
    } catch {
      setComments(prev => [newComment, ...(prev || [])]);
    }

    setContent('');
    setIsSubmitting(false);
    if (onCommentAdded) onCommentAdded();
  };

  const handleDelete = async (id: string) => {
    setComments(prev => (prev || []).filter(c => c.id !== id));
    try {
      await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return '방금 전';
    }
  };

  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <div className="mt-6 flex flex-col gap-5 pt-5 border-t border-slate-200/60 dark:border-slate-800/60">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          학생 탐구 의견 및 질문 ({safeComments.length})
        </h4>
        <span className="text-[11px] text-slate-400">자유롭게 생각을 나눠보세요</span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="neu-inset p-4 rounded-2xl flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/80 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="이름 (예: 김철수)"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-transparent text-xs w-full outline-none font-medium text-slate-800 dark:text-slate-200"
              required
            />
          </div>
          <div className="bg-white/70 dark:bg-slate-800/80 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="학급 / 소속 (예: 2학년 3반)"
              value={gradeClass}
              onChange={(e) => setGradeClass(e.target.value)}
              className="bg-transparent text-xs w-full outline-none text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <textarea
            placeholder="실험을 조작해보고 발견한 점이나 궁금한 점을 적어주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="flex-1 bg-white/70 dark:bg-slate-800/80 rounded-xl p-2.5 text-xs outline-none border border-slate-200 dark:border-slate-700 resize-none text-slate-800 dark:text-slate-200"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !studentName.trim() || !content.trim()}
            className="neu-button px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-blue-600 dark:text-blue-400 disabled:opacity-50 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>등록</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="flex flex-col gap-3">
        {safeComments.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            아직 등록된 학생 의견이 없습니다. 첫 의견을 남겨보세요!
          </div>
        ) : (
          safeComments.map((c) => (
            <div
              key={c.id}
              className="glass-panel p-3.5 rounded-xl border border-white/50 flex flex-col gap-1.5 hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {c.studentName}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                    {c.gradeClass}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(c.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5"
                    title="댓글 삭제"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
