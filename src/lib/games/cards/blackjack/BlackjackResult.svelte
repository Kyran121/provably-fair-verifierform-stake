<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed, Card as TCard } from '$lib/types';
  import { generateCardDeck } from '$lib/util/cards';
  import Card from '$lib/games/cards/Card.svelte';
  import Loader from '$lib/games/Loader.svelte';

  type Result = {
    initialDealer: TCard[];
    initialPlayer: TCard[];
    remaining: TCard[];
  };

  const { formValues }: { formValues: Record<string, unknown> } = $props();
  const deck = generateCardDeck();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const chosenCardsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const cards = [];
        for (let i = 0; i < 52; i++) {
          cards.push(deck[Math.floor(floatGenerator.next().value * 52)]);
        }
        return {
          initialDealer: cards.splice(0, 2),
          initialPlayer: cards.splice(0, 2),
          remaining: cards
        } satisfies Result;
      },
      350
    )
  );
</script>

{#if chosenCardsDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="blackjack-dealer-result" class="hidden text-center text-base">
    {chosenCardsDebounced
      .value!.initialDealer.map(({ value, suit }) => `${value}-${suit}`)
      .join(', ')}
  </p>
  <p data-testid="blackjack-player-result" class="hidden text-center text-base">
    {chosenCardsDebounced
      .value!.initialPlayer.map(({ value, suit }) => `${value}-${suit}`)
      .join(', ')}
  </p>
  <p data-testid="blackjack-remaining-result" class="hidden text-center text-base">
    {chosenCardsDebounced.value!.remaining.map(({ value, suit }) => `${value}-${suit}`).join(', ')}
  </p>

  <p class="text-center">Initial player cards</p>
  <div class="grid grid-cols-2 gap-1 sm:gap-1.5">
    {#each chosenCardsDebounced.value!.initialDealer as card (card.value)}
      <Card {...card} />
    {/each}
  </div>

  <p class="mt-5 text-center">Initial dealer cards</p>
  <div class="grid grid-cols-2 gap-1 sm:gap-1">
    {#each chosenCardsDebounced.value!.initialPlayer as card (card.value)}
      <Card {...card} />
    {/each}
  </div>

  <p class="mt-5 text-center">Remaing cards in deck</p>
  <div class="flex gap-1.5 overflow-x-scroll pb-5">
    {#each chosenCardsDebounced.value!.remaining as card (card.value)}
      <div class="w-20 flex-none">
        <Card {...card} />
      </div>
    {/each}
  </div>
{/if}
