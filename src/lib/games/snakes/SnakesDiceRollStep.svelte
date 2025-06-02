<script lang="ts">
  import type { Item } from '$lib/types';
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
  } & Item<number> = $props();

  const rollOptions = Array.from({ length: 6 }).map((_v, i) => i + 1);
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into dice roll</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Snakes</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>rollOptions = [ {rollOptions.join(', ')} ]</p>
    <p>numberOfRollOptions = {rollOptions.length}</p>

    <p class="mt-4">float = {float.toFixed(12)}</p>

    <p class="mt-4">chosenIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> *
      <HighlightText>&lbrace;numberOfRollOptions&rbrace;</HighlightText>)
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> *
      <HighlightText>{rollOptions.length}</HighlightText>)
    </p>
    <p>= {chosenIndex}</p>

    <p class="mt-4">rollNumber</p>
    <p>
      = <HighlightText>&lbrace;rollOptions[directionIndex]&rbrace;</HighlightText>
    </p>
    <p>= <HighlightText>&lbrace;rollOptions[{chosenIndex}]&rbrace;</HighlightText></p>
    <p>= {chosen}</p>
  </ContentBlock>
</div>
