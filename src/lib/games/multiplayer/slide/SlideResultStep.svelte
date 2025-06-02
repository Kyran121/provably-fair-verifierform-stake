<script lang="ts">
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';
  import HighlightLink from '$lib/games/layout/HighlightLink.svelte';

  const { stepNumber, hmac }: { stepNumber: number; hmac: string } = $props();
  const hex = $derived(hmac.substring(0, 8));
  const int = $derived(parseInt(hex, 16));
  const slideStopPoint = $derived(
    Math.floor(Math.max(1, (2 ** 32 / (int + 1)) * (1 - 0.02)) * 100) / 100
  );
  const slideStopPointEquation = $derived(
    `floor(max(1, (2 ** 32 / (${int} + 1)) * (1 - 0.02)) * 100) / 100 = ${slideStopPoint.toFixed(2)}x`
  );
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform number into slide stop point</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    See <HighlightLink href="https://bitcointalk.org/index.php?topic=5249741.0"
      >bitcointalk post</HighlightLink
    > for game result formula
  </p>
  <ContentBlock className="p-5 text-center font-mono text-xs whitespace-pre-wrap">
    <p>{slideStopPointEquation}</p>
  </ContentBlock>
</div>
