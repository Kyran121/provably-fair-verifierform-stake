<script lang="ts">
  import type { CoinFlip, Item } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';
  import HighlightText from '../layout/HighlightText.svelte';

  const {
    stepNumber,
    float,
    chosen
  }: {
    stepNumber: number;
  } & Item<CoinFlip> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into flip</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Flip</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>flipSides = [ TAILS, HEADS ]</p>

    <p class="mt-4">float = {float.toFixed(12)}</p>

    <p class="mt-4">flip</p>
    <p>
      = <HighlightText>&lbrace;flipSlides[float &lt;= 0.5 ? 0 : 1]</HighlightText>
    </p>
    <p>= <HighlightText>&lbrace;flipSlides[{float <= 0.5 ? 0 : 1}]</HighlightText></p>
    <p>= {chosen.toUpperCase()}</p>
  </ContentBlock>
</div>
