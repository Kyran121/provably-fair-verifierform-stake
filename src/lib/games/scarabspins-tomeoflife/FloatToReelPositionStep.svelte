<script lang="ts">
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';
  import HighlightText from '../layout/HighlightText.svelte';

  const {
    stepNumber,
    resultIndex,
    float
  }: {
    stepNumber: number;
    resultIndex: number;
    float: number;
  } = $props();

  const reelSize = $derived(resultIndex % 5 === 4 ? 41 : 30);
  const reelPosition = $derived(Math.floor(float * reelSize));
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into reel position</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Scarab Spin / Tome of Life</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>reelSize = {reelSize}</p>
    <p>float = {float.toFixed(12)}</p>

    <p class="mt-4">reelPosition</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> *
      <HighlightText>&lbrace;reelSize&rbrace;</HighlightText>) + 1
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> *
      <HighlightText>{reelSize}</HighlightText>) + 1
    </p>
    <p>= {reelPosition + 1}</p>
  </ContentBlock>
</div>
