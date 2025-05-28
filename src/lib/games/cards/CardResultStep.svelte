<script lang="ts">
  import type { Card, Item } from '$lib/types';
  import CardSuitIcon from '$lib/games/cards/CardSuitIcon.svelte';
  import { generateCardDeck } from '$lib/util/cards';

  const deck = generateCardDeck();

  const {
    stepNumber,
    float,
    chosen,
    chosenIndex
  }: {
    stepNumber: number;
  } & Item<Card> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into card</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Blackjack, Hilo & Baccarat</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>deckSize = 52</p>
    <p class="mt-4">
      deck = [
      {#each deck as { value, suit }, n (n)}
        <span
          class={[
            'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
            n === chosenIndex
              ? 'border-gray-400 bg-blue-300 dark:bg-blue-500'
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
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> *
      <span class="font-bold text-blue-500">&lbrace;deckSize&rbrace;</span>)
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> *
      <span class="font-bold text-blue-500">52</span>)
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">card</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;deck[cardIndex]&rbrace;</span>
    </p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;deck[{chosenIndex}]&rbrace;</span>
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
  </div>
</div>
