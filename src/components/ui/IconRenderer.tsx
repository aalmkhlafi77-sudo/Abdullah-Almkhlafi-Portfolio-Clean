import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size, color, style }) => {
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Sparkles;
  const mergedStyle: React.CSSProperties = {
    ...(color ? { color } : {}),
    ...(style || {})
  };
  return <IconComponent className={className} size={size} color={color} style={mergedStyle} />;
};


