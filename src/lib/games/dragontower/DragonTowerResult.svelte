<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { DragonTowerDifficulty, DragonTowerSeed } from '$lib/types';
  import { BG_COLOR, BG_COLOR_GRAY, DRAGON_TOWER_LEVEL_MAP } from '$lib/constants';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import eggIcon from '$lib/assets/dragontower/icons/egg-100x100-white.png';
  import skullIcon from '$lib/assets/dragontower/icons/skull-100x100-white.png';
  import Indicator from '$lib/games/Indicator.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<DragonTowerSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as DragonTowerDifficulty
  });

  const config = $derived(DRAGON_TOWER_LEVEL_MAP[seed.difficulty]);

  const colClass: Record<DragonTowerDifficulty, string> = {
    easy: 'grid-cols-4',
    medium: 'grid-cols-3',
    hard: 'grid-cols-2',
    expert: 'grid-cols-3',
    master: 'grid-cols-4'
  };

  const resultsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const results: number[][] = [];
        for (let i = 0; i < 9; i++) {
          const allIndexes = Array.from({ length: config.size }).map((_v, i) => i);
          const eggIndexes = fisherYates(floatGenerator, allIndexes, config.count).map(
            (item) => item.chosen
          );
          results.unshift(eggIndexes);
        }
        return results;
      },
      350
    )
  );
</script>

{#if resultsDebounced.debouncing}
  <Loader />
{:else}
  {@const results = resultsDebounced.value!}

  <p data-testid="dragontower-result" class="hidden text-center text-base">
    {JSON.stringify(results)}
  </p>

  <div>
    {#each results as eggs, n (n)}
      <div class="flex gap-1">
        <div
          class="flex h-10 w-10 items-center justify-center bg-gray-300 sm:w-16 dark:bg-gray-700"
        >
          {9 - n}
        </div>
        <div class="flex-1">
          <div class={['grid gap-1', colClass[seed.difficulty]]}>
            {#each [...Array(config.size).keys()] as i (i)}
              {@const isEgg = eggs.includes!(i)}
              <div
                class={['relative mb-1 flex h-10 justify-center', isEgg ? BG_COLOR_GRAY : BG_COLOR]}
              >
                {#if isEgg}
                  <Indicator
                    text={i}
                    bgColorClass={isEgg ? 'bg-gray-500 dark:bg-gray-700 text-white' : ''}
                  />
                {/if}

                <img
                  class="relative scale-80 object-scale-down"
                  src={isEgg ? eggIcon : skullIcon}
                  alt={isEgg ? 'egg' : 'skull'}
                />
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
