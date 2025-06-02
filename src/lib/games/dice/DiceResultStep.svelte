<script lang="ts">
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';
  import HighlightLink from '$lib/games/layout/HighlightLink.svelte';

  const { stepNumber, float }: { stepNumber: number; float: number } = $props();
  const rollNumber = $derived(Math.floor(float * 10001) / 100);
  const rollNumberEquation = $derived(
    `floor(${float.toFixed(12)} * 10001) / 100 = ${rollNumber.toFixed(2)}`
  );
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into roll number</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Dice Roll</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
    page
  </p>

  <ContentBlock className="p-5 font-mono text-sm text-center">
    <p class="whitespace-pre-wrap">{rollNumberEquation}</p>
  </ContentBlock>
</div>
