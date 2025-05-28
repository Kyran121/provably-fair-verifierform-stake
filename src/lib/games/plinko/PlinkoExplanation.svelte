<script lang="ts">
  import type { Direction, Item, PlinkoSeed, Risk } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import { getDirections, getPayline, getPayout } from '$lib/util/plinko';
  import PlinkoDirectionStep from '$lib/games/plinko/PlinkoDirectionStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  type PayoutExplanation = {
    payline: number[];
    directions: Item<Direction>[];
    payout: number;
  };

  const seed = $derived<PlinkoSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    risk: formValues.risk as Risk,
    rows: formValues.rows as number
  });

  const payoutExplanationDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const directions = getDirections(floatGenerator, seed.rows);
        const payline = getPayline(seed.risk, seed.rows);
        const payout = getPayout(seed.risk, seed.rows, directions);
        return { directions, payline, payout } satisfies PayoutExplanation;
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if payoutExplanationDebounced.debouncing}
      <Loader />
    {:else}
      {@const payoutExplanation = payoutExplanationDebounced.value!}
      {@const directions = payoutExplanation.directions}
      {@const firstDirection = directions[0]}
      {@const selectedDirection = directions[resultIndex]}
      {@const oppositeDirectionEntries = directions.filter(
        (d) => d.chosen !== firstDirection.chosen
      )}
      {@const turnsInOppositeDirection = oppositeDirectionEntries.length}

      <div class="text-center">
        <p class="mb-2 text-xl">Step 1</p>
        <p class="text-base">Extract {seed.rows} directions from seed</p>
      </div>

      <div class="mt-3 border-1 border-gray-400 p-5">
        <p class="mb-7 bg-gray-200 p-2 text-center text-base dark:bg-gray-700">
          {seed.rows} directions drawn in the order shown below. Click a direction to find out how it
          was generated using stake's provably fair algorithm
        </p>

        <ResultTabs {seed} items={directions} bind:resultIndex />

        <FloatGenerationStep
          stepNumber={1.1}
          {resultIndex}
          {seed}
          float={selectedDirection.float}
        />
        <PlinkoDirectionStep stepNumber={1.2} {...selectedDirection} />
      </div>

      <div class="mt-4 text-center">
        <p class="mb-2 text-xl">Step 2</p>
        <p class="text-base">Use directions to calculate payout</p>
      </div>

      <div
        class="mt-5 bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      >
        <p>
          payline = [
          {#each payoutExplanation.payline as multi, n (n)}
            <span
              class="mr-1 mb-1 inline-block border-1 border-gray-400 bg-gray-300 p-1 dark:border-none dark:bg-gray-700"
            >
              {multi}x
            </span>
          {/each}
          ]
        </p>
        <p class="mt-4">
          directions = [
          {#each payoutExplanation.directions as { chosen }, n (n)}
            <span
              class="mr-1 mb-1 inline-block border-1 border-gray-400 bg-gray-300 p-1 dark:border-none dark:bg-gray-700"
            >
              {chosen}
            </span>
          {/each}
          ]
        </p>
        <p class="mt-4">
          firstDirection = <span
            class="mr-1 mb-1 inline-block border-1 border-gray-400 bg-gray-300 p-1 dark:border-none dark:bg-gray-700"
            >{firstDirection.chosen}</span
          >
        </p>
        <p class="mt-4">turnsInOppositeDirection</p>
        <p>
          = count([
          {#each payoutExplanation.directions as { chosen }, n (n)}
            <span
              class={[
                'mr-1 mb-1 inline-block border-1  p-1 dark:border-none',
                chosen !== firstDirection.chosen
                  ? 'bg-blue-300 dark:bg-blue-500'
                  : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
              ]}
            >
              {chosen}
            </span>
          {/each}
          ])
        </p>
        <p>
          = count([
          {#each oppositeDirectionEntries as { chosen }, n (n)}
            <span
              class={[
                'mr-1 mb-1 inline-block border-1  p-1 dark:border-none',
                chosen !== firstDirection.chosen
                  ? 'bg-blue-300 dark:bg-blue-500'
                  : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
              ]}
            >
              {chosen}
            </span>
          {/each}
          ])
        </p>
        <p>= {turnsInOppositeDirection}</p>
        <p class="mt-4">payout</p>
        <p>
          = <span class="font-bold text-blue-500"
            >&lbrace;payline[turnsInOppositeDirection]&rbrace;</span
          >
        </p>
        <p>
          = <span class="font-bold text-blue-500"
            >&lbrace;payline[{turnsInOppositeDirection}]&rbrace;</span
          >
        </p>
        <p>= {payoutExplanation.payout}x</p>
      </div>
    {/if}
  </div>
</div>
