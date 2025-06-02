<script lang="ts">
  import paylines from '$lib/assets/cases-paylines.json';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';
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

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Use float to discover winning case from payout table</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Cases</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="text-left text-sm">
    <table class="w-full">
      <thead>
        <tr>
          <th class="px-4 py-4 font-medium whitespace-nowrap text-gray-900 sm:px-6 dark:text-white"
            >Min Bound</th
          >
          <th class="px-4 py-4 font-medium whitespace-nowrap text-gray-900 sm:px-6 dark:text-white"
            >Multiplier</th
          >
        </tr>
      </thead>
      <tbody>
        {#each payline as { min, multiplier } (min)}
          <tr
            class={[
              'border-b border-gray-300 dark:border-gray-700',
              payout === multiplier ? `font-bold ${TEXT_HIGHLIGHT_COLOR}` : ''
            ]}
          >
            <td class="px-6 py-3">{min} {float > min ? `(< ${float.toFixed(12)})` : ''}</td>
            <td class="px-6 py-3">{multiplier.toFixed(2)}x</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </ContentBlock>
</div>
