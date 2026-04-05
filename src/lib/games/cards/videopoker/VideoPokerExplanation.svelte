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
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';

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

      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400">Cards drawn in the order shown below.</span
          >
          Click a card to find out how it was generated using Stake's provably fair algorithm.
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        {items}
        bind:resultIndex
        tabWidthClass="w-16"
        grayCardIcon={true}
        tabClassModifier={(n) => {
          const isInitial = n < 5;
          const unselected = isInitial
            ? `border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40`
            : `border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40`;
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${unselected} !outline-none !ring-0 text-gray-500 dark:text-gray-400 opacity-70`
          );
        }}
        tabSelectedClassModifier={(n) => {
          const isInitial = n < 5;
          const selected = isInitial
            ? `border-blue-500 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/30 ring-blue-500 dark:ring-blue-400 focus:ring-blue-500`
            : `border-green-500 dark:border-green-400 bg-green-100 dark:bg-green-900/30 ring-green-500 dark:ring-green-400 focus:ring-green-500`;
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${selected} font-bold !ring-2 shadow-lg z-10 opacity-100 ` +
            `!outline-none focus:!ring-2 text-gray-600 dark:text-gray-400`
          );
        }}
      />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <VideoPokerResultStep
        stepNumber={2}
        {resultIndex}
        {...selectedItem}
        color={resultIndex < 5
          ? {
              bg: 'bg-blue-100 dark:bg-blue-900/30',
              border: 'border-blue-500 dark:border-blue-400',
              ring: 'ring-blue-500 dark:ring-blue-400',
              resultBorder: 'border-blue-500 dark:border-blue-400',
              resultBg: 'bg-blue-50 dark:bg-blue-900/20',
              label: 'blue'
            }
          : {
              bg: 'bg-green-100 dark:bg-green-900/30',
              border: 'border-green-500 dark:border-green-400',
              ring: 'ring-green-500 dark:ring-green-400',
              resultBorder: 'border-green-500 dark:border-green-400',
              resultBg: 'bg-green-50 dark:bg-green-900/20',
              label: 'green'
            }}
      />
    {/if}
  </div>
</div>
