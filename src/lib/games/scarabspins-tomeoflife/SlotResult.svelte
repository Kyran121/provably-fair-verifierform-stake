<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { ScarabSpinsTomeOfLifeIcon, Seed } from '$lib/types';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import { simulateRounds } from '$lib/util/scarabspins-tomeoflife';
  import SlotBoard from '$lib/games/scarabspins-tomeoflife/SlotBoard.svelte';
  import { type Component } from 'svelte';
  import Loader from '$lib/games/Loader.svelte';

  const {
    formValues,
    IconComponent
  }: {
    formValues: Record<string, unknown>;
    IconComponent: Component<{ icon: ScarabSpinsTomeOfLifeIcon }>;
  } = $props();

  let slotRound = $state(0);

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const allRoundsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return simulateRounds(floatGenerator);
      },
      350
    )
  );
</script>

{#if allRoundsDebounced.debouncing}
  <Loader />
{:else}
  {@const allRounds = allRoundsDebounced.value!}
  {@const round = allRounds[slotRound]}
  {@const spinCount = allRounds.length}
  {@const bonusRound = spinCount > 1}

  <p data-testid="slots-result" class="hidden text-center text-base">
    {JSON.stringify(allRounds)}
  </p>

  {#if bonusRound}
    <p class="mb-1 text-center text-base">Bonus ({spinCount - 1} additional spins)</p>

    <div class="mb-3 flex justify-center">
      <span class="mr-3 inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-blue-500"></span>
        <span>Bonus Spin</span>
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-green-500"></span>
        <span>Bonus Trigger <span class="text-xs sm:text-sm">(+15 spins)</span></span>
      </span>
    </div>

    <ResultTabs
      {seed}
      items={allRounds.map((_, i) => ({ chosen: i + 1 }))}
      tabNameModifier={(v) => `spin<br>${v}`}
      tabSelectedClassModifier={(n) => (!allRounds[n].retrigger ? 'bg-blue-950' : 'bg-green-800')}
      tabClassModifier={(n) =>
        !allRounds[n].retrigger
          ? 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'}
      bind:resultIndex={slotRound}
    />
  {:else}
    <p class="mb-3 text-center text-base">Single Spin</p>
  {/if}

  <SlotBoard {round} roundIndex={slotRound} {IconComponent} />
{/if}
