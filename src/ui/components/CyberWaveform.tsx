import React, { useEffect, useRef } from 'react';

interface Props {
  latencies: number[];
  height?: number;
}

export const CyberWaveform: React.FC<Props> = ({ latencies, height = 90 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 255, 153, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 15; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!latencies || latencies.length === 0) {
      // Draw flat baseline
      ctx.strokeStyle = 'rgba(0, 255, 153, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    const step = width / Math.max(latencies.length - 1, 1);
    const maxVal = Math.max(...latencies, 300);

    // Area fill gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 255, 153, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 255, 153, 0.0)');

    ctx.beginPath();
    ctx.moveTo(0, height);

    latencies.forEach((val, i) => {
      const x = i * step;
      // If val is 0, it's a timeout/dropout spike (draw near top/bottom)
      const y = val === 0 ? height - 4 : height - (val / maxVal) * (height - 15) - 8;
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo((latencies.length - 1) * step, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Wave outline stroke
    ctx.beginPath();
    latencies.forEach((val, i) => {
      const x = i * step;
      const y = val === 0 ? height - 4 : height - (val / maxVal) * (height - 15) - 8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#00FF99';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00FF99';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw ping point on the latest reading
    if (latencies.length > 0) {
      const lastVal = latencies[latencies.length - 1];
      const lastX = (latencies.length - 1) * step;
      const lastY = lastVal === 0 ? height - 4 : height - (lastVal / maxVal) * (height - 15) - 8;

      ctx.fillStyle = lastVal === 0 ? '#E05050' : '#38B6FF';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [latencies, height]);

  return (
    <div className="w-full relative overflow-hidden rounded-lg bg-[#070A0E] border border-[#1A2530] p-1">
      <div className="flex justify-between items-center text-[10px] font-mono-cyber text-[#6A8496] px-2 pt-1 mb-1">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF99] animate-pulse" />
          OSCILLOSCOPE FEED
        </span>
        <span>
          LATEST:{' '}
          <span className="text-[#00FF99] font-bold">
            {latencies.length > 0 ? (latencies[latencies.length - 1] === 0 ? 'DROP' : `${latencies[latencies.length - 1]}ms`) : '--'}
          </span>
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
};
