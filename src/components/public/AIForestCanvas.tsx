import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

interface AIForestCanvasProps {
  speedMultiplier?: number;
  glowIntensity?: number;
  interactive?: boolean;
}

export const AIForestCanvas: React.FC<AIForestCanvasProps> = ({
  speedMultiplier = 1.0,
  glowIntensity = 85,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useApp();
  const mousePos = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current.targetX = (e.clientX - rect.left) / width;
      mousePos.current.targetY = (e.clientY - rect.top) / height;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 1. Golden Illuminated Forest Floor Roots
    interface RootPath {
      points: { x: number; y: number }[];
      pulses: { progress: number; speed: number; size: number }[];
      glowColor: string;
      lineWidth: number;
    }

    const roots: RootPath[] = [
      {
        points: [
          { x: 0.05, y: 0.98 }, { x: 0.15, y: 0.92 }, { x: 0.28, y: 0.88 }, { x: 0.42, y: 0.84 }, { x: 0.5, y: 0.82 }
        ],
        pulses: [{ progress: 0.2, speed: 0.005, size: 3 }, { progress: 0.7, speed: 0.007, size: 2.5 }],
        glowColor: '#F59E0B',
        lineWidth: 2.5
      },
      {
        points: [
          { x: 0.95, y: 0.98 }, { x: 0.82, y: 0.91 }, { x: 0.68, y: 0.87 }, { x: 0.55, y: 0.83 }, { x: 0.5, y: 0.82 }
        ],
        pulses: [{ progress: 0.4, speed: 0.006, size: 3 }, { progress: 0.85, speed: 0.005, size: 2 }],
        glowColor: '#F59E0B',
        lineWidth: 2.5
      },
      {
        points: [
          { x: 0.25, y: 0.99 }, { x: 0.32, y: 0.93 }, { x: 0.40, y: 0.87 }, { x: 0.48, y: 0.83 }
        ],
        pulses: [{ progress: 0.1, speed: 0.008, size: 2.5 }],
        glowColor: '#D97706',
        lineWidth: 2
      },
      {
        points: [
          { x: 0.75, y: 0.99 }, { x: 0.68, y: 0.94 }, { x: 0.58, y: 0.88 }, { x: 0.52, y: 0.83 }
        ],
        pulses: [{ progress: 0.5, speed: 0.007, size: 2.5 }],
        glowColor: '#D97706',
        lineWidth: 2
      },
      {
        points: [
          { x: 0.1, y: 0.85 }, { x: 0.2, y: 0.82 }, { x: 0.32, y: 0.80 }, { x: 0.45, y: 0.79 }
        ],
        pulses: [{ progress: 0.3, speed: 0.006, size: 2 }],
        glowColor: '#FBBF24',
        lineWidth: 1.8
      },
      {
        points: [
          { x: 0.9, y: 0.86 }, { x: 0.78, y: 0.83 }, { x: 0.65, y: 0.81 }, { x: 0.53, y: 0.79 }
        ],
        pulses: [{ progress: 0.6, speed: 0.006, size: 2 }],
        glowColor: '#FBBF24',
        lineWidth: 1.8
      }
    ];

    // 2. Floating 3D Glass Tech Tokens (Gemini, ChatGPT, GitHub, Code Tag, Sparkles)
    interface GlassToken {
      type: 'gemini' | 'chatgpt' | 'github' | 'code' | 'sparkle';
      label: string;
      x: number; // percentage
      y: number; // percentage
      baseY: number;
      size: number;
      depth: number;
      floatPhase: number;
      floatSpeed: number;
      rotation: number;
      glowColor: string;
    }

    const tokens: GlassToken[] = [
      { type: 'gemini', label: 'Gemini', x: 0.15, y: 0.62, baseY: 0.62, size: 56, depth: 1.1, floatPhase: 0, floatSpeed: 1.2, rotation: -0.06, glowColor: '#38bdf8' },
      { type: 'code', label: '</>', x: 0.28, y: 0.38, baseY: 0.38, size: 48, depth: 0.85, floatPhase: 1.8, floatSpeed: 1.0, rotation: 0.04, glowColor: '#67e8f9' },
      { type: 'sparkle', label: '✦', x: 0.42, y: 0.58, baseY: 0.58, size: 46, depth: 0.95, floatPhase: 3.2, floatSpeed: 1.3, rotation: -0.03, glowColor: '#C5A059' },
      { type: 'chatgpt', label: 'OpenAI', x: 0.62, y: 0.68, baseY: 0.68, size: 58, depth: 1.15, floatPhase: 2.1, floatSpeed: 1.1, rotation: 0.05, glowColor: '#10a37f' },
      { type: 'github', label: 'GitHub', x: 0.78, y: 0.54, baseY: 0.54, size: 54, depth: 1.05, floatPhase: 4.5, floatSpeed: 0.9, rotation: -0.04, glowColor: '#a855f7' },
      { type: 'code', label: '</>', x: 0.88, y: 0.36, baseY: 0.36, size: 46, depth: 0.8, floatPhase: 0.9, floatSpeed: 1.2, rotation: 0.07, glowColor: '#38bdf8' },
      { type: 'gemini', label: '✦ AI', x: 0.08, y: 0.44, baseY: 0.44, size: 44, depth: 0.75, floatPhase: 2.7, floatSpeed: 1.4, rotation: -0.08, glowColor: '#60a5fa' }
    ];

    // 3. Bioluminescent Forest Tree Spores / Fairy Fireflies
    interface SporeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      maxAlpha: number;
      color: string;
      phase: number;
    }

    const spores: SporeParticle[] = [];
    for (let i = 0; i < 60; i++) {
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.4,
        size: Math.random() * 2.8 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        maxAlpha: Math.random() * 0.6 + 0.4,
        color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#FBBF24' : '#34d399'),
        phase: Math.random() * Math.PI * 2
      });
    }

    // 4. Bioluminescent Tree Trunk Nodes
    interface TrunkCluster {
      x: number;
      y: number;
      count: number;
      radius: number;
      color: string;
    }

    const trunkClusters: TrunkCluster[] = [
      { x: 0.16, y: 0.52, count: 18, radius: 45, color: '#38bdf8' },
      { x: 0.26, y: 0.46, count: 14, radius: 35, color: '#67e8f9' },
      { x: 0.76, y: 0.50, count: 20, radius: 48, color: '#38bdf8' },
      { x: 0.86, y: 0.45, count: 16, radius: 40, color: '#67e8f9' }
    ];

    let time = 0;

    const render = () => {
      time += 0.02 * speedMultiplier;

      // Mouse parallax
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.04;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.04;
      const mouseOffsetX = (mousePos.current.x - 0.5) * 35;
      const mouseOffsetY = (mousePos.current.y - 0.5) * 25;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const glowScale = glowIntensity / 100;

      // 1. Draw Bioluminescent Tree Trunk Glow Clusters
      trunkClusters.forEach(cluster => {
        const cx = cluster.x * width + mouseOffsetX * 0.2;
        const cy = cluster.y * height + mouseOffsetY * 0.2;

        ctx.save();
        for (let i = 0; i < cluster.count; i++) {
          const angle = (i / cluster.count) * Math.PI * 2;
          const dist = (i % 3 + 1) * (cluster.radius / 3.5);
          const px = cx + Math.cos(angle) * dist + (Math.sin(time + i) * 3);
          const py = cy + Math.sin(angle) * dist * 1.6 + (Math.cos(time + i) * 2);

          const dotGlow = Math.sin(time * 2 + i * 0.8) * 0.4 + 0.6;
          ctx.fillStyle = cluster.color;
          ctx.globalAlpha = dotGlow * 0.8 * glowScale;
          ctx.shadowColor = cluster.color;
          ctx.shadowBlur = 8 * glowScale;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 2. Draw Golden Illuminated Forest Ground Roots
      roots.forEach(root => {
        ctx.save();
        ctx.strokeStyle = root.glowColor;
        ctx.lineWidth = root.lineWidth;
        ctx.shadowColor = root.glowColor;
        ctx.shadowBlur = 12 * glowScale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        const start = root.points[0];
        ctx.moveTo(start.x * width + mouseOffsetX * 0.4, start.y * height + mouseOffsetY * 0.4);

        for (let i = 1; i < root.points.length; i++) {
          const pt = root.points[i];
          const px = pt.x * width + mouseOffsetX * 0.4;
          const py = pt.y * height + mouseOffsetY * 0.4;
          ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Traveling Golden Pulses on Roots
        root.pulses.forEach(pulse => {
          pulse.progress += pulse.speed * speedMultiplier;
          if (pulse.progress > 1) pulse.progress = 0;

          // Interpolate position along polyline
          const totalSegments = root.points.length - 1;
          const currentSegIndex = Math.min(
            Math.floor(pulse.progress * totalSegments),
            totalSegments - 1
          );
          const segProgress = (pulse.progress * totalSegments) - currentSegIndex;

          const p1 = root.points[currentSegIndex];
          const p2 = root.points[currentSegIndex + 1];

          const pulseX = (p1.x + (p2.x - p1.x) * segProgress) * width + mouseOffsetX * 0.4;
          const pulseY = (p1.y + (p2.y - p1.y) * segProgress) * height + mouseOffsetY * 0.4;

          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 16 * glowScale;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, pulse.size + 1, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      });

      // 3. Draw Floating 3D Glass Tech Tokens (Gemini, ChatGPT, GitHub, </>)
      tokens.forEach(tok => {
        const floatOffset = Math.sin(time * tok.floatSpeed + tok.floatPhase) * 12;
        const tx = tok.x * width + mouseOffsetX * tok.depth;
        const ty = tok.baseY * height + floatOffset + mouseOffsetY * tok.depth;
        const tSize = tok.size * (Math.min(width, height) / 800) * tok.depth;

        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(tok.rotation + Math.sin(time * 0.5 + tok.floatPhase) * 0.04);

        // Glass Body Background
        const glassGrad = ctx.createLinearGradient(-tSize / 2, -tSize / 2, tSize / 2, tSize / 2);
        if (isDark) {
          glassGrad.addColorStop(0, 'rgba(30, 41, 59, 0.7)');
          glassGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.5)');
          glassGrad.addColorStop(1, 'rgba(30, 41, 59, 0.8)');
        } else {
          glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          glassGrad.addColorStop(0.5, 'rgba(240, 246, 252, 0.65)');
          glassGrad.addColorStop(1, 'rgba(226, 232, 240, 0.85)');
        }

        // Draw Rounded Glass Hexagon/Card
        ctx.fillStyle = glassGrad;
        ctx.strokeStyle = tok.glowColor;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = tok.glowColor;
        ctx.shadowBlur = 14 * glowScale;

        const r = 14;
        const w = tSize;
        const h = tSize * 0.95;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, r);
        ctx.fill();
        ctx.stroke();

        // Inner Glass Highlight Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, r - 3);
        ctx.stroke();

        // Icon Artwork / Logo inside the Token
        ctx.shadowBlur = 8 * glowScale;
        ctx.shadowColor = '#ffffff';

        if (tok.type === 'code') {
          ctx.fillStyle = '#67e8f9';
          ctx.font = `bold ${tSize * 0.38}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('</>', 0, 0);
        } else if (tok.type === 'gemini') {
          // Gemini Diamond Sparkle
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          const s = tSize * 0.28;
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();

          ctx.font = `bold ${tSize * 0.16}px sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('Gemini', 0, tSize * 0.34);
        } else if (tok.type === 'chatgpt') {
          // OpenAI Spiral Motif
          ctx.fillStyle = '#10a37f';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, -2, tSize * 0.2, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = `bold ${tSize * 0.16}px sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('AI GPT', 0, tSize * 0.34);
        } else if (tok.type === 'github') {
          // GitHub Octocat Silhouette outline
          ctx.strokeStyle = '#a855f7';
          ctx.fillStyle = '#ffffff';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(0, -3, tSize * 0.2, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.font = `bold ${tSize * 0.16}px sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText('GitHub', 0, tSize * 0.34);
        } else {
          // Star Sparkle
          ctx.fillStyle = '#FBBF24';
          ctx.font = `bold ${tSize * 0.42}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✦', 0, 0);
        }

        ctx.restore();
      });

      // 4. Floating Spores / Firefly Bokeh
      spores.forEach(spore => {
        spore.x += spore.vx;
        spore.y += spore.vy;

        if (spore.y < 0) spore.y = height;
        if (spore.x < 0) spore.x = width;
        if (spore.x > width) spore.x = 0;

        const pulseAlpha = (Math.sin(time * 3 + spore.phase) * 0.3 + 0.7) * spore.alpha * glowScale;

        ctx.save();
        ctx.fillStyle = spore.color;
        ctx.globalAlpha = pulseAlpha;
        ctx.shadowColor = spore.color;
        ctx.shadowBlur = 10 * glowScale;
        ctx.beginPath();
        ctx.arc(spore.x, spore.y, spore.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, speedMultiplier, glowIntensity, interactive]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

