import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_LEADERBOARD } from '@/lib/mockData';
import { LeaderboardEntry } from '@/types';

export const runtime = 'nodejs';

let memoryLeaderboard: LeaderboardEntry[] = [...INITIAL_LEADERBOARD];

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const mapped: LeaderboardEntry[] = data.map((d: any) => ({
          id: d.id,
          nickname: d.nickname,
          schoolGrade: d.school_grade || d.schoolGrade || '학생',
          score: d.score,
          simulationTitle: d.simulation_title || d.simulationTitle || '시뮬레이션',
          playedAt: d.played_at || d.playedAt || new Date().toLocaleString('ko-KR')
        }));
        return NextResponse.json(mapped);
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json(memoryLeaderboard);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry: LeaderboardEntry = {
      id: body.id || 'lb-' + Date.now(),
      nickname: body.nickname,
      schoolGrade: body.schoolGrade || '학생',
      score: body.score,
      simulationTitle: body.simulationTitle || '시뮬레이션',
      playedAt: body.playedAt || new Date().toLocaleString('ko-KR')
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leaderboard').insert({
          id: entry.id,
          nickname: entry.nickname,
          school_grade: entry.schoolGrade,
          score: entry.score,
          simulation_title: entry.simulationTitle,
          played_at: entry.playedAt
        });
      } catch {
        // Fallback
      }
    }

    memoryLeaderboard = [entry, ...memoryLeaderboard];
    return NextResponse.json(entry, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
