import React from 'react';

import type { DeviceMode } from '../../types';

/** Intrinsic-height page frame: the surrounding preview viewport owns scrolling. */
export const PreviewPageFrame: React.FC<{
  theme: 'light' | 'dark';
  deviceMode: DeviceMode;
  children: React.ReactNode;
}> = ({ theme, deviceMode, children }) => (
  <div
    className={`flex-none transition-all duration-300 w-full rounded-2xl shadow-2xl overflow-hidden border relative mb-12 ${
      theme === 'dark' ? 'bg-[#121212] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
    }`}
    style={{
      maxWidth: deviceMode === 'mobile' ? '390px' : deviceMode === 'tablet' ? '768px' : '100%',
      minHeight: '85vh',
    }}
  >
    {children}
  </div>
);
