<script lang="ts">
  import reels from '$lib/assets/scarabspins-tomeoflife/slot-reels.json';
  import Indicator from '$lib/games/Indicator.svelte';
  import { ScarabSpinsTomeOfLifeIcon } from '$lib/types';
  import { scrollToCenterVertically } from '$lib/util/scroll-impl/scrollToCenterVertically';
  import { type Component } from 'svelte';

  const {
    floats,
    resultIndex,
    IconComponent
  }: {
    floats: number[];
    resultIndex: number;
    IconComponent: Component<{ icon: ScarabSpinsTomeOfLifeIcon }>;
  } = $props();

  let reelRefs: (HTMLDivElement | null)[] = $state([null, null, null, null, null]);

  let scrollable = $state(false);

  const focusedReelIndex = $derived(resultIndex % 5);

  const reelCenterPositions = $derived.by(() => {
    const lowerBound = Math.floor(resultIndex / 5) * 5;
    return floats
      .slice(lowerBound, lowerBound + 5)
      .map((float, i) => Math.floor(float * (i === 4 ? 41 : 30)));
  });

  $effect(() => {
    reelCenterPositions.forEach((position, n) => {
      const container = reelRefs[n];
      const element = container?.querySelector(`div[data-icon="${position}"]`);

      if (container && element) {
        //doing it manually to prevent ancestors from scrolling
        scrollToCenterVertically(container, element as HTMLElement);
      }
    });
  });
</script>

<div class="mt-5 mb-7 bg-gray-200 p-5 text-center text-base dark:bg-gray-700">
  <p class="mb-2 text-lg">Symbol Ordering</p>
  <button
    onclick={() => (scrollable = !scrollable)}
    class={[
      'm-auto mb-3 block px-5 py-1.5 text-sm font-medium text-white focus:ring-0 focus:outline-none',
      scrollable
        ? 'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'
        : 'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
    ]}>{scrollable ? 'Disable' : 'Enable'} Reel Scrolling</button
  >
  <div class="grid grid-cols-5">
    {#each reels as reel, nn (nn)}
      <div>
        <p class="mb-1">
          Reel {nn + 1}<br /><i class="text-xs">(scroll{scrollable ? 'able' : ' locked'})</i>
        </p>
        <div
          class={[
            'h-65 flex-none pr-4',
            scrollable ? 'overflow-y-scroll' : 'overflow-hidden',
            nn === focusedReelIndex ? 'bg-gray-50 dark:bg-gray-800' : ''
          ]}
          bind:this={reelRefs[nn]}
        >
          <div class="relative">
            <IconComponent icon={reel.slice(-1) as unknown as ScarabSpinsTomeOfLifeIcon} />
            <Indicator
              text={`${nn === 4 ? 41 : 30}/${reel.length}`}
              bgColorClass="bg-gray-300 dark:bg-gray-500"
            />
          </div>
          {#each reel as icon, n (n)}
            <div class="relative" data-icon={n}>
              <IconComponent icon={icon as unknown as ScarabSpinsTomeOfLifeIcon} />
              <Indicator
                text={`${n + 1}/${reel.length}`}
                bgColorClass={n === reelCenterPositions[nn]
                  ? 'bg-green-400 dark:bg-green-700'
                  : 'bg-gray-300 dark:bg-gray-500'}
              />
            </div>
          {/each}
          <div class="relative mb-2">
            <IconComponent icon={reel[0] as unknown as ScarabSpinsTomeOfLifeIcon} />
            <Indicator text={`1/${reel.length}`} bgColorClass="bg-gray-300 dark:bg-gray-500" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
