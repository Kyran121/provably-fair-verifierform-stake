<script lang="ts">
  import { BlueSamuraiIcon as BlueSamuraiIconT, BlueSamuraiReelType } from '$lib/types';
  import BlueSamuraiIcon from '$lib/games/bluesamurai/BlueSamuraiIcon.svelte';
  import probabilities from '$lib/assets/bluesamurai/bluesamurai-probabilities.json';
  import { innerTileProbabilitySummed, outerTileProbabilitySummed } from '$lib/util/bluesamurai';
  import bigDecimal from 'js-big-decimal';

  const {
    float,
    reelType
  }: {
    float?: number;
    reelType?: BlueSamuraiReelType;
  } = $props();

  const activeSummed = $derived(
    reelType === BlueSamuraiReelType.OUTER ? outerTileProbabilitySummed : innerTileProbabilitySummed
  );

  // Index in `probabilities[]` of the matched symbol (first where float < summed)
  const matchedIndex = $derived.by(() => {
    if (float === undefined || reelType === undefined) return -1;
    const bd = new bigDecimal(float);
    for (let i = 0; i < activeSummed.length; i++) {
      if (bd.compareTo(activeSummed[i].max) < 0) {
        return probabilities.findIndex((p) => p.symbol === activeSummed[i].symbol);
      }
    }
    return -1;
  });

  // Map probabilities index → summed value string for each reel type
  const innerSummedByIndex = $derived.by(() => {
    const map = new Map<number, { max: string; min: string }>();
    for (let i = 0; i < innerTileProbabilitySummed.length; i++) {
      const entry = innerTileProbabilitySummed[i];
      const idx = probabilities.findIndex((p) => p.symbol === entry.symbol);
      if (idx !== -1) {
        const min = innerTileProbabilitySummed[i - 1]?.max.getValue() ?? '0';
        map.set(idx, { max: entry.max.getValue(), min });
      }
    }
    return map;
  });

  const outerSummedByIndex = $derived.by(() => {
    const map = new Map<number, { max: string; min: string }>();
    for (let i = 0; i < outerTileProbabilitySummed.length; i++) {
      const entry = outerTileProbabilitySummed[i];
      const idx = probabilities.findIndex((p) => p.symbol === entry.symbol);
      if (idx !== -1) {
        const min = outerTileProbabilitySummed[i - 1]?.max.getValue() ?? '0';
        map.set(idx, { max: entry.max.getValue(), min });
      }
    }
    return map;
  });

  const isActive = $derived(float !== undefined && reelType !== undefined);

  let scrollContainer = $state<HTMLElement | null>(null);

  function scrollToMatched(container: HTMLElement, idx: number) {
    const cell = container.querySelector<HTMLElement>(`[data-col="${idx}"]`);
    if (!cell) return;
    const containerWidth = container.offsetWidth;
    if (containerWidth === 0) return; // not laid out yet
    const cellOffset = cell.offsetLeft;
    const cellWidth = cell.offsetWidth;
    container.scrollLeft = cellOffset - containerWidth / 2 + cellWidth / 2;
  }

  $effect(() => {
    const idx = matchedIndex;
    const container = scrollContainer;
    if (!container || idx === -1) return;

    // Attempt immediate scroll (works when already visible)
    requestAnimationFrame(() => scrollToMatched(container, idx));

    // Also watch for the container gaining width (e.g. after a reveal animation/transition)
    let lastWidth = container.offsetWidth;
    const ro = new ResizeObserver(() => {
      const w = container.offsetWidth;
      if (w > 0 && w !== lastWidth) {
        lastWidth = w;
        scrollToMatched(container, idx);
      }
    });
    ro.observe(container);

    return () => ro.disconnect();
  });

  function colClass(n: number) {
    if (!isActive) return '';
    if (n === matchedIndex) return 'bg-purple-100 dark:bg-purple-900/40';
    return 'opacity-40';
  }

  function summedCellClass(n: number, isActiveRow: boolean) {
    if (!isActiveRow || !isActive) return '';
    if (n === matchedIndex)
      return 'bg-green-200 text-green-800 font-bold dark:bg-green-800/50 dark:text-green-300';
    return '';
  }
</script>

<div class="relative text-xs sm:text-sm">
  <div class="overflow-x-auto pb-3" bind:this={scrollContainer}>
    <table class="w-full border-collapse">
      <thead>
        <!-- Symbol icons row -->
        <tr>
          <th
            class="sticky left-0 z-10 min-w-[110px] bg-gray-300 p-2 text-left text-xs font-semibold sm:min-w-[130px] dark:bg-gray-700"
          >
            symbol
          </th>
          {#each probabilities as { symbol }, n (n)}
            <td data-col={n} class={['p-1 transition-opacity', colClass(n)]}>
              <div class="mx-auto w-12 bg-gray-300 dark:bg-gray-600">
                <BlueSamuraiIcon icon={symbol as BlueSamuraiIconT} />
              </div>
            </td>
          {/each}
        </tr>
        <!-- Symbol name row -->
        <tr>
          <th
            class="sticky left-0 z-10 bg-gray-300 p-2 text-left text-xs font-semibold dark:bg-gray-700"
          >
            name
          </th>
          {#each probabilities as { symbol }, n (n)}
            <td class={['p-2 text-center transition-opacity', colClass(n)]}>
              {symbol}
            </td>
          {/each}
        </tr>
      </thead>

      <tbody class="text-center">
        <!-- Inner probability -->
        <tr class="border-t border-gray-200 dark:border-gray-600">
          <th
            class="sticky left-0 z-10 bg-gray-300 p-2 text-left text-xs font-semibold dark:bg-gray-700"
          >
            inner prob.
          </th>
          {#each probabilities as { inner }, n (n)}
            <td
              class={[
                'p-2 transition-opacity',
                reelType === BlueSamuraiReelType.INNER ? colClass(n) : 'opacity-30'
              ]}
            >
              {inner}
            </td>
          {/each}
        </tr>

        <!-- Inner summed row -->
        <tr class="border-b border-gray-200 dark:border-gray-600">
          <th
            class="sticky left-0 z-10 bg-gray-300 p-2 text-left text-xs font-semibold dark:bg-gray-700"
          >
            inner summed
          </th>
          {#each probabilities as _p, n (n)}
            {@const entry = innerSummedByIndex.get(n)}
            <td
              class={[
                'p-2 font-mono transition-all',
                reelType === BlueSamuraiReelType.INNER ? colClass(n) : 'opacity-30',
                summedCellClass(n, reelType === BlueSamuraiReelType.INNER)
              ]}
            >
              {#if entry}
                {#if reelType === BlueSamuraiReelType.INNER && n === matchedIndex}
                  <span class="block text-gray-500 dark:text-gray-400">{entry.min}</span>
                  <span
                    class="my-0.5 block border-t border-b border-green-400 py-0.5 font-bold text-purple-700 dark:text-purple-300"
                  >
                    {float!.toFixed(8)}
                  </span>
                  <span class="block text-green-700 dark:text-green-400">{entry.max} ✓</span>
                {:else}
                  {entry.max}
                {/if}
              {:else}
                <span class="text-gray-400">—</span>
              {/if}
            </td>
          {/each}
        </tr>

        <!-- Outer probability -->
        <tr class="border-t border-gray-200 dark:border-gray-600">
          <th
            class="sticky left-0 z-10 bg-gray-300 p-2 text-left text-xs font-semibold dark:bg-gray-700"
          >
            outer prob.
          </th>
          {#each probabilities as { outer }, n (n)}
            <td
              class={[
                'p-2 transition-opacity',
                reelType === BlueSamuraiReelType.OUTER ? colClass(n) : 'opacity-30'
              ]}
            >
              {outer > 0 ? outer : '—'}
            </td>
          {/each}
        </tr>

        <!-- Outer summed row -->
        <tr>
          <th
            class="sticky left-0 z-10 bg-gray-300 p-2 text-left text-xs font-semibold dark:bg-gray-700"
          >
            outer summed
          </th>
          {#each probabilities as _p, n (n)}
            {@const entry = outerSummedByIndex.get(n)}
            <td
              class={[
                'p-2 font-mono transition-all',
                reelType === BlueSamuraiReelType.OUTER ? colClass(n) : 'opacity-30',
                summedCellClass(n, reelType === BlueSamuraiReelType.OUTER)
              ]}
            >
              {#if entry}
                {#if reelType === BlueSamuraiReelType.OUTER && n === matchedIndex}
                  <span class="block text-gray-500 dark:text-gray-400">{entry.min}</span>
                  <span
                    class="my-0.5 block border-t border-b border-green-400 py-0.5 font-bold text-purple-700 dark:text-purple-300"
                  >
                    {float!.toFixed(8)}
                  </span>
                  <span class="block text-green-700 dark:text-green-400">{entry.max} ✓</span>
                {:else}
                  {entry.max}
                {/if}
              {:else}
                <span class="text-gray-400">—</span>
              {/if}
            </td>
          {/each}
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Legend -->
  {#if isActive && matchedIndex !== -1}
    <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-3 w-3 rounded-sm bg-purple-200 dark:bg-purple-800"></span>
        matched symbol column
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-3 w-3 rounded-sm bg-green-200 dark:bg-green-700"></span>
        prev. summed / <span class="font-bold text-purple-700 dark:text-purple-300">float</span> / summed
        ✓ — float falls in this range
      </span>
    </div>
  {/if}
</div>
