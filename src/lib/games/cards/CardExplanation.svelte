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
  import ContentBlock from '../layout/ContentBlock.svelte';

  const {
    formValues,
    count = 52,
    colorScheme = 'hilo'
  }: {
    formValues: Record<string, unknown>;
    count?: number;
    colorScheme?: 'baccarat' | 'blackjack' | 'hilo';
  } = $props();

  let resultIndex = $state(0);

  const colors = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-500 dark:border-blue-400',
      ring: 'ring-blue-500 dark:ring-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      resultBorder: 'border-blue-500 dark:border-blue-400',
      resultBg: 'bg-blue-50 dark:bg-blue-900/20',
      label: 'blue',
      unselected:
        'border-blue-400 dark:border-blue-700 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-500 dark:border-green-400',
      ring: 'ring-green-500 dark:ring-green-400',
      text: 'text-green-600 dark:text-green-400',
      resultBorder: 'border-green-500 dark:border-green-400',
      resultBg: 'bg-green-50 dark:bg-green-900/20',
      label: 'green',
      unselected:
        'border-green-400 dark:border-green-700 bg-green-100 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-500 dark:border-purple-400',
      ring: 'ring-purple-500 dark:ring-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
      resultBorder: 'border-purple-500 dark:border-purple-400',
      resultBg: 'bg-purple-50 dark:bg-purple-900/20',
      label: 'purple',
      unselected:
        'border-purple-400 dark:border-purple-700 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40'
    }
  };

  function getCardColor(index: number) {
    if (colorScheme === 'baccarat') {
      // Baccarat: 0-1 blue (player), 2-3 green (banker), 4-5 purple (decider)
      if (index < 2) return colors.blue;
      if (index < 4) return colors.green;
      return colors.purple;
    } else if (colorScheme === 'blackjack') {
      // Blackjack: 0-1 blue (first two), 2-3 green (second two), rest purple
      if (index < 2) return colors.blue;
      if (index < 4) return colors.green;
      return colors.purple;
    } else {
      // Hilo: all blue
      return colors.blue;
    }
  }

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
          const color = getCardColor(n);
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${color.unselected} !outline-none !ring-0 text-gray-500 dark:text-gray-400 opacity-70`
          );
        }}
        tabSelectedClassModifier={(n) => {
          const color = getCardColor(n);
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${color.border} ${color.bg} font-bold !ring-2 ${color.ring} shadow-lg z-10 opacity-100 ` +
            `!outline-none focus:!ring-2 focus:${color.ring} text-gray-600 dark:text-gray-400`
          );
        }}
        tabNameModifier={(chosen, n) => {
          return `<span class="text-[11px] text-gray-500 dark:text-gray-400 block">${n}</span>`;
        }}
      />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <CardResultStep stepNumber={2} {...selectedItem} color={getCardColor(resultIndex)} />
    {/if}
  </div>
</div>
