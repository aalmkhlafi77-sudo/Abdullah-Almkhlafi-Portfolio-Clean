/** Keep expensive canvas work off the main thread when its section is not visible. */
export function startVisibleCanvasAnimation(canvas: HTMLCanvasElement, draw: () => void): () => void {
  let inViewport = typeof IntersectionObserver === 'undefined';
  let active = false;
  let disposed = false;
  let frameId: number | undefined;

  const frame = () => {
    frameId = undefined;
    if (!active) return;
    draw();
    if (active) frameId = requestAnimationFrame(frame);
  };

  const sync = () => {
    if (disposed) return;
    const shouldRun = inViewport && !document.hidden;
    if (shouldRun === active) return;
    active = shouldRun;
    if (active) {
      frameId = requestAnimationFrame(frame);
    } else if (frameId !== undefined) {
      cancelAnimationFrame(frameId);
      frameId = undefined;
    }
  };

  const observer = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(entries => {
    inViewport = entries.some(entry => entry.isIntersecting);
    sync();
  });
  observer?.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  sync();

  return () => {
    disposed = true;
    active = false;
    observer?.disconnect();
    document.removeEventListener('visibilitychange', sync);
    if (frameId !== undefined) cancelAnimationFrame(frameId);
  };
}
