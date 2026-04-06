<script lang="ts">
  import {
    BG_COLOR,
    BTN_BG_COLOR,
    BTN_BG_COLOR_GRAY,
    BTN_BG_COLOR_GRAY_SELECTED,
    BTN_BG_COLOR_SELECTED,
    DRAGON_TOWER_LEVEL_MAP
  } from '$lib/config';
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { DragonTowerDifficulty, DragonTowerSeed, FisherYatesItem } from '$lib/types';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import DragonTowerResultStep from '$lib/games/dragontower/DragonTowerResultStep.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  const seed = $derived<DragonTowerSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as DragonTowerDifficulty
  });

  const config = $derived(DRAGON_TOWER_LEVEL_MAP[seed.difficulty]);

  const fisherYateItemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const results: FisherYatesItem<number>[] = [];
        for (let i = 0; i < 9; i++) {
          const allIndexes = Array.from({ length: config.size }).map((_v, i) => i);
          const eggIndexes = fisherYates(floatGenerator, allIndexes, config.count);
          results.push(...eggIndexes);
        }
        return results;
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

      <ContentBlock className="mb-7 p-2 pb-4 text-center text-base text-gray-900 dark:text-white">
        <p class="text-lg">Note</p>
        <p class="mb-4 text-sm">
          For each of the 9 rows, starting from the first row, we use the Fisher-Yates algorithm to
          determine the positions of the eggs.
        </p>
        <p class="bold border-t-1 border-gray-400 pt-3 text-base">Example</p>

        <p class="text-sm">
          For the easy difficulty, we start with an array of 4 indexes (i.e. <span class="font-mono"
            >[0, 1, 2, 3]</span
          >) representing the squares on the row. We then generate 3 floats, which are used to
          select 3 unique egg positions. This process is repeated for each of the remaining 8 rows.
          A demonstration of this is shown below.
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        {items}
        bind:resultIndex
        tabNameModifier={(chosen, n) => `row ${Math.floor(n / config.count) + 1}<br>${chosen}`}
        tabSelectedClassModifier={(n) =>
          Math.floor(n / config.count) % 2 === 0
            ? BTN_BG_COLOR_SELECTED
            : BTN_BG_COLOR_GRAY_SELECTED}
        tabClassModifier={(n) =>
          Math.floor(n / config.count) % 2 === 0 ? BTN_BG_COLOR : BTN_BG_COLOR_GRAY}
      />

      {@const item = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={item.float} />
      <DragonTowerResultStep stepNumber={2} {resultIndex} {config} {...item} />
    {/if}
  </div>
</div>
