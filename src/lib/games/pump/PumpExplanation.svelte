<script lang="ts">
  import { PUMP_DIFFICULTY_TO_SLICE } from '$lib/constants';
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { PumpDifficulty, PumpSeed } from '$lib/types';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import PumpMultiplierStep from '$lib/games/pump/PumpMultiplierStep.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  const seed = $derived<PumpSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as PumpDifficulty
  });

  const fisherYateItemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const slice = PUMP_DIFFICULTY_TO_SLICE[seed.difficulty];
        const indexes = Array.from({ length: 25 }).map((_v, i) => i);
        const fisherYateItems = fisherYates(floatGenerator, indexes, slice);
        return fisherYateItems;
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if fisherYateItemsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = fisherYateItemsDebounced.value!}
      {@const item = items[resultIndex]}
      {@const slice = PUMP_DIFFICULTY_TO_SLICE[seed.difficulty]}
      {@const payoutIndex = Math.min(...items.map((item) => item.chosen))}
      {@const maxIndex = 25 - slice}

      <div class="mt-5 mb-2 text-center">
        <p class="mb-2 text-xl">Step 1</p>
        <p class="text-base">Create an array with 25 indexes</p>
      </div>

      <p
        class="bg-gray-200 p-5 font-mono text-xs break-all text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        indexes = [
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html Array.from({ length: 25 })
          .map(
            (_v, i) =>
              '<span class="mr-1 mb-1 inline-block border-1 border-gray-400 bg-gray-300 p-1 dark:border-none dark:bg-gray-700">' +
              i +
              '</span>'
          )
          .join('')}]
      </p>

      <div class="mt-5 text-center">
        <p class="mb-2 text-xl">Step 2</p>
        <p class="text-base">
          Extract {slice} random index{slice > 1 ? 'es' : ''} from array using fisher-yates
        </p>
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
          A different amount of indexes are needed based on difficulty:<br />
          {#each Object.entries(PUMP_DIFFICULTY_TO_SLICE) as [difficulty, slice], n (n)}
            <span
              class={[
                'mt-2 mr-2 inline-block p-1 text-gray-500',
                difficulty === seed.difficulty
                  ? 'bg-blue-200 dark:bg-blue-500 dark:text-white'
                  : 'bg-gray-200  dark:bg-gray-800 dark:text-gray-400'
              ]}>{difficulty} - {slice}</span
            >
          {/each}
        </p>
        <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
          Pump payline has <span class="font-bold text-blue-500"
            >25 - ({slice} - 1) = {25 - (slice - 1)}</span
          >
          increasing multipliers. To get the max multiplier, as you will see from step 3, the minimum
          {slice > 1 ? `of the ${slice} random indexes` : 'index'} has to be
          <span class="font-bold text-blue-500">{maxIndex}</span>
        </p>
      </div>

      <div class="mt-3 border-1 border-gray-400 p-5">
        {#if seed.difficulty !== 'easy'}
          <ResultTabs {seed} {items} bind:resultIndex />
        {/if}
        <FloatGenerationStep stepNumber={2.1} {resultIndex} {seed} float={item.float} />
        <PumpMultiplierStep stepNumber={2.2} {resultIndex} {...item} />
      </div>

      <div class="mt-4 text-center">
        <p class="mb-2 text-xl">Step 3</p>
        <p class="text-base">Max payout index = minimum of random indexes</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Refer to result below form for payline - index is shown above the multiplier
        </p>
      </div>

      <p
        class="mt-3 bg-gray-200 p-5 font-mono text-xs break-all text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        maxPayoutIndex = min(
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html items
          .map((item) => item.chosen)
          .map(
            (v) =>
              '<span class="mr-1 mb-1 inline-block border-1 border-gray-400 bg-gray-300 p-1 dark:border-none dark:bg-gray-700">' +
              v +
              '</span>'
          )
          .join('')}
        ) = {payoutIndex}
      </p>
    {/if}
  </div>
</div>
