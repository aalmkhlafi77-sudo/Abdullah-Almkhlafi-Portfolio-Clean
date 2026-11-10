import React from 'react';
import {
  AppWindow, BarChart3, Brain, Briefcase, Calculator, Code2, Compass, Cpu,
  Globe, Layers, Palette, PenTool, ShieldCheck, Smartphone, Sparkles,
  TrendingUp, User, Workflow,
  type LucideIcon,
} from 'lucide-react';

const commonIcons: Record<string, LucideIcon> = {
  AppWindow, BarChart3, Brain, Briefcase, Calculator, Code2, Compass, Cpu,
  Globe, Layers, Palette, PenTool, ShieldCheck, Smartphone, Sparkles,
  TrendingUp, User, Workflow,
};

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size, color, style }) => {
  const [extraIcon, setExtraIcon] = React.useState<LucideIcon | null>(null);
  React.useEffect(() => {
    if (commonIcons[name]) return;
    let active = true;
    void import('lucide-react').then((icons) => {
      const loaded = (icons as unknown as Record<string, LucideIcon>)[name];
      if (active) setExtraIcon(() => loaded ?? Sparkles);
    });
    return () => { active = false; };
  }, [name]);
  const IconComponent = commonIcons[name] ?? extraIcon ?? Sparkles;
  const mergedStyle: React.CSSProperties = {
    ...(color ? { color } : {}),
    ...(style || {})
  };
  return <IconComponent className={className} size={size} color={color} style={mergedStyle} />;
};


