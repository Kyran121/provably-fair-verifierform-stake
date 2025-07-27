import { fade, fly, scale } from 'svelte/transition';
import type { TransitionConfig } from 'svelte/transition';

export function fadeFlyScale(node: Element, { delay = 0, duration = 300 } = {}): TransitionConfig {
  const f = fade(node, { delay, duration });
  const fl = fly(node, { y: 16, delay, duration });
  const s = scale(node, { start: 0.95, delay, duration });

  return {
    delay,
    duration,
    css: (t, u) => `
      ${f.css?.(t, u) || ''}
      ${fl.css?.(t, u) || ''}
      ${s.css?.(t, u) || ''}
    `
  };
}
