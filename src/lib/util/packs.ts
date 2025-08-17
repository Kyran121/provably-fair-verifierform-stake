import cards from '$lib/assets/packs/packs-payline.json';
import type { PacksCard } from '$lib/types';

export function findCard(value: number): PacksCard | null {
  for (const entry of cards) {
    if (value >= entry.min) {
      return entry;
    }
  }
  return null;
}
