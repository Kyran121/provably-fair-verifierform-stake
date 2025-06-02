<script lang="ts">
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';

  const { stepNumber, float }: { stepNumber: number; float: number } = $props();
  const crashPoint = $derived(
    Math.floor((16777216 / (Math.floor(float * 16777216) + 1)) * (1 - 0.01) * 100) / 100
  );
  const crashPointEquation = $derived(
    `Math.floor((16777216 / (Math.floor(${float.toFixed(12)} * 16777216) + 1) * (1 - 0.01)) * 100) / 100 = ${crashPoint.toFixed(2)}x`
  );
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into limbo crash point multiplier</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Limbo</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>
  <ContentBlock className="p-5 text-center font-mono text-xs whitespace-pre-wrap">
    <p>{crashPointEquation}</p>
  </ContentBlock>
</div>
