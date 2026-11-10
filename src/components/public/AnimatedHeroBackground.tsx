import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroConfig } from '../../types';
import { NeuralCoreCanvas } from './NeuralCoreCanvas';
import { AIForestCanvas } from './AIForestCanvas';

interface AnimatedHeroBackgroundProps {
  overrideConfig?: HeroConfig;
}

export const AnimatedHeroBackground: React.FC<AnimatedHeroBackgroundProps> = ({ overrideConfig }) => {
  const { heroConfig: globalConfig, theme } = useApp();
  const config = overrideConfig || globalConfig;

  const {
    preset = 'ai_forest',
    customImageUrl,
    lightingIntensity = 85,
    overlayOpacity = 35,
    blurAmount = 0,
    animationSpeed = 1.0,
    motionDuration = 16,
    motionStyle = 'flow_loop',
    repeatCount = 'infinite',
    particlesEnabled = true,
    codeSnippetEffect = true,
    ambientGlow = true
  } = config;

  // Calculate dynamic timing based on duration and speed
  const calculatedDuration = useMemo(() => {
    const base = Math.max(4, motionDuration || 16);
    const speed = Math.max(0.2, animationSpeed || 1.0);
    return (base / speed).toFixed(2);
  }, [motionDuration, animationSpeed]);

  // Lighting factor
  const brightnessMultiplier = (lightingIntensity / 100).toFixed(2);
  const darknessOverlay = (overlayOpacity / 100).toFixed(2);

  // High quality curated background textures per preset
  const presetBackgrounds: Record<string, string> = {
    ai_forest: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1920&q=80',
    neural_core: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80',
    ai_matrix: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    tech_entrepreneur: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80',
    code_software: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80',
    golden_flow: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    cyber_mesh: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    custom_image: customImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80'
  };

  const currentBgImage = preset === 'custom_image' ? (customImageUrl || presetBackgrounds.ai_forest) : presetBackgrounds[preset] || presetBackgrounds.ai_forest;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none'
      }}
    >
      {/* Background Image Layer with Zoom/Float Motion */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all opacity-40"
        style={{
          backgroundImage: `url(${currentBgImage})`,
          filter: `brightness(${brightnessMultiplier}) contrast(1.15)`,
          transform: 'scale(1.05)',
          animation: repeatCount === 'infinite' 
            ? `heroPanZoom ${calculatedDuration}s ease-in-out infinite alternate`
            : repeatCount === 'pulse'
            ? `heroPulseZoom ${calculatedDuration}s ease-in-out infinite`
            : `heroGentleWave ${calculatedDuration}s ease-in-out infinite alternate`
        }}
      />

      {/* AI Forest Animated Canvas */}
      {preset === 'ai_forest' && (
        <AIForestCanvas 
          speedMultiplier={animationSpeed} 
          glowIntensity={lightingIntensity}
          interactive={true}
        />
      )}

      {/* Neural Core Animated Canvas */}
      {(preset === 'neural_core' || preset === 'ai_matrix') && (
        <NeuralCoreCanvas 
          speedMultiplier={animationSpeed} 
          glowIntensity={lightingIntensity}
          interactive={true}
        />
      )}

      {/* Dynamic Theme Color Overlay */}
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          backgroundColor: theme === 'dark' ? '#0D0C0B' : '#F9F7F2',
          opacity: darknessOverlay
        }}
      />

      {/* Gradient Vignette for Depth & Readability */}
      <div 
        className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-t from-[#121212] via-[#121212]/60 to-[#121212]/80' 
            : 'bg-gradient-to-t from-[#F9F7F2] via-[#F9F7F2]/70 to-[#F9F7F2]/80'
        }`} 
      />

      {/* Radial Soft Glowing Ambient Lights */}
      {ambientGlow && (
        <>
          <div 
            className="absolute -top-24 right-1/4 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-all"
            style={{
              background: theme === 'dark' 
                ? 'radial-gradient(circle, rgba(197, 160, 89, 0.28) 0%, rgba(197, 160, 89, 0) 70%)' 
                : 'radial-gradient(circle, rgba(197, 160, 89, 0.20) 0%, rgba(197, 160, 89, 0) 70%)',
              animation: `heroAuraGlow ${calculatedDuration}s ease-in-out infinite alternate`
            }}
          />
          <div 
            className="absolute -bottom-24 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-all"
            style={{
              background: theme === 'dark' 
                ? 'radial-gradient(circle, rgba(46, 75, 120, 0.22) 0%, rgba(18, 18, 18, 0) 70%)' 
                : 'radial-gradient(circle, rgba(239, 230, 212, 0.6) 0%, rgba(249, 247, 242, 0) 70%)',
              animation: `heroAuraGlow ${Number(calculatedDuration) * 1.3}s ease-in-out infinite alternate-reverse`
            }}
          />
        </>
      )}

      {/* Preset-Specific Visual Overlay Details */}
      {preset === 'ai_matrix' && (
        <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aiNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
            </linearGradient>
            <pattern id="aiGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#C5A059" opacity="0.4" />
              <path d="M 30 0 L 30 60 M 0 30 L 60 30" fill="none" stroke="#C5A059" strokeWidth="0.5" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#aiGrid)" />
          
          {/* Animated Neural Connections */}
          <g className="animate-pulse" style={{ animationDuration: `${calculatedDuration}s` }}>
            <line x1="20%" y1="30%" x2="45%" y2="40%" stroke="url(#aiNodeGrad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
            <line x1="45%" y1="40%" x2="80%" y2="25%" stroke="url(#aiNodeGrad)" strokeWidth="1.5" opacity="0.4" />
            <line x1="45%" y1="40%" x2="70%" y2="75%" stroke="url(#aiNodeGrad)" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
            <line x1="15%" y1="70%" x2="45%" y2="40%" stroke="url(#aiNodeGrad)" strokeWidth="1.5" opacity="0.4" />

            <circle cx="20%" cy="30%" r="5" fill="#C5A059" opacity="0.8" />
            <circle cx="45%" cy="40%" r="7" fill="#38BDF8" opacity="0.9" />
            <circle cx="80%" cy="25%" r="4" fill="#C5A059" opacity="0.7" />
            <circle cx="70%" cy="75%" r="6" fill="#DFCA9B" opacity="0.8" />
            <circle cx="15%" cy="70%" r="4" fill="#38BDF8" opacity="0.6" />
          </g>
        </svg>
      )}

      {preset === 'tech_entrepreneur' && (
        <div className="absolute inset-0 opacity-25">
          {/* Business & Tech Growth Vector Line */}
          <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path
              d="M0,450 Q300,380 600,280 T1200,80"
              fill="none"
              stroke="#C5A059"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
            <path
              d="M0,450 Q300,380 600,280 T1200,80 L1200,600 L0,600 Z"
              fill="url(#entrepreneurGrad)"
              opacity="0.15"
            />
            <defs>
              <linearGradient id="entrepreneurGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Floating Code Snippets / Syntax Tokens for Software Concept */}
      {codeSnippetEffect && (
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30 font-mono text-[11px] select-none">
          <div 
            className="absolute top-16 left-12 p-3 rounded-lg border border-[#C5A059]/30 bg-black/40 backdrop-blur-xs text-[#E8D4A8] space-y-1 hidden md:block"
            style={{ animation: `heroFloatingCard ${calculatedDuration}s ease-in-out infinite alternate` }}
          >
            <div className="flex items-center gap-1.5 opacity-60 text-[9px] pb-1 border-b border-[#C5A059]/20">
              <span className="w-2 h-2 rounded-full bg-red-400/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
              <span className="w-2 h-2 rounded-full bg-green-400/80" />
              <span className="mr-2">ai_core.ts</span>
            </div>
            <div><span className="text-[#38BDF8]">const</span> agent = <span className="text-[#C5A059]">new</span> NeuralEngine();</div>
            <div><span className="text-[#38BDF8]">await</span> agent.<span className="text-[#DFCA9B]">synthesize</span>({'{'} mode: <span className="text-emerald-400">'scale'</span> {'}'});</div>
          </div>

          <div 
            className="absolute bottom-20 right-10 p-3 rounded-lg border border-[#C5A059]/30 bg-black/40 backdrop-blur-xs text-[#E8D4A8] space-y-1 hidden lg:block"
            style={{ animation: `heroFloatingCard ${Number(calculatedDuration) * 1.2}s ease-in-out infinite alternate-reverse` }}
          >
            <div className="flex items-center gap-1.5 opacity-60 text-[9px] pb-1 border-b border-[#C5A059]/20">
              <span>system_status.log</span>
            </div>
            <div className="text-emerald-400 font-bold">✓ Latency: 4ms | AI Pipeline Online</div>
            <div className="text-xs opacity-75">Deploying Enterprise Architecture...</div>
          </div>
        </div>
      )}

      {/* Interactive Micro Particles */}
      {particlesEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="w-2.5 h-2.5 rounded-full bg-[#C5A059] absolute top-1/4 left-1/3 opacity-40 blur-xs"
            style={{ animation: `heroParticle 7s ease-in-out infinite` }}
          />
          <div 
            className="w-3.5 h-3.5 rounded-full bg-[#38BDF8] absolute top-3/5 right-1/4 opacity-35 blur-xs"
            style={{ animation: `heroParticle 11s ease-in-out infinite 2s` }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-[#DFCA9B] absolute bottom-1/3 left-1/5 opacity-50 blur-xs"
            style={{ animation: `heroParticle 9s ease-in-out infinite 4s` }}
          />
          <div 
            className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] absolute top-1/2 right-1/3 opacity-60"
            style={{ animation: `heroParticle 6s ease-in-out infinite 1s` }}
          />
        </div>
      )}

      {/* Subtle Scanline / Cyber Matrix Sweep */}
      {motionStyle === 'cyber_scan' && (
        <div 
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#C5A059]/10 to-transparent pointer-events-none"
          style={{ animation: `heroScanline ${calculatedDuration}s linear infinite` }}
        />
      )}

      {/* Keyframe Styles Injected for Precision Animations */}
      <style>{`
        @keyframes heroPanZoom {
          0% { transform: scale(1.03) translate(0%, 0%); }
          50% { transform: scale(1.10) translate(-1.5%, -1%); }
          100% { transform: scale(1.05) translate(1.5%, 1%); }
        }
        @keyframes heroPulseZoom {
          0%, 100% { transform: scale(1.04); }
          50% { transform: scale(1.11); }
        }
        @keyframes heroGentleWave {
          0% { transform: scale(1.04) rotate(0deg); }
          50% { transform: scale(1.08) rotate(0.4deg); }
          100% { transform: scale(1.04) rotate(-0.4deg); }
        }
        @keyframes heroAuraGlow {
          0% { transform: scale(0.9) translate(0%, 0%); opacity: 0.7; }
          100% { transform: scale(1.2) translate(4%, 3%); opacity: 1; }
        }
        @keyframes heroFloatingCard {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-16px); }
        }
        @keyframes heroParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(25px, -35px) scale(1.4); opacity: 0.8; }
        }
        @keyframes heroScanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
};

