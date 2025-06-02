<script lang="ts">
  import { Gem, type Item } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';
  import HighlightText from '../layout/HighlightText.svelte';

  const gems = Object.values(Gem);

  const {
    stepNumber,
    float,
    chosen,
    chosenIndex
  }: {
    stepNumber: number;
  } & Item<Gem> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into gem</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Diamonds</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>numberOfGems = {gems.length}</p>
    <p class="mt-4">
      gems = [
      {#each gems as gem, n (n)}
        <span
          class={[
            'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
            n === chosenIndex
              ? 'border-gray-400 bg-purple-300 dark:bg-purple-500 dark:text-white'
              : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
          ]}>({n}) {gem}</span
        >
      {/each}
      ]
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">gemIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> *
      <HighlightText>&lbrace;numberOfGems&rbrace;</HighlightText>)
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> *
      <HighlightText>{gems.length}</HighlightText>)
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">card</p>
    <p>
      = <HighlightText>&lbrace;gems[gemIndex]&rbrace;</HighlightText>
    </p>
    <p>
      = <HighlightText>&lbrace;gems[{chosenIndex}]&rbrace;</HighlightText>
    </p>
    <p>
      = {chosen}
    </p>
  </ContentBlock>
</div>
