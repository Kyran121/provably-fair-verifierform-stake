<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed } from '$lib/types';
  import { generateCardDeck } from '$lib/util/cards';
  import Card from '$lib/games/cards/Card.svelte';
  import Loader from '$lib/games/Loader.svelte';

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
        return cards;
      },
      350
    )
  );
</script>

{#if chosenCardsDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="hilo-result" class="hidden text-center text-base">
    {chosenCardsDebounced.value!.map(({ value, suit }) => `${value}-${suit}`).join(', ')}
  </p>

  <p class="mt-5 text-center">Order of cards</p>
  <div class="flex gap-1.5 overflow-x-scroll pb-5">
    {#each chosenCardsDebounced.value! as card, n (n)}
      <div class="w-20 flex-none">
        <Card {...card} />
      </div>
    {/each}
  </div>
{/if}
