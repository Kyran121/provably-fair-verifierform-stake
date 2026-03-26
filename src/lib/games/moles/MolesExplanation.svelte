<script lang="ts">
  import type { MolesSeed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import MolesResultStep from '$lib/games/moles/MolesResultStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import { BG_COLOR } from '$lib/constants';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let selectedRound = $state(0);
  let resultIndex = $state(0);

  let seed = $derived<MolesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    molesCount: formValues.molesCount as number
  });

  const roundsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const maxRounds = seed.molesCount === 1 ? 8 : 9;
        const rounds = [];

        for (let round = 0; round < maxRounds; round++) {
          // Each round uses molesCount floats, each float uses 4 bytes
          const cursor = round * seed.molesCount * 4;
          const floatGenerator = FloatGenerator({
            ...seed,
            cursor
          });

          const holes = Array.from({ length: 7 }).map((_v, i) => i);
          const fisherYateItems = fisherYates(floatGenerator, holes, seed.molesCount);

          rounds.push(fisherYateItems);
        }

        return rounds;
      },
      350
    )
  );

  // Reset result index when round changes
  $effect(() => {
    selectedRound; // Track selectedRound changes
    resultIndex = 0;
  });

  // Reset selected round when seed changes
  $effect(() => {
    if (roundsDebounced.value) {
      selectedRound = 0;
    }
  });
</script>

<div class="mt-7 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if roundsDebounced.debouncing}
      <Loader />
    {:else}
      {@const rounds = roundsDebounced.value!}
      {@const items = rounds[selectedRound]}

      <ContentBlock className="mb-7 p-2 text-center text-base text-gray-900 dark:text-white">
        <p>
          Each round generates {seed.molesCount} mole{seed.molesCount > 1 ? 's' : ''} using Fisher-Yates
          shuffle. Select a round below, then click a mole to see how it was generated using Stake's
          provably fair algorithm.
        </p>
      </ContentBlock>

      <!-- Round selection buttons -->
      <div class="mb-7 flex flex-wrap justify-center gap-2">
        {#each rounds as _, roundIndex}
          <button
            type="button"
            class={[
              'rounded px-3 py-2 text-sm font-medium transition-colors md:px-4 md:text-base',
              selectedRound === roundIndex
                ? BG_COLOR
                : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
            ]}
            onclick={() => (selectedRound = roundIndex)}
          >
            {roundIndex + 1}
          </button>
        {/each}
      </div>

      <ResultTabs {seed} {items} bind:resultIndex />

      {@const selectedItem = items[resultIndex]}
      {@const globalResultIndex = selectedRound * seed.molesCount + resultIndex}

      <FloatGenerationStep
        stepNumber={1}
        resultIndex={globalResultIndex}
        {seed}
        float={selectedItem.float}
      />
      <MolesResultStep stepNumber={2} {resultIndex} {...selectedItem} />
    {/if}
  </div>
</div>
