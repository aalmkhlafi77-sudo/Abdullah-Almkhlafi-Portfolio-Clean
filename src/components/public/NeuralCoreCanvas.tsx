import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { startVisibleCanvasAnimation } from './visibleCanvasAnimation';

interface NeuralCoreCanvasProps {
  speedMultiplier?: number;
  glowIntensity?: number;
  interactive?: boolean;
}

export const NeuralCoreCanvas: React.FC<NeuralCoreCanvasProps> = ({
  speedMultiplier = 1.0,
  glowIntensity = 85,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useApp();
  const mousePos = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    // Generate Neural Synapse Tree Branches
    interface SynapseNode {
      angle: number;
      length: number;
      branches: { angleOffset: number; length: number; subBranches?: { angleOffset: number; length: number }[] }[];
      pulses: { progress: number; speed: number; size: number }[];
    }

    const synapseBranches: SynapseNode[] = [];
    const branchCount = 14;
    for (let i = 0; i < branchCount; i++) {
      const baseAngle = (i / branchCount) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      synapseBranches.push({
        angle: baseAngle,
        length: 180 + Math.random() * 120,
        branches: [
          {
            angleOffset: 0.35 + Math.random() * 0.3,
            length: 80 + Math.random() * 60,
            subBranches: [
              { angleOffset: 0.3, length: 40 + Math.random() * 40 },
              { angleOffset: -0.3, length: 35 + Math.random() * 35 }
            ]
          },
          {
            angleOffset: -(0.35 + Math.random() * 0.3),
            length: 80 + Math.random() * 60,
            subBranches: [
              { angleOffset: 0.25, length: 40 + Math.random() * 35 },
              { angleOffset: -0.35, length: 30 + Math.random() * 40 }
            ]
          }
        ],
        pulses: [
          { progress: Math.random(), speed: 0.006 + Math.random() * 0.008, size: 3 },
          { progress: Math.random(), speed: 0.004 + Math.random() * 0.006, size: 2.5 }
        ]
      });
    }

    // 3D Glass Data Columns (Pillars from Video)
    interface GlassPillar {
      x: number; // percentage
      y: number; // base Y
      width: number;
      height: number;
      codeLines: string[];
      glowPhase: number;
      depth: number;
    }

    const sampleCodes = [
      'class NeuralNet {',
      '  async compute()',
      '  weights: Tensor<3>',
      '  synapse.fire()',
      '  export default Core',
      '  01001100 1101',
      '  matrix_mult()',
      '  latency: 0.4ms',
      '  const ai = init()'
    ];

    const pillars: GlassPillar[] = [
      { x: 0.12, y: 0.88, width: 65, height: 260, codeLines: sampleCodes.slice(0, 5), glowPhase: 0, depth: 0.9 },
      { x: 0.22, y: 0.92, width: 75, height: 340, codeLines: sampleCodes.slice(2, 7), glowPhase: 1.5, depth: 1.1 },
      { x: 0.34, y: 0.85, width: 55, height: 220, codeLines: sampleCodes.slice(1, 6), glowPhase: 3.2, depth: 0.8 },
      { x: 0.65, y: 0.86, width: 60, height: 230, codeLines: sampleCodes.slice(3, 8), glowPhase: 2.1, depth: 0.85 },
      { x: 0.77, y: 0.92, width: 80, height: 360, codeLines: sampleCodes.slice(0, 6), glowPhase: 4.0, depth: 1.15 },
      { x: 0.88, y: 0.88, width: 65, height: 280, codeLines: sampleCodes.slice(4, 9), glowPhase: 5.2, depth: 0.95 }
    ];

    // Floating Particles
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 - 0.2,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.3 ? '#38bdf8' : '#C5A059',
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02 * speedMultiplier;

      // Smooth mouse interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      const mouseOffsetX = (mousePos.current.x - 0.5) * 40;
      const mouseOffsetY = (mousePos.current.y - 0.5) * 30;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5 + mouseOffsetX * 0.4;
      const centerY = height * 0.42 + mouseOffsetY * 0.4;

      const isDark = theme === 'dark';
      const cyanPrimary = '#38bdf8';
      const cyanGlow = 'rgba(56, 189, 248, 0.9)';
      const goldAccent = '#C5A059';

      // 1. Draw Background Circuit Bus Matrix Lines (PCB tracks)
      ctx.lineWidth = 1;
      const circuitColor = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.18)';
      ctx.strokeStyle = circuitColor;

      const gridStep = 48;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Angled Motherboard Bus Tracks (from video)
      ctx.save();
      ctx.lineWidth = 1.8;
      const busLines = [
        { startX: 0, startY: centerY - 140, midX: centerX - 240, midY: centerY - 80, endX: centerX - 60, endY: centerY - 20 },
        { startX: 0, startY: centerY + 140, midX: centerX - 220, midY: centerY + 90, endX: centerX - 60, endY: centerY + 20 },
        { startX: width, startY: centerY - 140, midX: centerX + 240, midY: centerY - 80, endX: centerX + 60, endY: centerY - 20 },
        { startX: width, startY: centerY + 140, midX: centerX + 220, midY: centerY + 90, endX: centerX + 60, endY: centerY + 20 }
      ];

      busLines.forEach((line, idx) => {
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(14, 165, 233, 0.4)';
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.midX, line.midY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();

        // Pulsing Data Packets on Bus Tracks
        const packetProgress = (time * 0.8 + idx * 0.25) % 1;
        let px = 0, py = 0;
        if (packetProgress < 0.5) {
          const p = packetProgress / 0.5;
          px = line.startX + (line.midX - line.startX) * p;
          py = line.startY + (line.midY - line.startY) * p;
        } else {
          const p = (packetProgress - 0.5) / 0.5;
          px = line.midX + (line.endX - line.midX) * p;
          py = line.midY + (line.endY - line.midY) * p;
        }

        ctx.fillStyle = '#67e8f9';
        ctx.shadowColor = cyanGlow;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();

      // 2. Draw 3D Glass Data Pillars (Foreground Buildings from video)
      pillars.forEach((pillar) => {
        const pillarX = pillar.x * width + mouseOffsetX * (pillar.depth - 1) * 0.5;
        const pillarBaseY = pillar.y * height;
        const pHeight = pillar.height * (height / 800);
        const pTopY = pillarBaseY - pHeight;

        // Glass Column Body
        const glassGrad = ctx.createLinearGradient(pillarX, pTopY, pillarX + pillar.width, pillarBaseY);
        if (isDark) {
          glassGrad.addColorStop(0, 'rgba(15, 23, 42, 0.75)');
          glassGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.55)');
          glassGrad.addColorStop(1, 'rgba(8, 14, 26, 0.85)');
        } else {
          glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          glassGrad.addColorStop(0.5, 'rgba(240, 246, 252, 0.7)');
          glassGrad.addColorStop(1, 'rgba(226, 232, 240, 0.85)');
        }

        ctx.fillStyle = glassGrad;
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(14, 165, 233, 0.5)';
        ctx.lineWidth = 1.5;

        // 3D Box / Pillar Front Face
        ctx.fillRect(pillarX, pTopY, pillar.width, pHeight);
        ctx.strokeRect(pillarX, pTopY, pillar.width, pHeight);

        // 3D Top Cap
        ctx.beginPath();
        ctx.moveTo(pillarX, pTopY);
        ctx.lineTo(pillarX + 15, pTopY - 12);
        ctx.lineTo(pillarX + pillar.width + 15, pTopY - 12);
        ctx.lineTo(pillarX + pillar.width, pTopY);
        ctx.closePath();
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.2)';
        ctx.fill();
        ctx.stroke();

        // 3D Side Face
        ctx.beginPath();
        ctx.moveTo(pillarX + pillar.width, pTopY);
        ctx.lineTo(pillarX + pillar.width + 15, pTopY - 12);
        ctx.lineTo(pillarX + pillar.width + 15, pillarBaseY - 12);
        ctx.lineTo(pillarX + pillar.width, pillarBaseY);
        ctx.closePath();
        ctx.fillStyle = isDark ? 'rgba(10, 18, 30, 0.85)' : 'rgba(203, 213, 225, 0.6)';
        ctx.fill();
        ctx.stroke();

        // Glowing Top Highlight Line
        ctx.save();
        ctx.shadowColor = cyanGlow;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pillarX, pTopY);
        ctx.lineTo(pillarX + pillar.width, pTopY);
        ctx.stroke();
        ctx.restore();

        // Monospace Code Lines on Pillar Face
        ctx.save();
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isDark ? 'rgba(125, 211, 252, 0.65)' : 'rgba(3, 105, 161, 0.75)';
        pillar.codeLines.forEach((code, lineIdx) => {
          const lineY = pTopY + 30 + lineIdx * 20;
          if (lineY < pillarBaseY - 15) {
            ctx.fillText(code, pillarX + 8, lineY);
          }
        });
        ctx.restore();
      });

      // 3. Draw Synapse Axon Tree Branches (Spreading out from Neural Core)
      ctx.save();
      synapseBranches.forEach((node) => {
        const rootRadius = 58;
        const startX = centerX + Math.cos(node.angle) * rootRadius;
        const startY = centerY + Math.sin(node.angle) * rootRadius;

        const mainEndX = centerX + Math.cos(node.angle) * (rootRadius + node.length);
        const mainEndY = centerY + Math.sin(node.angle) * (rootRadius + node.length);

        // Gradient for neural branch
        const branchGrad = ctx.createLinearGradient(startX, startY, mainEndX, mainEndY);
        branchGrad.addColorStop(0, '#67e8f9');
        branchGrad.addColorStop(0.6, '#0ea5e9');
        branchGrad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');

        ctx.strokeStyle = branchGrad;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Curved axon filament
        const cpX = (startX + mainEndX) / 2 + Math.sin(node.angle) * 20;
        const cpY = (startY + mainEndY) / 2 - Math.cos(node.angle) * 20;
        ctx.quadraticCurveTo(cpX, cpY, mainEndX, mainEndY);
        ctx.stroke();

        // Terminal Synaptic Bulb Node
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = cyanGlow;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(mainEndX, mainEndY, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Sub Branches / Dendrites
        node.branches.forEach((b) => {
          const bAngle = node.angle + b.angleOffset;
          const bStartX = startX + (mainEndX - startX) * 0.6;
          const bStartY = startY + (mainEndY - startY) * 0.6;
          const bEndX = bStartX + Math.cos(bAngle) * b.length;
          const bEndY = bStartY + Math.sin(bAngle) * b.length;

          ctx.lineWidth = 1.3;
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
          ctx.beginPath();
          ctx.moveTo(bStartX, bStartY);
          ctx.lineTo(bEndX, bEndY);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(bEndX, bEndY, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Electrical Action Potential Pulses Traveling Down Axon
        node.pulses.forEach((pulse) => {
          pulse.progress += pulse.speed * speedMultiplier;
          if (pulse.progress > 1) pulse.progress = 0;

          const px = startX + (mainEndX - startX) * pulse.progress;
          const py = startY + (mainEndY - startY) * pulse.progress;

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#67e8f9';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });
      ctx.restore();

      // 4. Central NEURAL CORE Processor (Microchip Node from video)
      ctx.save();
      const corePulse = Math.sin(time * 2) * 4;
      const coreRadius = 60 + corePulse;

      // Outer Luminous Radial Aura
      const coreAura = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, coreRadius * 3.5);
      coreAura.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      coreAura.addColorStop(0.4, 'rgba(56, 189, 248, 0.15)');
      coreAura.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = coreAura;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Concentric Circuit Halo Rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius + 14, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating dashed ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.4);
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, coreRadius + 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Processor Octagon / Rounded Core Body
      const coreGrad = ctx.createRadialGradient(centerX - 10, centerY - 10, 5, centerX, centerY, coreRadius);
      if (isDark) {
        coreGrad.addColorStop(0, '#0284c7');
        coreGrad.addColorStop(0.6, '#0369a1');
        coreGrad.addColorStop(1, '#082f49');
      } else {
        coreGrad.addColorStop(0, '#38bdf8');
        coreGrad.addColorStop(0.7, '#0284c7');
        coreGrad.addColorStop(1, '#0369a1');
      }

      ctx.fillStyle = coreGrad;
      ctx.shadowColor = cyanGlow;
      ctx.shadowBlur = 24 * (glowIntensity / 100);
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Circuit lines inside core
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 24, centerY - 12);
      ctx.lineTo(centerX - 10, centerY - 12);
      ctx.lineTo(centerX - 4, centerY - 20);

      ctx.moveTo(centerX + 24, centerY - 12);
      ctx.lineTo(centerX + 10, centerY - 12);
      ctx.lineTo(centerX + 4, centerY - 20);

      ctx.moveTo(centerX - 24, centerY + 12);
      ctx.lineTo(centerX - 10, centerY + 12);
      ctx.lineTo(centerX - 4, centerY + 20);

      ctx.moveTo(centerX + 24, centerY + 12);
      ctx.lineTo(centerX + 10, centerY + 12);
      ctx.lineTo(centerX + 4, centerY + 20);
      ctx.stroke();

      // Center Core Typography ("NEURAL CORE")
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NEURAL', centerX, centerY - 6);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#bae6fd';
      ctx.fillText('CORE', centerX, centerY + 8);

      ctx.restore();

      // 5. Floating Particles & Cyber Bokeh
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

    };

    const stopAnimation = startVisibleCanvasAnimation(canvas, render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      stopAnimation();
    };
  }, [theme, speedMultiplier, glowIntensity, interactive]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

