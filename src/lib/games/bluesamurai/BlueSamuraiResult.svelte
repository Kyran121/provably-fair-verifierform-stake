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

  const BASE_UNSELECTED =
    'rounded border-2 p-1.5 opacity-70 ring-2 ring-transparent hover:opacity-80 !outline-none ';
  const BASE_SELECTED =
    'rounded border-2 p-1.5 font-bold opacity-100 shadow-lg ring-2 z-10 !outline-none ';

  function tabClass(n: number, rounds: ReturnType<typeof simulateRounds>) {
    const r = rounds[n];
    if (r.retrigger && r.retriggerType === BlueSamuraiRetriggerType.SPECIAL)
      return (
        BASE_UNSELECTED +
        'border-red-300 bg-gray-100 text-gray-500 hover:border-red-400 dark:border-red-700 dark:bg-gray-800 dark:text-gray-400'
      );
    if (!r.retrigger && !r.retriggerType && r.specialRound)
      return (
        BASE_UNSELECTED +
        'border-blue-300 bg-gray-100 text-gray-500 hover:border-blue-400 dark:border-blue-700 dark:bg-gray-800 dark:text-gray-400'
      );
    if (r.retrigger && r.retriggerType === BlueSamuraiRetriggerType.BONUS)
      return (
        BASE_UNSELECTED +
        'border-green-300 bg-gray-100 text-gray-500 hover:border-green-400 dark:border-green-700 dark:bg-gray-800 dark:text-gray-400'
      );
    return (
      BASE_UNSELECTED +
      'border-gray-300 bg-gray-100 text-gray-500 hover:border-purple-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
    );
  }

  function tabSelectedClass(n: number, rounds: ReturnType<typeof simulateRounds>) {
    const r = rounds[n];
    if (r.retrigger && r.retriggerType === BlueSamuraiRetriggerType.SPECIAL)
      return (
        BASE_SELECTED +
        'border-red-500 bg-red-100 text-red-700 ring-red-400 dark:border-red-400 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400'
      );
    if (!r.retrigger && !r.retriggerType && r.specialRound)
      return (
        BASE_SELECTED +
        'border-blue-500 bg-blue-100 text-blue-700 ring-blue-400 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400'
      );
    if (r.retrigger && r.retriggerType === BlueSamuraiRetriggerType.BONUS)
      return (
        BASE_SELECTED +
        'border-green-500 bg-green-100 text-green-700 ring-green-400 dark:border-green-400 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400'
      );
    return (
      BASE_SELECTED +
      'border-purple-500 bg-purple-100 text-purple-700 ring-purple-400 dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400'
    );
  }
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
    <p class="mb-4 text-center text-base font-medium">Bonus ({spinCount - 1} additional spins)</p>

    <!-- Legend -->
    <div class="mb-4 flex flex-wrap justify-center gap-2 text-xs">
      <span
        class="inline-flex items-center gap-1.5 rounded border-2 border-purple-300 bg-purple-50 px-2 py-1 text-purple-700 dark:border-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      >
        <span
          class="inline-block h-2.5 w-2.5 rounded-sm border border-purple-500 bg-purple-200 dark:bg-purple-700"
        ></span>
        Bonus Spin
      </span>
      <span
        class="inline-flex items-center gap-1.5 rounded border-2 border-green-300 bg-green-50 px-2 py-1 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400"
      >
        <span
          class="inline-block h-2.5 w-2.5 rounded-sm border border-green-500 bg-green-200 dark:bg-green-700"
        ></span>
        Bonus Trigger <span class="opacity-70">(+10 spins)</span>
      </span>
      <span
        class="inline-flex items-center gap-1.5 rounded border-2 border-blue-300 bg-blue-50 px-2 py-1 text-blue-700 dark:border-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      >
        <span
          class="inline-block h-2.5 w-2.5 rounded-sm border border-blue-500 bg-blue-200 dark:bg-blue-700"
        ></span>
        Special Round
      </span>
      <span
        class="inline-flex items-center gap-1.5 rounded border-2 border-red-300 bg-red-50 px-2 py-1 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400"
      >
        <span
          class="inline-block h-2.5 w-2.5 rounded-sm border border-red-500 bg-red-200 dark:bg-red-700"
        ></span>
        Special Round Trigger <span class="opacity-70">(+5 spins)</span>
      </span>
    </div>

    <ResultTabs
      {seed}
      items={allRounds.map((_, i) => ({ chosen: i + 1 }))}
      tabNameModifier={(v) => `spin<br>${v}`}
      tabSelectedClassModifier={(n) => tabSelectedClass(n, allRounds)}
      tabClassModifier={(n) => tabClass(n, allRounds)}
      bind:resultIndex={slotRound}
    />
  {:else}
    <p class="mb-3 text-center text-base">Single Spin</p>
  {/if}

  <BlueSamuraiBoard {round} />
{/if}
