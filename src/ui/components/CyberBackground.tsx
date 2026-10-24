import React, { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  animated?: boolean;
}

export const CyberBackground: React.FC<Props> = ({ children, animated = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!animated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle particles
    const particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number }> = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.7,
        size: 1 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.4,
      });
    }

    let t = 0;
    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw faint cybernetic grid
      ctx.strokeStyle = 'rgba(0, 255, 153, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 36;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particles
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(0, 255, 153, ${p.alpha * (0.6 + 0.4 * Math.sin(t + p.x))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animated]);

  return (
    <div className="relative min-h-screen w-full bg-[#0A0D12] text-[#C8D8E8] flex flex-col overflow-x-hidden">
      {animated && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0 opacity-80"
        />
      )}
      {/* Scanline CRT overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 cyber-scanlines opacity-40" />

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col pb-24 max-w-5xl mx-auto w-full px-3 sm:px-6">
        {children}
      </div>
    </div>
  );
};
