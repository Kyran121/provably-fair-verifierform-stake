<script lang="ts">
  import { type Seed, Gem } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import DiamondsResultStep from '$lib/games/diamonds/DiamondsResultStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import { shuffle } from '$lib/util/shuffle-impl/shuffle';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  let gems = Object.values(Gem);

  const gemToColors: Record<Gem, { bg: string; border: string; ring: string; text: string }> = {
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-500 dark:border-green-400',
      ring: 'ring-green-500 dark:ring-green-400',
      text: 'text-green-700 dark:text-green-400'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-500 dark:border-blue-400',
      ring: 'ring-blue-500 dark:ring-blue-400',
      text: 'text-blue-700 dark:text-blue-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-500 dark:border-purple-400',
      ring: 'ring-purple-500 dark:ring-purple-400',
      text: 'text-purple-700 dark:text-purple-400'
    },
    cyan: {
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      border: 'border-cyan-500 dark:border-cyan-400',
      ring: 'ring-cyan-500 dark:ring-cyan-400',
      text: 'text-cyan-700 dark:text-cyan-400'
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      border: 'border-pink-500 dark:border-pink-400',
      ring: 'ring-pink-500 dark:ring-pink-400',
      text: 'text-pink-700 dark:text-pink-400'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-500 dark:border-yellow-400',
      ring: 'ring-yellow-500 dark:ring-yellow-400',
      text: 'text-yellow-700 dark:text-yellow-400'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-500 dark:border-red-400',
      ring: 'ring-red-500 dark:ring-red-400',
      text: 'text-red-700 dark:text-red-400'
    }
  };

  let seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const chosenGemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return shuffle(floatGenerator, gems, 5);
      },
      350
    )
  );
</script>

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if chosenGemsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = chosenGemsDebounced.value!}

      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400">Gems drawn in the order shown below.</span>
          Click a gem to find out how it was generated using Stake's provably fair algorithm.
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        {items}
        bind:resultIndex
        tabWidthClass="w-20"
        tabClassModifier={(n) => {
          const gem = items[n].chosen as Gem;
          const colors = gemToColors[gem];
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${colors.border} ${colors.bg} ${colors.text} ` +
            `!outline-none !ring-0 opacity-70`
          );
        }}
        tabSelectedClassModifier={(n) => {
          const gem = items[n].chosen as Gem;
          const colors = gemToColors[gem];
          return (
            `p-1.5 rounded border transition-all flex flex-col items-center justify-center min-w-0 ` +
            `${colors.border} ${colors.bg} ${colors.text} font-bold !ring-2 ${colors.ring} shadow-lg z-10 opacity-100 ` +
            `!outline-none focus:!ring-2 focus:${colors.ring}`
          );
        }}
      />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <DiamondsResultStep stepNumber={2} {...selectedItem} />
    {/if}
  </div>
</div>
