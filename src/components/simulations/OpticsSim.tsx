'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Eye, ShieldAlert, ArrowRight } from 'lucide-react';

interface Medium {
  name: string;
  n: number;
}

const PRESET_MEDIA: Medium[] = [
  { name: '공기 (Air, n=1.00)', n: 1.0 },
  { name: '물 (Water, n=1.33)', n: 1.33 },
  { name: '유리 (Glass, n=1.50)', n: 1.50 },
  { name: '다이아몬드 (Diamond, n=2.42)', n: 2.42 }
];

export default function OpticsSim() {
  const [n1, setN1] = useState<number>(1.50); // Medium 1
  const [n2, setN2] = useState<number>(1.00); // Medium 2
  const [theta1Deg, setTheta1Deg] = useState<number>(45); // Incident angle in degrees

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Snell's Law calculation
  const theta1Rad = (theta1Deg * Math.PI) / 180;
  const sinTheta1 = Math.sin(theta1Rad);
  const sinTheta2 = (n1 * sinTheta1) / n2;

  const isTotalInternalReflection = sinTheta2 > 1.0;
  const theta2Deg = isTotalInternalReflection
    ? null
    : ((Math.asin(sinTheta2) * 180) / Math.PI).toFixed(1);

  // Critical angle (when n1 > n2)
  const criticalAngleDeg = n1 > n2 ? ((Math.asin(n2 / n1) * 180) / Math.PI).toFixed(1) : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const centerX = width / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw Medium 1 (Top half)
    ctx.fillStyle = n1 > 1.3 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(241, 245, 249, 0.2)';
    ctx.fillRect(0, 0, width, centerY);

    // Draw Medium 2 (Bottom half)
    ctx.fillStyle = n2 > 1.3 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(241, 245, 249, 0.2)';
    ctx.fillRect(0, centerY, width, centerY);

    // Interface Line (Boundary)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Normal Line (Vertical dashed line)
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Medium labels
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`매질 1 (n₁ = ${n1.toFixed(2)})`, 20, 30);
    ctx.fillText(`매질 2 (n₂ = ${n2.toFixed(2)})`, 20, centerY + 30);

    const rayLength = 170;

    // 1. Incident Ray (from top-left to center)
    const incidentStartX = centerX - rayLength * Math.sin(theta1Rad);
    const incidentStartY = centerY - rayLength * Math.cos(theta1Rad);

    ctx.strokeStyle = '#ef4444'; // Red Laser
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(incidentStartX, incidentStartY);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Incident Ray Arrow
    const midIncX = (incidentStartX + centerX) / 2;
    const midIncY = (incidentStartY + centerY) / 2;
    drawArrowHead(ctx, incidentStartX, incidentStartY, centerX, centerY, midIncX, midIncY, '#ef4444');

    // 2. Reflected Ray (Always exists, Angle of Reflection = Angle of Incident)
    const reflectEndX = centerX + rayLength * Math.sin(theta1Rad);
    const reflectEndY = centerY - rayLength * Math.cos(theta1Rad);

    ctx.strokeStyle = isTotalInternalReflection ? '#ef4444' : 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = isTotalInternalReflection ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(reflectEndX, reflectEndY);
    ctx.stroke();

    // 3. Refracted Ray (if not total internal reflection)
    if (!isTotalInternalReflection && theta2Deg !== null) {
      const theta2Rad = (parseFloat(theta2Deg) * Math.PI) / 180;
      const refractEndX = centerX + rayLength * Math.sin(theta2Rad);
      const refractEndY = centerY + rayLength * Math.cos(theta2Rad);

      ctx.strokeStyle = '#10b981'; // Green Refracted Laser
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(refractEndX, refractEndY);
      ctx.stroke();

      const midRefX = (centerX + refractEndX) / 2;
      const midRefY = (centerY + refractEndY) / 2;
      drawArrowHead(ctx, centerX, centerY, refractEndX, refractEndY, midRefX, midRefY, '#10b981');
    }

    // Origin point dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

  }, [n1, n2, theta1Deg, isTotalInternalReflection, theta2Deg]);

  function drawArrowHead(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    atX: number,
    atY: number,
    color: string
  ) {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(atX, atY);
    ctx.lineTo(atX - headLen * Math.cos(angle - Math.PI / 6), atY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(atX - headLen * Math.cos(angle + Math.PI / 6), atY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Simulation Visualizer Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center neu-inset rounded-2xl p-4 relative overflow-hidden min-h-[360px]">
        <canvas
          ref={canvasRef}
          width={480}
          height={380}
          className="w-full max-w-[480px] h-[340px] rounded-xl"
        />

        {/* Realtime Status Badge */}
        <div className="absolute top-4 right-4 glass-panel px-3 py-2 rounded-xl text-xs flex flex-col gap-1 border border-white/40 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold">
            {isTotalInternalReflection ? (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 animate-pulse">
                <ShieldAlert className="w-4 h-4" />
                전반사 발생 (TIR)!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Eye className="w-4 h-4" />
                굴절각 (θ₂): {theta2Deg}°
              </span>
            )}
          </div>
          {criticalAngleDeg && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              임계각 (θc): <span className="font-semibold text-amber-600">{criticalAngleDeg}°</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-72 flex flex-col gap-4">
        {/* Preset Selectors */}
        <div className="neu-inset p-3.5 rounded-2xl flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              매질 1 (빛이 출발하는 곳)
            </label>
            <select
              value={n1}
              onChange={(e) => setN1(parseFloat(e.target.value))}
              className="w-full bg-white/80 dark:bg-slate-800 text-xs rounded-xl p-2 outline-none border border-slate-200 dark:border-slate-700 font-medium"
            >
              {PRESET_MEDIA.map((m) => (
                <option key={`m1-${m.name}`} value={m.n}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              매질 2 (빛이 들어가는 곳)
            </label>
            <select
              value={n2}
              onChange={(e) => setN2(parseFloat(e.target.value))}
              className="w-full bg-white/80 dark:bg-slate-800 text-xs rounded-xl p-2 outline-none border border-slate-200 dark:border-slate-700 font-medium"
            >
              {PRESET_MEDIA.map((m) => (
                <option key={`m2-${m.name}`} value={m.n}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Incident Angle Slider */}
        <div className="neu-inset p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>입사각 (θ₁)</span>
            <span className="text-red-500 font-mono font-bold">{theta1Deg}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={85}
            step={1}
            value={theta1Deg}
            onChange={(e) => setTheta1Deg(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0° (수직)</span>
            <span>45°</span>
            <span>85° (수평)</span>
          </div>

          {criticalAngleDeg && (
            <button
              onClick={() => setTheta1Deg(Math.ceil(parseFloat(criticalAngleDeg)))}
              className="mt-1 text-[11px] py-1 px-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-500/20 text-center transition-colors"
            >
              👉 임계각({criticalAngleDeg}°)으로 맞추기
            </button>
          )}
        </div>

        {/* Snell's Law Info Card */}
        <div className="glass-panel p-3.5 rounded-2xl border border-white/50 text-xs flex flex-col gap-1.5">
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            스넬의 법칙:
          </span>
          <code className="text-center bg-white/70 dark:bg-slate-800/70 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-300 font-mono font-bold">
            n₁ · sin(θ₁) = n₂ · sin(θ₂)
          </code>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {n1 > n2
              ? `매질1이 매질2보다 밀하므로, 입사각이 임계각(${criticalAngleDeg || 0}°)보다 커지면 전반사가 일어납니다.`
              : '빛이 소한 매질에서 밀한 매질로 진입할 때는 법선 쪽으로 굴절하며 전반사가 발생하지 않습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}
