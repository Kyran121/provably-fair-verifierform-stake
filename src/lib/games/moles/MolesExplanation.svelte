<script lang="ts">
  import type { MolesSeed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import MolesResultStep from '$lib/games/moles/MolesResultStep.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  // flat index across all rounds
  let flatIndex = $state(0);

  let seed = $derived<MolesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    molesCount: formValues.molescount as number
  });

  const roundsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const maxRounds = seed.molesCount === 1 ? 8 : 9;
        const rounds = [];

        for (let round = 0; round < maxRounds; round++) {
          const cursor = round * seed.molesCount * 4;
          const floatGenerator = FloatGenerator({ ...seed, cursor });
          const holes = Array.from({ length: 7 }).map((_v, i) => i);
          const fisherYateItems = fisherYates(floatGenerator, holes, seed.molesCount);
          rounds.push(fisherYateItems);
        }

        return rounds;
      },
      350
    )
  );

  // Flat list of all moles across all rounds
  const flatItems = $derived.by(() => {
    const rounds = roundsDebounced.value;
    if (!rounds) return [];
    return rounds.flatMap((items, roundIndex) =>
      items.map((item, moleIndex) => ({ ...item, roundIndex, moleIndex }))
    );
  });

  // Derive selected round + mole index from flat index
  const selectedRound = $derived(flatItems[flatIndex]?.roundIndex ?? 0);
  const resultIndex = $derived(flatItems[flatIndex]?.moleIndex ?? 0);
  const globalResultIndex = $derived(flatIndex);

  // Reset flat index when seed changes
  $effect(() => {
    if (roundsDebounced.value) {
      flatIndex = 0;
    }
  });
</script>

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if roundsDebounced.debouncing}
      <Loader />
    {:else}
      {@const rounds = roundsDebounced.value!}
      {@const items = rounds[selectedRound]}

      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400"
            >Each round generates {seed.molesCount} mole{seed.molesCount > 1 ? 's' : ''} using Fisher-Yates
            shuffle.</span
          >
          Click a mole tab to see how it was generated using Stake's provably fair algorithm.
        </p>
      </ContentBlock>

      <!-- Flat grouped tab strip -->
      <div class="mb-7 overflow-x-auto overflow-y-visible" style="padding: 4px 6px 0 4px;">
        <div class="flex gap-4 pb-5" style="min-width: max-content;">
          {#each roundsDebounced.value! as roundItems, roundIndex}
            <div class="flex flex-col gap-1">
              <span
                class="mb-1 text-center font-sans text-xs font-semibold text-gray-500 dark:text-gray-400"
              >
                R{roundIndex + 1}
              </span>
              <div class="flex gap-1.5">
                {#each roundItems as item, moleIndex}
                  {@const fi = roundIndex * seed.molesCount + moleIndex}
                  <button
                    type="button"
                    class={[
                      'flex w-10 flex-col items-center justify-center overflow-visible rounded border p-1.5 text-sm font-medium transition-all',
                      fi === flatIndex
                        ? 'z-10 border-purple-500 bg-purple-100 font-bold text-purple-700 opacity-100 shadow-lg !ring-2 ring-purple-500 dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400'
                        : 'border-gray-400 bg-gray-100 text-gray-500 opacity-70 hover:border-purple-300 hover:text-purple-700 hover:opacity-80 hover:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    ]}
                    onclick={() => (flatIndex = fi)}
                  >
                    <span class="block text-[10px]">({moleIndex + 1})</span>
                    <span class="block font-bold">{item.chosen}</span>
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>

      {@const selectedItem = flatItems[flatIndex]}

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
