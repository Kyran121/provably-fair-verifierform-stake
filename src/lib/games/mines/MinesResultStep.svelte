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

  const { previousNumbers, minesBoardMinusPreviousMines } = $derived.by(() => {
    const minesBoard = Array.from({ length: 25 }).map((_v, i) => i + 1);
    const previousNumbers = chosenIndexes.slice(0, -1).map((i) => minesBoard.splice(i, 1)[0]);
    return { previousNumbers, minesBoardMinusPreviousMines: minesBoard };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into mine number</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Mines</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>mineSquares = 25</p>
    <p class="mt-4">previousMines = {`[${previousNumbers.join(', ')}]`}</p>
    <p class="mt-4">
      minesBoardWithoutPreviousMines = {`[${minesBoardMinusPreviousMines.join(', ')}]`}
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">mineIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> * (<HighlightText
        >&lbrace;mineSquares&rbrace;</HighlightText
      >
      -
      <HighlightText>&lbrace;resultIndex&rbrace;</HighlightText>))
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> * (<HighlightText>25</HighlightText
      >
      -
      <HighlightText>{resultIndex}</HighlightText>))
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">mineNumber</p>
    <p>
      = <HighlightText>&lbrace;minesBoardWithoutPreviousMines[</HighlightText>
    </p>
    <p class="indent-4"><HighlightText>minesIndex</HighlightText></p>
    <p><HighlightText>]&rbrace;</HighlightText></p>
    <p>
      = <HighlightText>&lbrace;minesBoardWithoutPreviousMines[</HighlightText>
    </p>
    <p class="indent-4"><HighlightText>{chosenIndex}</HighlightText></p>
    <p><HighlightText>]&rbrace;</HighlightText></p>
    <p>= {chosen}</p>
  </ContentBlock>
</div>
