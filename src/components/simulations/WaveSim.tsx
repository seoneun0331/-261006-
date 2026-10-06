'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Waves, Volume2, Sliders, Music } from 'lucide-react';

interface WavePreset {
  name: string;
  harmonics: number[];
}

const PRESETS: WavePreset[] = [
  { name: '순수 기본음 (Pure Sine)', harmonics: [1.0, 0, 0, 0] },
  { name: '사각파 합성 (Square Wave)', harmonics: [1.0, 0.33, 0.2, 0.14] },
  { name: '삼각파 합성 (Triangle Wave)', harmonics: [1.0, 0.11, 0.04, 0.02] },
  { name: '풍부한 배음 (Rich Harmonics)', harmonics: [0.8, 0.6, 0.4, 0.2] }
];

export default function WaveSim() {
  const [harmonics, setHarmonics] = useState<number[]>([1.0, 0.33, 0.2, 0]);
  const [speed, setSpeed] = useState<number>(2.0);
  const [showComponents, setShowComponents] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      phaseRef.current += speed * dt * 3;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          const centerY = height / 2;

          ctx.clearRect(0, 0, width, height);

          // Grid
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = 1;
          for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Center axis
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, centerY);
          ctx.lineTo(width, centerY);
          ctx.stroke();
          ctx.setLineDash([]);

          const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

          // Draw Component waves if enabled
          if (showComponents) {
            harmonics.forEach((amp, idx) => {
              if (amp <= 0.01) return;
              const n = idx * 2 + 1; // 1, 3, 5, 7 harmonics
              ctx.strokeStyle = colors[idx % colors.length];
              ctx.lineWidth = 1.2;
              ctx.beginPath();

              for (let x = 0; x < width; x++) {
                const k = (2 * Math.PI * n) / width;
                const y = centerY - amp * 40 * Math.sin(k * x - n * phaseRef.current);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            });
          }

          // Draw Resulting Composite Wave
          ctx.strokeStyle = '#8b5cf6'; // Violet glowing main wave
          ctx.lineWidth = 3.5;
          ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
          ctx.shadowBlur = 10;
          ctx.beginPath();

          for (let x = 0; x < width; x++) {
            let totalY = 0;
            harmonics.forEach((amp, idx) => {
              const n = idx * 2 + 1;
              const k = (2 * Math.PI * n) / width;
              totalY += amp * 40 * Math.sin(k * x - n * phaseRef.current);
            });

            const finalY = centerY - totalY;
            if (x === 0) ctx.moveTo(x, finalY);
            else ctx.lineTo(x, finalY);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [harmonics, speed, showComponents]);

  const updateHarmonic = (idx: number, value: number) => {
    const updated = [...harmonics];
    updated[idx] = value;
    setHarmonics(updated);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Wave Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center neu-inset rounded-2xl p-4 relative overflow-hidden min-h-[360px]">
        <canvas
          ref={canvasRef}
          width={480}
          height={380}
          className="w-full max-w-[480px] h-[340px] rounded-xl"
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[11px] font-medium">
          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
            <span className="w-3 h-1 bg-purple-500 rounded-full inline-block" />
            최종 합성 파동
          </span>
          {showComponents && (
            <>
              <span className="flex items-center gap-1 text-blue-500">
                <span className="w-2.5 h-0.5 bg-blue-500 rounded-full inline-block" />
                1차(기본음)
              </span>
              <span className="flex items-center gap-1 text-emerald-500">
                <span className="w-2.5 h-0.5 bg-emerald-500 rounded-full inline-block" />
                3차 고조파
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-2.5 h-0.5 bg-amber-500 rounded-full inline-block" />
                5차 고조파
              </span>
              <span className="flex items-center gap-1 text-pink-500">
                <span className="w-2.5 h-0.5 bg-pink-500 rounded-full inline-block" />
                7차 고조파
              </span>
            </>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-72 flex flex-col gap-4">
        {/* Presets */}
        <div className="neu-inset p-3.5 rounded-2xl flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-purple-500" />
            파형 프리셋 선택
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setHarmonics(p.harmonics)}
                className="text-[11px] py-1.5 px-2 rounded-xl bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-500/10 hover:text-purple-600 font-medium transition-all text-left truncate border border-slate-200 dark:border-slate-700"
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Harmonics Sliders */}
        <div className="neu-inset p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>고조파 배음 진폭 조절</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-500">
              <input
                type="checkbox"
                checked={showComponents}
                onChange={(e) => setShowComponents(e.target.checked)}
                className="rounded accent-purple-600 cursor-pointer"
              />
              성분파 표시
            </label>
          </div>

          {[
            { label: '1차 기본음 (f₁)', val: harmonics[0], idx: 0, color: 'text-blue-500' },
            { label: '3차 배음 (3f₁)', val: harmonics[1], idx: 1, color: 'text-emerald-500' },
            { label: '5차 배음 (5f₁)', val: harmonics[2], idx: 2, color: 'text-amber-500' },
            { label: '7차 배음 (7f₁)', val: harmonics[3], idx: 3, color: 'text-pink-500' }
          ].map((h) => (
            <div key={h.label}>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className={`font-semibold ${h.color}`}>{h.label}</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{h.val.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1.0}
                step={0.05}
                value={h.val}
                onChange={(e) => updateHarmonic(h.idx, parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          ))}

          {/* Speed slider */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-[11px] mb-0.5 text-slate-600 dark:text-slate-400">
              <span>진행 속도</span>
              <span className="font-mono">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={4.0}
              step={0.5}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Theory Card */}
        <div className="glass-panel p-3.5 rounded-2xl border border-white/50 text-xs flex flex-col gap-1.5">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-purple-500" />
            푸리에 파동 급수:
          </span>
          <code className="text-center bg-white/70 dark:bg-slate-800/70 py-1.5 rounded-lg text-purple-600 dark:text-purple-300 font-mono font-bold">
            y(x,t) = Σ Aₙ · sin(n(kx - ωt))
          </code>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            복잡한 악기의 음색과 주기적인 파형은 서로 다른 주파수를 갖는 단순한 사인파들의 합으로 완전히 표현할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
