<script lang="ts">
  import type { Card, Item } from '$lib/types';
  import CardSuitIcon from '$lib/games/cards/CardSuitIcon.svelte';
  import { generateCardDeck } from '$lib/util/cards';
  import HighlightLink from '$lib/games/layout/HighlightLink.svelte';
  import HighlightText from '$lib/games/layout/HighlightText.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const deck = generateCardDeck();

  const {
    stepNumber,
    float,
    chosen,
    chosenIndex,
    color = {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-500 dark:border-blue-400',
      ring: 'ring-blue-500 dark:ring-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      resultBorder: 'border-blue-500 dark:border-blue-400',
      resultBg: 'bg-blue-50 dark:bg-blue-900/20',
      label: 'blue'
    }
  }: {
    stepNumber: number;
    color?: {
      bg: string;
      border: string;
      ring: string;
      text: string;
      resultBorder: string;
      resultBg: string;
      label: string;
    };
  } & Item<Card> = $props();
</script>

<div class="mt-7 text-center">
  <p class="mb-2 text-2xl font-semibold">Step {stepNumber}</p>
  <p class="mb-2 text-lg">Transform float into card</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    See <span class="font-bold">Blackjack, Hilo & Baccarat</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="p-6 text-left font-mono text-sm">
    <!-- Constants -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">Constants</p>
      <p class="leading-relaxed">
        deckSize = <span class="font-bold text-blue-600 dark:text-blue-400">52</span>
      </p>
    </div>

    <!-- Deck Display -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
        Card Deck (52 cards, organized by suit)
      </p>
      <div class="grid grid-cols-13 gap-1 text-xs">
        {#each deck as { value, suit }, n (n)}
          <button
            class={[
              'flex min-w-0 flex-col items-center justify-center rounded border p-1.5 transition-all',
              n === chosenIndex
                ? `z-10 scale-110 font-bold shadow-lg ring-2 ${color.border} ${color.bg} ${color.ring}`
                : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800'
            ]}
            disabled
          >
            <span class="text-[11px] text-gray-500 dark:text-gray-400">{n}</span>
            <span class="font-semibold">{value}</span>
            <span class="hidden dark:inline"><CardSuitIcon {suit} small={true} /></span>
            <span class="inline dark:hidden"><CardSuitIcon {suit} small={true} dark={true} /></span>
          </button>
        {/each}
      </div>
      <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Selected card is highlighted in {color.label}
      </p>
    </div>

    <!-- Float Value -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">Float Value</p>
      <p class="leading-relaxed">
        float = <span class="font-bold text-blue-600 dark:text-blue-400">{float.toFixed(12)}</span>
      </p>
    </div>

    <!-- Calculate Card Index -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
        Calculate Card Index
      </p>
      <p class="leading-relaxed">cardIndex</p>
      <p class="leading-relaxed">
        = floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> *
        <HighlightText>&lbrace;deckSize&rbrace;</HighlightText>)
      </p>
      <p class="leading-relaxed">
        = floor(<HighlightText>{float.toFixed(12)}</HighlightText> *
        <HighlightText>52</HighlightText>)
      </p>
      <p class="leading-relaxed font-bold">
        = <span class="text-green-600 dark:text-green-400">{chosenIndex}</span>
      </p>
    </div>

    <!-- Get Card from Deck -->
    <div class="mb-4">
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
        Get Card from Deck
      </p>
      <p class="leading-relaxed">card</p>
      <p class="leading-relaxed">
        = <HighlightText>&lbrace;deck[cardIndex]&rbrace;</HighlightText>
      </p>
      <p class="leading-relaxed">
        = <HighlightText>&lbrace;deck[{chosenIndex}]&rbrace;</HighlightText>
      </p>
      <div class="mt-4 flex items-center gap-2">
        <span class="leading-relaxed">=</span>
        <div
          class="inline-flex min-w-[80px] flex-col items-center justify-center rounded border-2 {color.resultBorder} {color.resultBg} p-3 shadow-lg"
        >
          <span class="mb-1 text-[10px] text-gray-600 dark:text-gray-400">Index {chosenIndex}</span>
          <span class="text-2xl font-bold">{chosen.value}</span>
          <span class="mt-1 hidden dark:inline"
            ><CardSuitIcon suit={chosen.suit} small={false} /></span
          >
          <span class="mt-1 inline dark:hidden"
            ><CardSuitIcon suit={chosen.suit} small={false} dark={true} /></span
          >
        </div>
      </div>
    </div>
  </ContentBlock>
</div>
