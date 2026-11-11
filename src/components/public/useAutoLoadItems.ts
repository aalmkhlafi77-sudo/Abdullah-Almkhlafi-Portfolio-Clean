import { useEffect, useRef, useState } from 'react';

/** Reveal the next batch when the end of a filtered list becomes visible. */
export const useAutoLoadItems = (total: number, filterKey: string, initialCount: number, increment: number) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setVisibleCount(initialCount); }, [filterKey, initialCount]);

  useEffect(() => {
    if (visibleCount >= total) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisibleCount(total);
      return;
    }
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleCount((current) => Math.min(total, current + increment));
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [total, visibleCount, increment, filterKey]);

  return { visibleCount, sentinelRef };
};
