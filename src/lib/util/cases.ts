import type { CasesSeed } from '$lib/types';
import paylines from '$lib/assets/cases-paylines.json';

export function getPayout(seed: CasesSeed, float: number) {
  const payline = paylines[seed.difficulty];
  let payout = 0;
  for (const { min, multiplier } of payline) {
    if (float >= min) {
      payout = multiplier;
      break;
    }
  }
  return payout;
}
