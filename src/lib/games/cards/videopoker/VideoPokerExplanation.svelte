<script lang="ts">
  import type { Seed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import { generateCardDeck } from '$lib/util/cards';
  import VideoPokerResultStep from '$lib/games/cards/videopoker/VideoPokerResultStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  let seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const fisherYateItemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const cards = generateCardDeck();
        const fisherYateItems = fisherYates(floatGenerator, cards, 10);
        return fisherYateItems;
      },
      350
    )
  );
</script>

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if fisherYateItemsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = fisherYateItemsDebounced.value!}

      <p class="mb-7 bg-gray-200 p-2 text-center text-base dark:bg-gray-700">
        Cards drawn in the order shown below. Click a card to find out how it was generated using
        stake's provably fair algorithm
      </p>

      <ResultTabs {seed} {items} bind:resultIndex />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <VideoPokerResultStep stepNumber={2} {resultIndex} {...selectedItem} />
    {/if}
  </div>
</div>
