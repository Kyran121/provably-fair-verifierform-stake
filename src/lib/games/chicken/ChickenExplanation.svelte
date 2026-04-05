<script lang="ts">
  import { BG_COLOR, CHICKEN_DIFFICULTY_TO_SLICE } from '$lib/constants';
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { ChickenDifficulty, ChickenSeed } from '$lib/types';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import ChickenMultiplierStep from '$lib/games/chicken/ChickenMultiplierStep.svelte';
  import HighlightText from '../layout/HighlightText.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  const seed = $derived<ChickenSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as ChickenDifficulty
  });

  const fisherYateItemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const slice = CHICKEN_DIFFICULTY_TO_SLICE[seed.difficulty];
        const indexes = Array.from({ length: 20 }).map((_v, i) => i);
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
      {@const slice = CHICKEN_DIFFICULTY_TO_SLICE[seed.difficulty]}
      {@const payoutIndex = Math.min(...items.map((item) => item.chosen))}
      {@const maxIndex = 20 - slice}

      <!-- Header banner -->
      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400"
            >Crash point is determined by Fisher-Yates shuffle.</span
          >
          The minimum random index chosen is the max safe payline index.
        </p>
      </ContentBlock>

      <!-- Step 1 -->
      <ContentBlock className="mb-6 p-5">
        <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Step 1 — Indexes Array
        </p>
        <p class="mb-3 text-gray-700 dark:text-gray-300">Create an array with 20 indexes</p>
        <div class="flex flex-wrap gap-1 font-mono text-xs">
          {#each Array.from({ length: 20 }) as _, i (i)}
            <span
              class="inline-flex items-center justify-center rounded border-2 border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-600 ring-2 ring-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {i}
            </span>
          {/each}
        </div>
      </ContentBlock>

      <!-- Step 2 -->
      <ContentBlock className="mb-6 p-5">
        <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Step 2 — Fisher-Yates Shuffle
        </p>
        <p class="mb-3 text-gray-700 dark:text-gray-300">
          Extract {slice} random index{slice > 1 ? 'es' : ''} from array using fisher-yates
        </p>
        <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
          Indexes needed per difficulty:
          <span class="mt-1 flex flex-wrap gap-1.5">
            {#each Object.entries(CHICKEN_DIFFICULTY_TO_SLICE) as [difficulty, sliceVal], n (n)}
              <span
                class={[
                  'inline-block rounded px-2 py-0.5 text-xs font-medium',
                  difficulty === seed.difficulty
                    ? BG_COLOR + ' text-white dark:text-white'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                ]}>{difficulty} — {sliceVal}</span
              >
            {/each}
          </span>
        </p>
        <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
          Chicken payline has <HighlightText>20 - ({slice} - 1) = {20 - (slice - 1)}</HighlightText>
          multipliers. Max multiplier requires the minimum {slice > 1
            ? `of the ${slice} random indexes`
            : 'index'} to be
          <HighlightText>{maxIndex}</HighlightText>.
        </p>
      </ContentBlock>

      <!-- Step 2 sub-steps -->
      <ContentBlock className="mb-6 p-5 overflow-visible">
        {#if seed.difficulty !== 'easy'}
          <ResultTabs
            {seed}
            {items}
            bind:resultIndex
            tabWidthClass="w-12"
            tabClassModifier={(n) =>
              'rounded border-2 border-gray-300 bg-gray-100 p-1.5 text-gray-500 opacity-70 ' +
              'hover:border-purple-300 hover:opacity-80 ring-2 ring-transparent ' +
              'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 !outline-none'}
            tabSelectedClassModifier={(n) =>
              'rounded border-2 border-purple-500 bg-purple-100 font-bold text-purple-700 opacity-100 ' +
              'shadow-lg ring-2 ring-purple-400 z-10 ' +
              'dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400 !outline-none'}
          />
        {/if}
        <FloatGenerationStep
          stepNumber={2.1}
          {resultIndex}
          {seed}
          float={item.float}
          contentBlockClassName="py-6"
        />
        <ChickenMultiplierStep
          stepNumber={2.2}
          {resultIndex}
          {...item}
          contentBlockClassName="py-6"
        />
      </ContentBlock>

      <!-- Step 3 -->
      <ContentBlock className="mb-6 p-5">
        <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Step 3 — Max Payout Index
        </p>
        <p class="mb-1 text-gray-700 dark:text-gray-300">
          Max payout index = minimum of random indexes
        </p>
        <p class="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Refer to the result below — the payline index is shown above each multiplier
        </p>
        <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Random Indexes
        </p>
        <div class="mb-4 flex flex-wrap gap-1 font-mono text-xs">
          {#each items.map((i) => i.chosen) as v (v)}
            <span
              class="inline-flex items-center justify-center rounded border-2 border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-600 ring-2 ring-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {v}
            </span>
          {/each}
        </div>
        <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">Result</p>
        <div class="flex items-center gap-2 font-mono text-xs">
          <span class="text-gray-500 dark:text-gray-400">maxPayoutIndex =</span>
          <span
            class="rounded border-2 border-green-500 bg-green-50 px-3 py-1.5 font-bold text-green-800 ring-2 ring-green-400 dark:border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500"
          >
            {payoutIndex}
          </span>
        </div>
      </ContentBlock>
    {/if}
  </div>
</div>
