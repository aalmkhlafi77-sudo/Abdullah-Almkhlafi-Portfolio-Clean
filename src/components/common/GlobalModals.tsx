import React from 'react';
import { useApp } from '../../context/AppContext';
import { LoginModal } from './LoginModal';

const ProfileModal = React.lazy(() => import('./ProfileModal').then((module) => ({ default: module.ProfileModal })));
const SettingsModal = React.lazy(() => import('./SettingsModal').then((module) => ({ default: module.SettingsModal })));
const IconLibraryModal = React.lazy(() => import('./IconLibraryModal').then((module) => ({ default: module.IconLibraryModal })));
const ShowcaseManageModal = React.lazy(() => import('./ShowcaseManageModal').then((module) => ({ default: module.ShowcaseManageModal })));
const ResumeCvModal = React.lazy(() => import('./ResumeCvModal').then((module) => ({ default: module.ResumeCvModal })));

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
    theme,
    showShowcaseModal,
    showResumeModal,
  } = useApp();

  const targetItem = iconLibraryTarget?.type === 'service' 
    ? services.find(s => s.id === iconLibraryTarget.id)
    : iconLibraryTarget?.type === 'metric'
    ? metrics.find(m => m.id === iconLibraryTarget.id)
    : null;

  return (
    <div id="global-modals-portal" className="relative z-[99999]">
      {/* Profile & Photo Editor Modal */}
      <React.Suspense fallback={null}>
      {showProfileModal && <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />}

      {/* Hero & System Settings Modal */}
      {showSettingsModal && <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />}

      {/* Icon Library Studio Modal */}
      {showIconLibraryModal && <IconLibraryModal
        isOpen={showIconLibraryModal}
        onClose={() => setShowIconLibraryModal(false)}
        onSelectIcon={applyIconToTarget}
        onApplyPresetPack={applyPresetPackToServices}
        currentIconName={targetItem?.iconName || 'Sparkles'}
        currentColor={targetItem?.iconColor}
        currentSize={targetItem?.iconSize}
        currentRotation={targetItem?.iconRotation}
        theme={theme}
      />}

      {/* Showcase Apps & Logos Manager Modal */}
      {showShowcaseModal && <ShowcaseManageModal />}

      {/* Interactive Resume / CV Generator & PDF Exporter */}
      {showResumeModal && <ResumeCvModal />}
      </React.Suspense>

      {/* Admin Security Login Modal */}
      <LoginModal />
    </div>
  );
};

