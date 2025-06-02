<script lang="ts">
  import { RockPaperScissorsOutcome, type Item } from '$lib/types';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import HighlightLink from '../layout/HighlightLink.svelte';
  import HighlightText from '../layout/HighlightText.svelte';

  const {
    stepNumber,
    float,
    chosenIndex,
    chosen
  }: { stepNumber: number } & Item<RockPaperScissorsOutcome> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into result</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Rock Paper Scissors</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>numberOfOutcomes = 3</p>
    <p>outcomes = [ ROCK, PAPER, SCISSORS ]</p>
    <p>float = {float.toFixed(12)}</p>
    <p class="mt-4">outcomeIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> *
      <HighlightText>&lbrace;numberOfOutcomes&rbrace;</HighlightText>)
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> *
      <HighlightText>3</HighlightText>)
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">result</p>
    <p>= <HighlightText>&lbrace;outcomes[outcomeIndex]&rbrace;</HighlightText></p>
    <p>= <HighlightText>&lbrace;outcomes[{chosenIndex}]&rbrace;</HighlightText></p>
    <p>= {chosen}</p>
  </ContentBlock>
</div>
