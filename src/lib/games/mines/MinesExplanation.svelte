<script lang="ts">
  import type { MinesSeed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import MinesResultStep from '$lib/games/mines/MinesResultStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  let seed = $derived<MinesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    mines: formValues.mines as number
  });

  const fisherYateItemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const minesBoard = Array.from({ length: 25 }).map((_v, i) => i + 1);
        const fisherYateItems = fisherYates(floatGenerator, minesBoard, seed.mines);
        return fisherYateItems;
      },
      350
    )
  );
</script>

<div class="mt-7 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if fisherYateItemsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = fisherYateItemsDebounced.value!}

      <ContentBlock className="mb-7 p-2 text-center text-base text-gray-900 dark:text-white">
        <p>
          Mines drawn in the order shown below. Click a mine to find out how it was generated using
          stake's provably fair algorithm
        </p>
      </ContentBlock>

      <ResultTabs {seed} {items} bind:resultIndex />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <MinesResultStep stepNumber={2} {resultIndex} {...selectedItem} />
    {/if}
  </div>
</div>
