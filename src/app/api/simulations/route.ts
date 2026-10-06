import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_SIMULATIONS } from '@/lib/mockData';
import { Simulation } from '@/types';

export const runtime = 'nodejs';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database snake_case fields to camelCase Simulation interface
        const mapped: Simulation[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          subject: d.subject || '물리',
          targetGrade: d.target_grade || d.targetGrade || '',
          author: d.author || '김선은 교사',
          description: d.description || d.content || '',
          learningObjectives: Array.isArray(d.learning_objectives)
            ? d.learning_objectives
            : Array.isArray(d.learningObjectives)
            ? d.learningObjectives
            : [
                '시뮬레이션 변수 조작을 통해 물리 법칙을 탐구한다.',
                '실험 결과를 그래프 및 수치로 분석한다.',
                '생활 속 과학 기술과의 연계성을 설명할 수 있다.'
              ],
          teacherNote: d.teacher_note || d.teacherNote || '',
          likes: typeof d.likes === 'number' ? d.likes : 0,
          commentsCount: typeof d.comments_count === 'number' ? d.comments_count : 0,
          createdAt: d.created_at || d.createdAt || new Date().toISOString(),
          type: (d.type as any) || 'pendulum'
        }));
        return NextResponse.json(mapped);
      }
    } catch {
      // Fallback to mock data
    }
  }

  return NextResponse.json(INITIAL_SIMULATIONS);
}
