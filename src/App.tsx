import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { TopGlobalBar } from './components/common/TopGlobalBar';
import { ToastContainer } from './components/ui/ToastContainer';
import { PublicHeader } from './components/public/PublicHeader';
import { PublicHero } from './components/public/PublicHero';
import { PublicExpertise } from './components/public/PublicExpertise';
import { PublicProjects } from './components/public/PublicProjects';
import { PublicArticles } from './components/public/PublicArticles';
import { PublicQuote } from './components/public/PublicQuote';
import { PublicContact } from './components/public/PublicContact';
import { PublicFooter } from './components/public/PublicFooter';
import { FloatingWidgets } from './components/public/FloatingWidgets';
import { UnifiedPropertiesSidebar } from './components/public/services/UnifiedPropertiesSidebar';
import { VisualPageBuilder } from './components/builder/VisualPageBuilder';
import { ContentStudio } from './components/studio/ContentStudio';
import { GlobalModals } from './components/common/GlobalModals';

const MainContent: React.FC = () => {
  const { viewMode, theme, isAuthenticated, isLiveEditMode, showLivePropertiesPanel } = useApp();

  const isLiveSidebarActive = isAuthenticated && isLiveEditMode && showLivePropertiesPanel;

  return (
    <div 
      className={`min-h-screen font-sans transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-[#121212] text-[#F9F7F2]' 
          : 'bg-[#F9F7F2] text-[#121212]'
      }`}
      dir="rtl"
    >
      {/* Universal Mode Bar (Only visible for authenticated admins OR when actively in builder/studio mode) */}
      {(isAuthenticated || viewMode !== 'public') && <TopGlobalBar />}

      {/* Main View Router with subtle smooth fade-in transition */}
      <AnimatePresence mode="wait">
        {viewMode === 'public' && (
          <div className="relative min-h-[calc(100vh-44px)] flex w-full">
            {/* Page Canvas Container - dynamically contracts on desktop when Properties Inspector opens */}
            <motion.main 
              key="public-mode"
              id="public-view-container"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
              className={`flex-1 min-w-0 w-full relative transition-[margin] duration-300 ease-in-out selection:bg-[#C5A059]/30 selection:text-[#121212] dark:selection:text-[#F9F7F2] ${
                isLiveSidebarActive ? 'lg:ml-96' : 'lg:ml-0'
              }`}
            >
              <PublicHeader />
              <PublicHero />
              <PublicExpertise />
              <PublicProjects />
              <PublicArticles />
              <PublicQuote />
              <PublicContact />
              <PublicFooter />
              <FloatingWidgets />
            </motion.main>

            {/* Properties Inspector Sidebar */}
            {isLiveSidebarActive && <UnifiedPropertiesSidebar />}
          </div>
        )}

        {viewMode === 'builder' && (
          <motion.main 
            key="builder-mode"
            id="builder-view-container"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
            className="relative"
          >
            <VisualPageBuilder />
          </motion.main>
        )}

        {viewMode === 'studio' && (
          <motion.main 
            key="studio-mode"
            id="studio-view-container"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
            className="relative"
          >
            <ContentStudio />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Global Layer-safe Modals */}
      <GlobalModals />

      {/* Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

