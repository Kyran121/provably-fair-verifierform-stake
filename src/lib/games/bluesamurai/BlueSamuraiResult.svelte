<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import { BlueSamuraiRetriggerType, type Seed } from '$lib/types';
  import { simulateRounds } from '$lib/util/bluesamurai';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import BlueSamuraiBoard from '$lib/games/bluesamurai/BlueSamuraiBoard.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import {
    BTN_BG_COLOR,
    BTN_BG_COLOR_BLUE,
    BTN_BG_COLOR_BLUE_SELECTED,
    BTN_BG_COLOR_GREEN,
    BTN_BG_COLOR_GREEN_SELECTED,
    BTN_BG_COLOR_RED,
    BTN_BG_COLOR_RED_SELECTED,
    BTN_BG_COLOR_SELECTED
  } from '$lib/constants';

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
        <span class="inline-block h-3 w-3 rounded-full {BTN_BG_COLOR}"></span>
        <span>Bonus Spin</span>
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full {BTN_BG_COLOR_GREEN}"></span>
        <span>Bonus Trigger <span class="text-xs sm:text-sm">(+10 spins)</span></span>
      </span>
    </div>

    <div class="mb-5 flex justify-center text-sm sm:text-base">
      <span class="mr-3 inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full {BTN_BG_COLOR_BLUE}"></span>
        <span>Special Round</span>
      </span>
      <span class="inline-flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full {BTN_BG_COLOR_RED}"></span>
        <span>Special Round Trigger <span class="text-xs sm:text-sm">(+5 spins)</span></span>
      </span>
    </div>

    <ResultTabs
      {seed}
      items={allRounds.map((_, i) => ({ chosen: i + 1 }))}
      tabNameModifier={(v) => `spin<br>${v}`}
      tabSelectedClassModifier={(n) =>
        allRounds[n].retrigger && allRounds[n].retriggerType === BlueSamuraiRetriggerType.SPECIAL
          ? BTN_BG_COLOR_RED_SELECTED
          : !allRounds[n].retrigger && !allRounds[n].retriggerType && allRounds[n].specialRound
            ? BTN_BG_COLOR_BLUE_SELECTED
            : allRounds[n].retrigger &&
                allRounds[n].retriggerType === BlueSamuraiRetriggerType.BONUS
              ? BTN_BG_COLOR_GREEN_SELECTED
              : BTN_BG_COLOR_SELECTED}
      tabClassModifier={(n) =>
        allRounds[n].retrigger && allRounds[n].retriggerType === BlueSamuraiRetriggerType.SPECIAL
          ? BTN_BG_COLOR_RED
          : !allRounds[n].retrigger && !allRounds[n].retriggerType && allRounds[n].specialRound
            ? BTN_BG_COLOR_BLUE
            : allRounds[n].retrigger &&
                allRounds[n].retriggerType === BlueSamuraiRetriggerType.BONUS
              ? BTN_BG_COLOR_GREEN
              : BTN_BG_COLOR}
      bind:resultIndex={slotRound}
    />
  {:else}
    <p class="mb-3 text-center text-base">Single Spin</p>
  {/if}

  <BlueSamuraiBoard {round} />
{/if}
