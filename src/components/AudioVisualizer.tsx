import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundscape';

interface AudioVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(64);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        soundEngine.getFrequencyData(dataArray);
      } else {
        // Subtle resting idle wave
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.max(0, dataArray[i] * 0.95);
        }
      }

      const barCount = 36;
      const barWidth = canvas.width / barCount;
      const height = canvas.height;

      // Draw mirrored / symmetrical wave bars with glowing gradient
      for (let i = 0; i < barCount; i++) {
        // Center-focused indexing
        const mid = barCount / 2;
        const distFromMid = Math.abs(i - mid) / mid;
        const dataIndex = Math.floor((1 - distFromMid) * 28);
        const val = isPlaying ? (dataArray[dataIndex] || 15) : (8 + Math.sin(Date.now() * 0.003 + i * 0.2) * 5);

        const barHeight = Math.max(4, (val / 255) * (height * 0.85));
        const x = i * barWidth + barWidth * 0.15;
        const y = height / 2 - barHeight / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.95)'); // Cyan-400
        grad.addColorStop(0.5, 'rgba(2, 132, 199, 0.85)'); // Sky-600
        grad.addColorStop(1, 'rgba(186, 230, 253, 0.9)'); // Sky-200

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth * 0.7, barHeight, 3);
        ctx.fill();
      }

      animId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId.current) cancelAnimationFrame(animId.current);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={56}
      className={`w-full max-w-sm h-12 rounded-xl pointer-events-none ${className}`}
      aria-label="音声イコライザービジュアライザー"
    />
  );
};
