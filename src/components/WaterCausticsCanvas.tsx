import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundscape';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  rotation: number;
  rotSpeed: number;
}

export const WaterCausticsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize floating light / square digital fragments like in reference image
    const particles: Particle[] = [];
    const count = Math.min(45, Math.floor(width / 35));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 3 + Math.random() * 8,
        speedY: -(0.2 + Math.random() * 0.5),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: 0.15 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
    particlesRef.current = particles;

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Gentle caustic light lines simulation (subtle water refractions)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 1.2;

      // Draw subtle harmonic caustic curves
      const step = 80;
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 40) {
          const wave1 = Math.sin(x * 0.008 + time + y * 0.006) * 12;
          const wave2 = Math.cos(x * 0.012 - time * 0.8 + y * 0.004) * 8;
          const currentY = y + wave1 + wave2;
          if (x === 0) {
            ctx.moveTo(x, currentY);
          } else {
            ctx.lineTo(x, currentY);
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      // 2. Render expanding ripples from user clicks/moves
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 2.2;
        r.alpha *= 0.96;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 242, 254, ${r.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Inner secondary wave
        if (r.radius > 15) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${(r.alpha * 0.6).toFixed(3)})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
        ctx.restore();

        if (r.alpha < 0.01 || r.radius > r.maxRadius) {
          ripplesRef.current.splice(i, 1);
        }
      }

      // 3. Render floating glass-like digital particles (reminiscent of IMG_0386)
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.2;
        p.rotation += p.rotSpeed;

        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgba(240, 249, 255, ${p.alpha})`;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        // Subtle crisp border
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.alpha * 1.4})`;
        ctx.lineWidth = 0.75;
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripplesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius: 160 + Math.random() * 80,
      alpha: 0.65,
    });

    if (soundEngine.getIsRunning()) {
      soundEngine.triggerWaterRippleSound();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      className="fixed inset-0 pointer-events-auto z-0 opacity-80"
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
};
