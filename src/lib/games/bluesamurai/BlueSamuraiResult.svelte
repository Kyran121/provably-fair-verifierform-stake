<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import { BlueSamuraiRetriggerType, type Seed } from '$lib/types';
  import { simulateRounds } from '$lib/util/bluesamurai';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import BlueSamuraiBoard from '$lib/games/bluesamurai/BlueSamuraiBoard.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let slotRound = $state(0);

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const roundsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const allRounds = simulateRounds(floatGenerator);
        console.log(allRounds);
        return allRounds;
      },
      350
    )
  );
</script>

{#if roundsDebounced.debouncing}
  <Loader />
{:else}
  {@const allRounds = roundsDebounced.value!}
  {@const round = allRounds[slotRound]}
  {@const spinCount = allRounds.length}
  {@const bonusRound = spinCount > 1}

  <p data-testid="bluesamurai-result" class="hidden text-center text-base">
    {JSON.stringify(allRounds)}
  </p>

  {#if bonusRound}
    <p class="mb-1 text-center text-base">Bonus ({spinCount - 1} additional spins)</p>

    <div class="mt-3 mb-1 flex justify-center text-sm sm:text-base">
      <span class="mr-3 inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
        <span>Bonus Spin</span>
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-green-500"></span>
        <span>Bonus Trigger <span class="text-xs sm:text-sm">(+10 spins)</span></span>
      </span>
    </div>

    <div class="mb-5 flex justify-center text-sm sm:text-base">
      <span class="mr-3 inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-purple-500"></span>
        <span>Special Round</span>
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-red-500"></span>
        <span>Special Round Trigger <span class="text-xs sm:text-sm">(+5 spins)</span></span>
      </span>
    </div>

    <ResultTabs
      {seed}
      items={allRounds.map((_, i) => ({ chosen: i + 1 }))}
      tabNameModifier={(v) => `spin<br>${v}`}
      tabSelectedClassModifier={(n) =>
        allRounds[n].retrigger && allRounds[n].retriggerType === BlueSamuraiRetriggerType.SPECIAL
          ? 'bg-red-900'
          : !allRounds[n].retrigger && !allRounds[n].retriggerType && allRounds[n].specialRound
            ? 'bg-purple-950'
            : allRounds[n].retrigger &&
                allRounds[n].retriggerType === BlueSamuraiRetriggerType.BONUS
              ? 'bg-green-900'
              : 'bg-blue-950'}
      tabClassModifier={(n) =>
        allRounds[n].retrigger && allRounds[n].retriggerType === BlueSamuraiRetriggerType.SPECIAL
          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-800'
          : !allRounds[n].retrigger && !allRounds[n].retriggerType && allRounds[n].specialRound
            ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800'
            : allRounds[n].retrigger &&
                allRounds[n].retriggerType === BlueSamuraiRetriggerType.BONUS
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
              : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}
      bind:resultIndex={slotRound}
    />
  {:else}
    <p class="mb-3 text-center text-base">Single Spin</p>
  {/if}

  <BlueSamuraiBoard {round} />
{/if}
