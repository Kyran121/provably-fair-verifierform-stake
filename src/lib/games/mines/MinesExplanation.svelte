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

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if fisherYateItemsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = fisherYateItemsDebounced.value!}

      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400">Mines drawn in the order shown below.</span
          >
          Click a mine to find out how it was generated using Stake's provably fair algorithm.
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        {items}
        bind:resultIndex
        tabClassModifier={(n) =>
          `p-1.5 rounded border-2 transition-all flex flex-col items-center justify-center min-w-0 ` +
          `border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ` +
          `!outline-none ring-2 ring-transparent text-gray-500 dark:text-gray-500 opacity-70`}
        tabSelectedClassModifier={(n) =>
          `p-1.5 rounded border-2 transition-all flex flex-col items-center justify-center min-w-0 ` +
          `border-red-500 dark:border-red-400 bg-red-100 dark:bg-red-900/30 font-bold !ring-2 ring-red-400 dark:ring-red-500 shadow-lg z-10 opacity-100 ` +
          `!outline-none focus:!ring-2 focus:ring-red-500 text-gray-500 dark:text-gray-400`}
        tabNameModifier={(chosen) => `<span class="block font-bold">${chosen}</span>`}
      />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <MinesResultStep stepNumber={2} {resultIndex} {...selectedItem} />
    {/if}
  </div>
</div>
