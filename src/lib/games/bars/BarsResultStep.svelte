<script lang="ts">
  import paylines from '$lib/assets/bars-paylines.json';
  import type { BarsSeed } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';

  const {
    stepNumber,
    seed,
    float,
    multi,
    multiNotDivided
  }: {
    stepNumber: number;
    seed: BarsSeed;
    float: number;
    multi: number;
    multiNotDivided: number;
    index?: number;
    isSelected?: boolean;
  } = $props();

  const payline = $derived(paylines[seed.difficulty]);

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
</script>

<div class="mt-7 text-center">
  <p class="mb-2 text-2xl font-semibold">Step {stepNumber}</p>
  <p class="mb-2 text-lg">Use float to discover multiplier from payout table</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    See <span class="font-bold">Bars</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-6 text-left font-mono text-sm">
    <!-- Float Value -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">Float Value</p>
      <p class="leading-relaxed">
        float = <span class="font-bold text-blue-600 dark:text-blue-400">{float.toFixed(12)}</span>
      </p>
    </div>

    <!-- Payout Table -->
    <div class="mb-4">
      <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
        Payout Table — first row where min &le; float
      </p>
      <table class="w-full overflow-x-auto">
        <thead>
          <tr class="border-b border-gray-300 dark:border-gray-600">
            <th
              class="py-2 pr-6 text-left font-sans text-xs text-gray-500 uppercase dark:text-gray-400"
              >Min Bound</th
            >
            <th class="py-2 text-left font-sans text-xs text-gray-500 uppercase dark:text-gray-400"
              >Multiplier</th
            >
          </tr>
        </thead>
        <tbody>
          {#each payline as { min, multiplier } (min)}
            {@const isWinner = multiNotDivided === multiplier}
            {@const colors = getTileColors(multiplier)}
            <tr
              class={[
                'border-b border-gray-200 dark:border-gray-700',
                isWinner ? `${colors.bg} font-bold` : ''
              ]}
            >
              <td class={['py-2 pr-6', isWinner ? colors.text : '']}>
                {min}{float > min ? ` (< ${float.toFixed(12)})` : ''}
              </td>
              <td class={['py-2', isWinner ? colors.text : '']}>
                {multiplier.toFixed(2)}x{isWinner ? ' ✓' : ''}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </ContentBlock>
</div>

<div class="mt-7 text-center">
  <p class="mb-2 text-2xl font-semibold">Step {stepNumber + 1}</p>
  <p class="mb-4 text-lg">Divide multiplier by bar count</p>

  <ContentBlock
    className="mt-3 p-6 font-mono text-base text-center from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
  >
    <div class="flex items-center justify-center gap-3">
      <span class="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >{multiNotDivided.toFixed(2)}x</span
      >
      <span class="text-xl text-gray-500">÷</span>
      <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">{seed.barCount}</span>
      <span class="text-xl text-gray-500">=</span>
      <span class="text-2xl font-bold text-green-600 dark:text-green-400">{multi.toFixed(2)}x</span>
    </div>
  </ContentBlock>
</div>
