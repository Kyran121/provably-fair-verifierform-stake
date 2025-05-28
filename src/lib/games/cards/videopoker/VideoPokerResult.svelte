<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed, Card as TCard } from '$lib/types';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import { generateCardDeck } from '$lib/util/cards';
  import Card from '$lib/games/cards/Card.svelte';
  import Loader from '$lib/games/Loader.svelte';

  type Result = {
    initial: TCard[];
    coming: TCard[];
  };

  const { formValues }: { formValues: Record<string, unknown> } = $props();

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
        const deck = generateCardDeck();
        const chosenCards = fisherYates(floatGenerator, deck, 10).map((item) => item.chosen);
        return {
          initial: chosenCards.splice(0, 5),
          coming: chosenCards
        } satisfies Result;
      },
      350
    )
  );
</script>

{#if chosenCardsDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="videopoker-initial-result" class="hidden text-center text-base">
    {chosenCardsDebounced.value!.initial.map(({ value, suit }) => `${value}-${suit}`).join(', ')}
  </p>
  <p data-testid="videopoker-coming-result" class="hidden text-center text-base">
    {chosenCardsDebounced.value!.coming.map(({ value, suit }) => `${value}-${suit}`).join(', ')}
  </p>

  <p class="text-center">Initial cards</p>
  <div class="grid grid-cols-5 gap-1 md:gap-1.5">
    {#each chosenCardsDebounced.value!.initial as initialCard, n (n)}
      <Card {...initialCard} />
    {/each}
  </div>

  <div class="mb-6">
    <p class="mt-5 text-center">Coming cards</p>
    <div class="grid grid-cols-5 gap-1 md:gap-1.5">
      {#each chosenCardsDebounced.value!.coming as comingCard, n (n)}
        <Card {...comingCard} />
      {/each}
    </div>
  </div>
{/if}
