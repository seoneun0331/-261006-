import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_SIMULATIONS } from '@/lib/mockData';

export const runtime = 'nodejs';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    } catch {
      // Fallback to mock data
    }
  }

  return NextResponse.json(INITIAL_SIMULATIONS);
}
