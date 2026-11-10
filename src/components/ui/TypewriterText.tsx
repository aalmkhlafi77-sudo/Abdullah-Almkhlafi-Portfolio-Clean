import React, { useState, useEffect, useMemo } from 'react';

interface TypewriterTextProps {
  phrases: string | string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
  loop?: boolean;
  className?: string;
  cursorClassName?: string;
  cursorColor?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  phrases,
  typingSpeed = 50,
  deletingSpeed = 26,
  pauseDuration = 2600,
  startDelay = 350,
  loop = true,
  className = '',
  cursorClassName = '',
  cursorColor,
  showCursor = true,
  onComplete,
}) => {
  const phraseList = useMemo(() => {
    if (Array.isArray(phrases)) {
      return phrases.filter(p => typeof p === 'string' && p.trim().length > 0);
    }
    if (typeof phrases === 'string' && phrases.trim().length > 0) {
      if (phrases.includes('\n')) {
        return phrases.split('\n').map(p => p.trim()).filter(Boolean);
      }
      return [phrases];
    }
    return [];
  }, [phrases]);

  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.visibilityState !== 'hidden';
    }
    return true;
  });

  // Track page visibility to pause when tab is backgrounded and resume when active
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState !== 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Reset state when phrase list changes dynamically from the builder
  useEffect(() => {
    setPhraseIndex(0);
    setDisplayText('');
    setIsDeleting(false);
    setIsWaiting(true);
  }, [phraseList]);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(phraseList[0] || '');
      return;
    }

    if (!isPageVisible || phraseList.length === 0) {
      return;
    }

    const currentPhrase = phraseList[phraseIndex] || '';
    let timer: NodeJS.Timeout;

    if (isWaiting) {
      // Initial start delay before typing or pause after finishing phrase
      const waitTime = displayText.length === 0 ? startDelay : pauseDuration;
      timer = setTimeout(() => {
        setIsWaiting(false);
      }, waitTime);
      return () => clearTimeout(timer);
    }

    if (!isDeleting) {
      // TYPING MODE
      if (displayText.length < currentPhrase.length) {
        // Natural human-like cadence variation
        const nextChar = currentPhrase[displayText.length];
        let charDelay = typingSpeed;
        
        // Slight organic pause on punctuation
        if ([',', '،', '.', '!', '؟', '?', '|', ':', '—'].includes(nextChar)) {
          charDelay += 120;
        } else if (nextChar === ' ') {
          charDelay += 30;
        } else {
          charDelay += (Math.random() * 14 - 7);
        }

        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, Math.max(15, charDelay));
      } else {
        // Reached end of current phrase
        if (loop) {
          setIsWaiting(true);
          setIsDeleting(true);
        } else if (onComplete) {
          onComplete();
        }
      }
    } else {
      // DELETING MODE
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next phrase (or repeat same phrase if 1 item)
        setIsDeleting(false);
        setIsWaiting(true);
        setPhraseIndex(prev => (prev + 1) % phraseList.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayText, 
    isDeleting, 
    isWaiting, 
    phraseIndex, 
    phraseList, 
    typingSpeed, 
    deletingSpeed, 
    pauseDuration, 
    startDelay, 
    loop, 
    onComplete, 
    prefersReducedMotion,
    isPageVisible
  ]);

  // Full accessible label for screen readers
  const currentFullText = phraseList[phraseIndex] || '';

  return (
    <span 
      className={`inline-flex items-center flex-wrap min-h-[1.35em] ${className}`}
      dir="auto"
      aria-label={currentFullText}
      role="text"
    >
      <span className="inline leading-normal">
        {displayText}
      </span>

      {showCursor && (
        <span 
          aria-hidden="true"
          style={{ backgroundColor: cursorColor || 'currentColor' }}
          className={`inline-block w-[3px] h-[0.85em] rounded-full mx-1 align-middle transition-opacity animate-typewriter-cursor ${
            cursorClassName || 'shadow-[0_0_8px_currentColor]'
          }`}
        />
      )}
    </span>
  );
};

