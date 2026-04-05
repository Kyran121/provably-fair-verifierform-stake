<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed, Card as TCard } from '$lib/types';
  import { generateCardDeck } from '$lib/util/cards';
  import Card from '$lib/games/cards/Card.svelte';
  import Loader from '$lib/games/Loader.svelte';

  type Result = {
    initialPlayer: TCard[];
    initialBanker: TCard[];
    decider: TCard[];
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
        for (let i = 0; i < 6; i++) {
          cards.push(deck[Math.floor(floatGenerator.next().value * 52)]);
        }
        return {
          initialPlayer: cards.splice(0, 2),
          initialBanker: cards.splice(0, 2),
          decider: cards
        } satisfies Result;
      },
      350
    )
  );
</script>

{#if chosenCardsDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="baccarat-player-result" class="hidden text-center text-base">
    {chosenCardsDebounced
      .value!.initialPlayer.map(({ value, suit }) => `${value}-${suit}`)
      .join(', ')}
  </p>
  <p data-testid="baccarat-dealer-result" class="hidden text-center text-base">
    {chosenCardsDebounced
      .value!.initialBanker.map(({ value, suit }) => `${value}-${suit}`)
      .join(', ')}
  </p>
  <p data-testid="baccarat-decider-result" class="hidden text-center text-base">
    {chosenCardsDebounced.value!.decider.map(({ value, suit }) => `${value}-${suit}`).join(', ')}
  </p>

  <div class="mt-5 mb-6">
    <p class="mb-3 text-center text-lg font-semibold text-blue-600 dark:text-blue-400">
      Initial Player Cards
    </p>
    <div class="grid grid-cols-2 gap-2 md:gap-3">
      {#each chosenCardsDebounced.value!.initialPlayer as card, n (n)}
        <Card {...card} />
      {/each}
    </div>
  </div>

  <div class="mb-6">
    <p class="mb-3 text-center text-lg font-semibold text-green-600 dark:text-green-400">
      Initial Banker Cards
    </p>
    <div class="grid grid-cols-2 gap-2 md:gap-3">
      {#each chosenCardsDebounced.value!.initialBanker as card, n (n)}
        <Card {...card} />
      {/each}
    </div>
  </div>

  <div class="mb-6">
    <p class="mb-3 text-center text-lg font-semibold text-purple-600 dark:text-purple-400">
      Decider Cards
    </p>
    <div class="grid grid-cols-2 gap-2 md:gap-3">
      {#each chosenCardsDebounced.value!.decider as card, n (n)}
        <Card {...card} />
      {/each}
    </div>
  </div>
{/if}
