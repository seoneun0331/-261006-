'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Compass, Activity, Globe } from 'lucide-react';

interface CelestialBody {
  name: string;
  g: number;
}

const CELESTIAL_BODIES: CelestialBody[] = [
  { name: '지구 (Earth - 9.8m/s²)', g: 9.8 },
  { name: '달 (Moon - 1.62m/s²)', g: 1.62 },
  { name: '화성 (Mars - 3.72m/s²)', g: 3.72 },
  { name: '목성 (Jupiter - 24.8m/s²)', g: 24.79 },
  { name: '무중력 우주선 (0.5m/s²)', g: 0.5 }
];

export default function PendulumSim() {
  const [length, setLength] = useState<number>(2.0); // meters
  const [gravity, setGravity] = useState<number>(9.8); // m/s²
  const [mass, setMass] = useState<number>(2.0); // kg
  const [angle, setAngle] = useState<number>(30); // degrees
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physics simulation state (ref for smooth RAF)
  const stateRef = useRef({
    theta: (30 * Math.PI) / 180,
    omega: 0,
    time: 0
  });

  // Calculate theoretical period T = 2 * PI * sqrt(L / g)
  const theoreticalPeriod = (2 * Math.PI * Math.sqrt(length / Math.max(0.1, gravity))).toFixed(2);

  // Reset angle when slider changes manually
  useEffect(() => {
    stateRef.current.theta = (angle * Math.PI) / 180;
    stateRef.current.omega = 0;
  }, [angle]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap delta
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          // Physics update if running
          if (isRunning) {
            // d^2(theta)/dt^2 = -(g / L) * sin(theta) - damping
            const alpha = -(gravity / length) * Math.sin(stateRef.current.theta) - 0.05 * stateRef.current.omega;
            stateRef.current.omega += alpha * dt;
            stateRef.current.theta += stateRef.current.omega * dt;
            stateRef.current.time += dt;
          }

          // Clear Canvas
          ctx.clearRect(0, 0, width, height);

          // Draw grid lines (subtle)
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = 1;
          for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Origin (Pivot)
          const originX = width / 2;
          const originY = 60;

          // Scaling: 1m = 75px
          const pixelLength = length * 75;
          const bobX = originX + pixelLength * Math.sin(stateRef.current.theta);
          const bobY = originY + pixelLength * Math.cos(stateRef.current.theta);

          // Draw Pivot Stand
          ctx.fillStyle = '#64748b';
          ctx.fillRect(originX - 60, originY - 12, 120, 12);
          ctx.beginPath();
          ctx.arc(originX, originY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();

          // Draw Reference Center Vertical Line
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX, originY + pixelLength + 30);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Angle Arc
          ctx.beginPath();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          const arcRadius = 40;
          ctx.arc(originX, originY, arcRadius, Math.PI / 2, Math.PI / 2 + stateRef.current.theta, stateRef.current.theta < 0);
          ctx.stroke();

          // Draw Rod / String
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(bobX, bobY);
          ctx.stroke();

          // Draw Bob (Pendulum Mass)
          const bobRadius = 12 + mass * 2.5;
          ctx.beginPath();
          ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
          gradient.addColorStop(0, '#60a5fa');
          gradient.addColorStop(1, '#1d4ed8');
          ctx.fillStyle = gradient;
          ctx.shadowColor = 'rgba(29, 78, 216, 0.4)';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw velocity vector arrow
          if (isRunning) {
            const vScale = 15;
            const vx = stateRef.current.omega * length * Math.cos(stateRef.current.theta) * vScale;
            const vy = -stateRef.current.omega * length * Math.sin(stateRef.current.theta) * vScale;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bobX, bobY);
            ctx.lineTo(bobX + vx, bobY + vy);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [length, gravity, mass, isRunning]);

  const handleReset = () => {
    stateRef.current.theta = (angle * Math.PI) / 180;
    stateRef.current.omega = 0;
    stateRef.current.time = 0;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Visualizer Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center neu-inset rounded-2xl p-4 relative overflow-hidden min-h-[360px]">
        <canvas
          ref={canvasRef}
          width={480}
          height={380}
          className="w-full max-w-[480px] h-[340px] rounded-xl"
        />

        {/* Realtime Stats Floating Badge */}
        <div className="absolute top-4 left-4 glass-panel px-3 py-2 rounded-xl text-xs flex flex-col gap-1 border border-white/40 shadow-sm">
          <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
            <Activity className="w-3.5 h-3.5" />
            <span>이론 주기 (T): {theoreticalPeriod}초</span>
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            실시간 진각: {((stateRef.current.theta * 180) / Math.PI).toFixed(1)}°
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="neu-button px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 text-amber-500" />
                <span>일시정지</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-500" />
                <span>시작</span>
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="neu-button px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200"
          >
            <RotateCcw className="w-4 h-4 text-blue-500" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* Control Parameters Panel */}
      <div className="w-full lg:w-72 flex flex-col gap-4">
        {/* Preset Gravity selection */}
        <div className="neu-inset p-3.5 rounded-2xl flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-500" />
            천체 중력 환경 프리셋
          </label>
          <select
            value={gravity}
            onChange={(e) => setGravity(parseFloat(e.target.value))}
            className="bg-white/80 dark:bg-slate-800 text-xs rounded-xl p-2.5 outline-none border border-slate-200 dark:border-slate-700 font-medium cursor-pointer"
          >
            {CELESTIAL_BODIES.map((b) => (
              <option key={b.name} value={b.g}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        <div className="neu-inset p-4 rounded-2xl flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              <span>진자 실의 길이 (L)</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">{length.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.8}
              step={0.1}
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>0.5m</span>
              <span>2.0m</span>
              <span>3.8m</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              <span>추의 질량 (m)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">{mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={6.0}
              step={0.5}
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              * 질량이 변해도 주기는 유지됩니다 (진자의 등시성).
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              <span>초기 시작 진폭 (각도)</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono">{angle}°</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
        </div>

        {/* Formula Card */}
        <div className="glass-panel p-3.5 rounded-2xl border border-white/50 text-xs flex flex-col gap-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            핵심 공식:
          </span>
          <code className="text-center bg-white/70 dark:bg-slate-800/70 py-1.5 rounded-lg text-blue-600 dark:text-blue-300 font-mono font-bold">
            T = 2π √(L / g)
          </code>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            주기(T)는 실의 길이(L)의 제곱근에 비례하고 중력가속도(g)의 제곱근에 반비례합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
