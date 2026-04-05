<script lang="ts">
  import paylines from '$lib/assets/cases-paylines.json';
  import type { CasesSeed } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';

  const {
    stepNumber,
    seed,
    float,
    payout
  }: { stepNumber: number; seed: CasesSeed; float: number; payout: number } = $props();

  const payline = $derived(paylines[seed.difficulty]);
</script>

<div class="mt-7 text-center">
  <p class="mb-2 text-2xl font-semibold">Step {stepNumber}</p>
  <p class="mb-2 text-lg">Use float to discover winning case from payout table</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Cases</span> section on the
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
      <table class="w-full">
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
            <tr
              class={[
                'border-b border-gray-200 dark:border-gray-700',
                payout === multiplier
                  ? 'bg-green-50 font-bold text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : ''
              ]}
            >
              <td class="py-2 pr-6">{min}{float > min ? ` (< ${float.toFixed(12)})` : ''}</td>
              <td class="py-2">{multiplier.toFixed(2)}x{payout === multiplier ? ' ✓' : ''}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </ContentBlock>
</div>
