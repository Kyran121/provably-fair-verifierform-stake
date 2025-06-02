<script lang="ts">
  import type { Direction, Item } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';
  import HighlightText from '../layout/HighlightText.svelte';

  const {
    stepNumber,
    float,
    chosen,
    chosenIndex
  }: {
    stepNumber: number;
  } & Item<Direction> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into direction</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Plinko</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>directions = [ L, R ]</p>
    <p>numberOfDirections = 2</p>

    <p class="mt-4">float = {float.toFixed(12)}</p>

    <p class="mt-4">directionIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> *
      <HighlightText>&lbrace;numberOfDirections&rbrace;</HighlightText>)
    </p>
    <p>
      = floor(<HighlightText>{float}</HighlightText> *
      <HighlightText>2</HighlightText>)
    </p>
    <p>= {chosenIndex}</p>

    <p class="mt-4">direction</p>
    <p>= <HighlightText>&lbrace;directions[directionIndex]&rbrace;</HighlightText></p>
    <p>= <HighlightText>&lbrace;directions[{chosenIndex}]&rbrace;</HighlightText></p>
    <p>= {chosen}</p>
  </ContentBlock>
</div>
