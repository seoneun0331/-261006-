import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_COMMENTS } from '@/lib/mockData';
import { Comment } from '@/types';

export const runtime = 'nodejs';

let memoryComments: Comment[] = [...INITIAL_COMMENTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const simulationId = searchParams.get('simulationId');

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('comments').select('*').order('created_at', { ascending: false });
      if (simulationId) {
        query = query.eq('simulation_id', simulationId);
      }
      const { data, error } = await query;
      if (!error && data) {
        const mapped: Comment[] = data.map((d: any) => ({
          id: d.id,
          simulationId: d.simulation_id || d.simulationId,
          studentName: d.student_name || d.author || d.studentName,
          gradeClass: d.grade_class || d.gradeClass || '',
          content: d.content,
          createdAt: d.created_at || d.createdAt
        }));
        return NextResponse.json(mapped);
      }
    } catch {
      // Fallback to memory
    }
  }

  const filtered = simulationId
    ? memoryComments.filter((c) => c.simulationId === simulationId)
    : memoryComments;

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newComment: Comment = {
      id: body.id || 'c-' + Date.now(),
      simulationId: body.simulationId,
      studentName: body.studentName,
      gradeClass: body.gradeClass || '',
      content: body.content,
      createdAt: body.createdAt || new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('comments').insert({
          id: newComment.id,
          simulation_id: newComment.simulationId,
          student_name: newComment.studentName,
          grade_class: newComment.gradeClass,
          content: newComment.content,
          created_at: newComment.createdAt
        });
      } catch {
        // Fallback
      }
    }

    memoryComments = [newComment, ...memoryComments];
    return NextResponse.json(newComment, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('comments').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
    memoryComments = memoryComments.filter(c => c.id !== id);
  }
  return NextResponse.json({ success: true });
}
