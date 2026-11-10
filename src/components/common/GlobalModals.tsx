import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProfileModal } from './ProfileModal';
import { SettingsModal } from './SettingsModal';
import { LoginModal } from './LoginModal';
import { IconLibraryModal } from './IconLibraryModal';
import { ShowcaseManageModal } from './ShowcaseManageModal';
import { ResumeCvModal } from './ResumeCvModal';

export const GlobalModals: React.FC = () => {
  const { 
    showProfileModal, 
    setShowProfileModal, 
    showSettingsModal, 
    setShowSettingsModal,
    showIconLibraryModal,
    setShowIconLibraryModal,
    iconLibraryTarget,
    applyIconToTarget,
    applyPresetPackToServices,
    services,
    metrics,
    theme
  } = useApp();

  const targetItem = iconLibraryTarget?.type === 'service' 
    ? services.find(s => s.id === iconLibraryTarget.id)
    : iconLibraryTarget?.type === 'metric'
    ? metrics.find(m => m.id === iconLibraryTarget.id)
    : null;

  return (
    <div id="global-modals-portal" className="relative z-[99999]">
      {/* Profile & Photo Editor Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* Hero & System Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />

      {/* Icon Library Studio Modal */}
      <IconLibraryModal
        isOpen={showIconLibraryModal}
        onClose={() => setShowIconLibraryModal(false)}
        onSelectIcon={applyIconToTarget}
        onApplyPresetPack={applyPresetPackToServices}
        currentIconName={targetItem?.iconName || 'Sparkles'}
        currentColor={targetItem?.iconColor}
        currentSize={targetItem?.iconSize}
        currentRotation={targetItem?.iconRotation}
        theme={theme}
      />

      {/* Showcase Apps & Logos Manager Modal */}
      <ShowcaseManageModal />

      {/* Interactive Resume / CV Generator & PDF Exporter */}
      <ResumeCvModal />

      {/* Admin Security Login Modal */}
      <LoginModal />
    </div>
  );
};

