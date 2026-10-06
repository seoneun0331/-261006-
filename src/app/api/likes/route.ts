import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { simulationId, increment } = await request.json();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('simulations')
          .select('likes')
          .eq('id', simulationId)
          .single();

        if (data) {
          const nextLikes = increment ? (data.likes || 0) + 1 : Math.max(0, (data.likes || 0) - 1);
          await supabase
            .from('simulations')
            .update({ likes: nextLikes })
            .eq('id', simulationId);
          return NextResponse.json({ likes: nextLikes });
        }
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
