import type { FisherYatesItem } from '$lib/types';

/** Chicken result calculations - death index and max multiplier */
export function useChickenResult(items: FisherYatesItem<number>[] | null, payline: number[]) {
  const deathIndex = $derived(
    items ? Math.min(...items.map((item) => item.chosen + 1)) : -1
  );

  const maxMulti = $derived(
    deathIndex > payline.length
      ? null
      : deathIndex > 0
        ? payline[deathIndex - 1]
        : payline[0]
  );

  return {
    get deathIndex() {
      return deathIndex;
    },
    get maxMulti() {
      return maxMulti;
    }
  };
}
