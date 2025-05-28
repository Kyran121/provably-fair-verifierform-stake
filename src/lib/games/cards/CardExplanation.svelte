<script lang="ts">
  import type { Seed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import { generateCardDeck } from '$lib/util/cards';
  import CardResultStep from '$lib/games/cards/CardResultStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import { shuffle } from '$lib/util/shuffle-impl/shuffle';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues, count = 52 }: { formValues: Record<string, unknown>; count?: number } =
    $props();

  let resultIndex = $state(0);

  let seed = $derived<Seed>({
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
        return shuffle(floatGenerator, deck, count);
      },
      350
    )
  );
</script>

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if chosenCardsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = chosenCardsDebounced.value!}

      <p class="mb-7 bg-gray-200 p-2 text-center text-base dark:bg-gray-700">
        Cards drawn in the order shown below. Click a card to find out how it was generated using
        stake's provably fair algorithm
      </p>

      <ResultTabs {seed} {items} bind:resultIndex />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <CardResultStep stepNumber={2} {...selectedItem} />
    {/if}
  </div>
</div>
