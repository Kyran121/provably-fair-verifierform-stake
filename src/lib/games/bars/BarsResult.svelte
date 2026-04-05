<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { BarsDifficulty, BarsSeed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import paylines from '$lib/assets/bars-paylines.json';
  import { getPayout } from '$lib/util/payout';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  function getTileColors(value: number) {
    if (value > 5)
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-500 dark:border-yellow-400',
        text: 'text-yellow-700 dark:text-yellow-400'
      };
    if (value > 1)
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-500 dark:border-green-400',
        text: 'text-green-700 dark:text-green-400'
      };
    return {
      bg: 'bg-gray-100 dark:bg-gray-800',
      border: 'border-gray-400 dark:border-gray-500',
      text: 'text-gray-600 dark:text-gray-400'
    };
  }
  const seed = $derived<BarsSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as BarsDifficulty,
    barCount: formValues.barcount as number,
    selectedBars: formValues.selectedbars as string | undefined
  });

  // Parse selected bars from comma-separated string
  const selectedBarsArray = $derived.by(() => {
    const selectedbarsStr = seed.selectedBars;
    if (!selectedbarsStr || selectedbarsStr.trim() === '') {
      return [];
    }
    return selectedbarsStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0 && n < 30);
  });

  const resultDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const multis = [];
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

          multis.push({ multi, multiNotDivided, isSelected });
        }
        return {
          multis,
          totalPayout,
          hasSelection: selectedBarsSet.size > 0,
          selectedCount: parsedBars.length
        };
      },
      350
    )
  );
</script>

{#if resultDebounced.debouncing}
  <Loader />
{:else}
  {@const result = resultDebounced.value!}

  <div class="mt-5 mb-5 rounded-lg dark:bg-gray-900 dark:text-white">
    <!-- Total Payout Display -->
    {#if result.hasSelection}
      <div class="mb-4 rounded-lg bg-blue-500 p-4 text-white dark:bg-blue-800">
        <div class="text-sm font-medium">Total Payout Multiplier</div>
        <div class="text-3xl font-bold">{result.totalPayout.toFixed(2)}x</div>
        <div class="mt-1 text-xs opacity-90">
          Sum of {result.selectedCount} selected bar{result.selectedCount === 1 ? '' : 's'}
        </div>
      </div>
    {/if}

    <!-- Number Grid -->
    <div class="grid grid-cols-5 gap-1 md:gap-1.5">
      {#each result.multis as { multi, multiNotDivided, isSelected }, n (n)}
        {@const colors = getTileColors(multiNotDivided)}
        <div
          class={[
            'relative flex aspect-square h-10 w-full items-center justify-center rounded border-2 transition-all',
            colors.bg,
            colors.border,
            colors.text,
            isSelected ? 'font-bold ring-2 ' + colors.border : 'opacity-75'
          ]}
        >
          {multi.toFixed(2)}x
          {#if isSelected}
            <span
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white shadow-md ring-2 ring-white dark:ring-gray-900"
              >✓</span
            >
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
