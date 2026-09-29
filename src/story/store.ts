/**
 * Mutable story state read inside the render loop. Scroll writes story.t;
 * the camera director, water FX, actors and captions all sample it per
 * frame — React never re-renders during scroll.
 */
export const story = {
  t: 0,
  pointerX: 0,
  pointerY: 0,
};

type Listener = (t: number) => void;
const listeners = new Set<Listener>();
let lastPhase = -1;

/** Subscribe only when the discrete UI phase changes (cheap for the DOM). */
export function onStoryPhase(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setStoryTime(t: number) {
  story.t = t;
  const phase = Math.floor(t * 20);
  if (phase !== lastPhase) {
    lastPhase = phase;
    listeners.forEach((fn) => fn(t));
  }
}
