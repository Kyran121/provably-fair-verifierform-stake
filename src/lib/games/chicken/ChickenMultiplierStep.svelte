<script lang="ts">
  import type { FisherYatesItem } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';
  import HighlightText from '../layout/HighlightText.svelte';

  const {
    stepNumber,
    resultIndex,
    float,
    chosen,
    chosenIndex,
    chosenIndexes
  }: {
    stepNumber: number;
    resultIndex: number;
  } & FisherYatesItem<number> = $props();

  const { previousIndexes, multiplierIndexesMinusPreviousIndexes } = $derived.by(() => {
    const multiplierIndexes = Array.from({ length: 20 }).map((_v, i) => i);
    const previousIndexes = chosenIndexes
      .slice(0, -1)
      .map((i) => multiplierIndexes.splice(i, 1)[0]);
    return { previousIndexes, multiplierIndexesMinusPreviousIndexes: multiplierIndexes };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Use float to get random index</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Pump</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>indexesRemaining = 20</p>
    <p>previousIndexCount = {resultIndex}</p>
    <p>previousIndexes = {`[${previousIndexes.join(', ')}]`}</p>
    <p class="mt-4">
      indexesMinusPreviousIndexes = {`[${multiplierIndexesMinusPreviousIndexes.join(', ')}]`}
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">chosen</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> * (<HighlightText
        >&lbrace;multipliers&rbrace;</HighlightText
      >
      -
      <HighlightText>&lbrace;resultIndex&rbrace;</HighlightText>))
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> * (<HighlightText>20</HighlightText
      >
      -
      <HighlightText>{resultIndex}</HighlightText>))
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">randomIndex</p>
    <p>
      = <HighlightText>&lbrace;indexesMinusPreviousIndexes[</HighlightText>
    </p>
    <p class="indent-4"><HighlightText>chosen</HighlightText></p>
    <p><HighlightText>]&rbrace;</HighlightText></p>
    <p>
      = <HighlightText>&lbrace;indexesMinusPreviousIndexes[</HighlightText>
    </p>
    <p class="indent-4"><HighlightText>{chosenIndex}</HighlightText></p>
    <p><HighlightText>]&rbrace;</HighlightText></p>
    <p>= {chosen}</p>
  </ContentBlock>
</div>
