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

  const { previousNumbers, kenoBoardMinusPreviousNumbers } = $derived.by(() => {
    const kenoBoard = Array.from({ length: 40 }).map((_v, i) => i + 1);
    const previousNumbers = chosenIndexes.slice(0, -1).map((i) => kenoBoard.splice(i, 1)[0]);
    return { previousNumbers, kenoBoardMinusPreviousNumbers: kenoBoard };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into keno number</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Keno</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>kenoSquares = 40</p>
    <p>previousNumbers = {`[${previousNumbers.join(', ')}]`}</p>
    <p class="mt-4">
      kenoBoardWithoutPreviousNumbers = {`[${kenoBoardMinusPreviousNumbers.join(', ')}]`}
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">kenoNumberIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> * (<HighlightText
        >&lbrace;kenoSquares&rbrace;</HighlightText
      >
      -
      <HighlightText>&lbrace;resultIndex&rbrace;</HighlightText>))
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> * (<HighlightText>40</HighlightText
      >
      -
      <HighlightText>{resultIndex}</HighlightText>))
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">kenoNumber</p>
    <p>
      = <HighlightText>&lbrace;kenoBoardWithoutPreviousNumbers[</HighlightText>
    </p>
    <p class="indent-4"><HighlightText>kenoNumberIndex</HighlightText></p>
    <p><HighlightText>]&rbrace;</HighlightText></p>
    <p>
      = <HighlightText>&lbrace;kenoBoardWithoutPreviousNumbers[</HighlightText>
    </p>
    <p class="indent-4"><HighlightText>{chosenIndex}</HighlightText></p>
    <p><HighlightText>]&rbrace;</HighlightText></p>
    <p>= {chosen}</p>
  </ContentBlock>
</div>
