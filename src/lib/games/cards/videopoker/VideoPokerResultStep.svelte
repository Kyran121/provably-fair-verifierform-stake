<script lang="ts">
  import type { Card, FisherYatesItem } from '$lib/types';
  import CardSuitIcon from '$lib/games/cards/CardSuitIcon.svelte';
  import { generateCardDeck } from '$lib/util/cards';
  import HighlightLink from '$lib/games/layout/HighlightLink.svelte';
  import HighlightText from '$lib/games/layout/HighlightText.svelte';
  import { BG_COLOR } from '$lib/constants';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';

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
  } & FisherYatesItem<Card> = $props();

  const { previousCards, deckMinusPreviousCards } = $derived.by(() => {
    const deck = generateCardDeck();
    const previousCards = chosenIndexes.slice(0, -1).map((i) => deck.splice(i, 1)[0]);
    return { previousCards, deckMinusPreviousCards: deck };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into card</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Video Poker</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-5 text-left font-mono text-xs">
    <p>deckSize = 52</p>
    <p>
      previousCards = [
      {#each previousCards as { value, suit }, n (n)}
        <span
          class={[
            'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
            n === chosenIndex
              ? 'border-gray-400 bg-purple-300 dark:bg-purple-500'
              : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
          ]}
          >({n}) {value}
          <span class="hidden dark:inline"><CardSuitIcon {suit} small={true} /></span><span
            class="inline dark:hidden"><CardSuitIcon {suit} small={true} dark={true} /></span
          ></span
        >
      {/each}
      ]
    </p>
    <p class="mt-4">
      deckWithoutPreviousCards = [
      {#each deckMinusPreviousCards as { value, suit }, n (n)}
        <span
          class={[
            'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
            n === chosenIndex
              ? 'bg-purple-300 dark:bg-purple-500'
              : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
          ]}
          >({n}) {value}
          <span class="hidden dark:inline"><CardSuitIcon {suit} small={true} /></span><span
            class="inline dark:hidden"><CardSuitIcon {suit} small={true} dark={true} /></span
          ></span
        >
      {/each}
      ]
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">cardIndex</p>
    <p>
      = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> * (<HighlightText
        >&lbrace;deckSize&rbrace;</HighlightText
      >
      -
      <HighlightText>&lbrace;resultIndex&rbrace;</HighlightText>))
    </p>
    <p>
      = floor(<HighlightText>{float.toFixed(12)}</HighlightText> * (<HighlightText>52</HighlightText
      >
      -
      <HighlightText>{resultIndex}</HighlightText>))
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">card</p>
    <p>
      = <HighlightText>&lbrace;deckWithoutPreviousCards[cardIndex]&rbrace;</HighlightText>
    </p>
    <p>
      = <HighlightText>&lbrace;deckWithoutPreviousCards[{chosenIndex}]&rbrace;</HighlightText>
    </p>
    <p>
      = <span
        class="inline-block border-1 border-gray-400 bg-gray-300 p-1 dark:border-none dark:bg-gray-700"
        >{chosen.value}
        <span class="hidden dark:inline"><CardSuitIcon suit={chosen.suit} small={true} /></span
        ><span class="inline dark:hidden"
          ><CardSuitIcon suit={chosen.suit} small={true} dark={true} /></span
        ></span
      >
    </p>
  </ContentBlock>
</div>
