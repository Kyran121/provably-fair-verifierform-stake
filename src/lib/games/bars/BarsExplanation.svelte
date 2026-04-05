<script lang="ts">
  import type { BarsDifficulty, BarsSeed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import { getPayout } from '$lib/util/payout';
  import ResultTabs from '../ResultTabs.svelte';
  import paylines from '$lib/assets/bars-paylines.json';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import BarsResultStep from './BarsResultStep.svelte';

  let resultIndex = $state(0);

  function getTileColors(value: number) {
    if (value > 5)
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-500 dark:border-yellow-400',
        ring: 'ring-yellow-500 dark:ring-yellow-400',
        text: 'text-yellow-700 dark:text-yellow-400'
      };
    if (value > 1)
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-500 dark:border-green-400',
        ring: 'ring-green-500 dark:ring-green-400',
        text: 'text-green-700 dark:text-green-400'
      };
    return {
      bg: 'bg-gray-100 dark:bg-gray-800',
      border: 'border-gray-400 dark:border-gray-500',
      ring: 'ring-gray-400 dark:ring-gray-500',
      text: 'text-gray-600 dark:text-gray-400'
    };
  }

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let seed = $derived<BarsSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as BarsDifficulty,
    barCount: formValues.barcount as number,
    selectedBars: formValues.selectedbars as string | undefined
  });

  const resultDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const results = [];
        let totalPayout = 0;

        // Parse selected bars inside debouncer
        const parsedBars = seed.selectedBars
          ? seed.selectedBars
              .split(',')
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !isNaN(n) && n >= 0 && n < 30)
          : [];
        const selectedBarsSet = new Set(parsedBars);

        for (let i = 0; i < 30; i++) {
          const float = floatGenerator.next().value;
          const payline = paylines[seed.difficulty];
          const multiNotDivided = getPayout(payline, float);
          const multi = multiNotDivided / seed.barCount;
          const isSelected = selectedBarsSet.has(i);

          if (isSelected) {
            totalPayout += multi;
          }

          results.push({ multiNotDivided, multi, float, isSelected, index: i });
        }
        return {
          results,
          totalPayout,
          hasSelection: selectedBarsSet.size > 0,
          selectedIndices: parsedBars
        };
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if resultDebounced.debouncing}
      <Loader />
    {:else}
      {@const result = resultDebounced.value!}

      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400"
            >Multis generated in the order shown below.</span
          >
          Click a multi to find out how it was generated using Stake's provably fair algorithm.
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        items={result.results.map((item) => ({
          chosen: `${item.multi.toFixed(2)}x`
        }))}
        bind:resultIndex
        tabClassModifier={(n) => {
          const colors = getTileColors(result.results[n].multiNotDivided);
          const selectedStyle = result.results[n].isSelected ? 'font-bold relative' : 'relative';
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${colors.border} ${colors.bg} ${colors.text} ${selectedStyle} ` +
            `!outline-none !ring-0 opacity-70`
          );
        }}
        tabSelectedClassModifier={(n) => {
          const colors = getTileColors(result.results[n].multiNotDivided);
          const selectedStyle = result.results[n].isSelected ? 'font-bold relative' : 'relative';
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${colors.border} ${colors.bg} ${colors.text} font-bold !ring-2 ${colors.ring} shadow-lg z-10 opacity-100 ${selectedStyle} ` +
            `!outline-none focus:!ring-2 focus:${colors.ring}`
          );
        }}
        tabNameModifier={(chosen, n) => {
          const checkmark = result.results[n].isSelected
            ? `<span class="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md ring-2 ring-white dark:ring-gray-900">✓</span>`
            : '';
          return `${chosen}${checkmark}`;
        }}
      />

      {@const selectedItem = result.results[resultIndex]}
      {@const float = selectedItem.float}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} {float} />
      <BarsResultStep stepNumber={2} {seed} {...selectedItem} />
    {/if}
  </div>
</div>
