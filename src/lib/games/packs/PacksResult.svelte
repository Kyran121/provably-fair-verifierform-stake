<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import PacksCard from './PacksCard.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';
  import { findCard } from '$lib/util/packs';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const cardsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const cards = [];
        for (let i = 0; i < 5; i++) {
          cards.push(findCard(floatGenerator.next().value));
        }
        return cards;
      },
      350
    )
  );
</script>

{#if cardsDebounced.debouncing}
  <Loader />
{:else}
  {@const cards = cardsDebounced.value!}
  {@const totalMulti = cards.reduce((a, b) => a + b!.multiplier, 0)}

  <p data-testid="packs-result" class="mb-5 text-center text-base">
    won <span class="text-xl {TEXT_HIGHLIGHT_COLOR}">{totalMulti.toFixed(2)}x</span>
  </p>

  <div class="grid grid-cols-3 gap-3">
    {#each cards as card, i (i)}
      <div>
        <PacksCard cardId={card!.cardId} />
      </div>
    {/each}
  </div>
{/if}
