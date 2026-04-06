<script lang="ts">
  import paylines from '$lib/assets/wheel-paylines.json';
  import { BG_COLOR } from '$lib/config';
  import type { WheelSeed } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';
  import HighlightText from '../layout/HighlightText.svelte';

  const { stepNumber, seed, float }: { stepNumber: number; seed: WheelSeed; float: number } =
    $props();

  const payline = $derived(paylines[seed.segments as unknown as keyof typeof paylines][seed.risk]);
  const chosenIndex = $derived(Math.floor(float * seed.segments));
  const chosen = $derived(payline[chosenIndex]);
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into payout</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Wheel</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="mt-5 p-5 text-left font-mono text-xs">
    <p>
      payline = [
      {#each payline as multi, n (n)}
        <span
          class={[
            'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
            n === chosenIndex ? BG_COLOR : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
          ]}
        >
          ({n}) {multi}x
        </span>
      {/each}
      ]
    </p>

    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p>segments = {seed.segments}</p>

    <p class="mt-4">chosenIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> *
      <HighlightText>&lbrace;segments&rbrace;</HighlightText>)
    </p>
    <p>
      = floor(<HighlightText>{float}</HighlightText> *
      <HighlightText>{seed.segments}</HighlightText>)
    </p>
    <p>= {chosenIndex}</p>

    <p class="mt-4">payout</p>
    <p>= <HighlightText>&lbrace;payline[chosenIndex]&rbrace;</HighlightText></p>
    <p>= <HighlightText>&lbrace;payline[{chosenIndex}]&rbrace;</HighlightText></p>
    <p>= {chosen}x</p>
  </ContentBlock>
</div>
