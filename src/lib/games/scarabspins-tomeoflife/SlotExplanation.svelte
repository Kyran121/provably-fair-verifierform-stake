<script lang="ts">
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { Seed } from '$lib/types';
  import { simulateRounds } from '$lib/util/scarabspins-tomeoflife';
  import { ScarabSpinsTomeOfLifeIcon } from '$lib/types';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import FloatToReelPositionStep from '$lib/games/scarabspins-tomeoflife/FloatToReelPositionStep.svelte';
  import { type Component } from 'svelte';
  import SymbolOrderSlotBoard from '$lib/games/scarabspins-tomeoflife/SymbolOrderSlotBoard.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import {
    BG_COLOR,
    BG_COLOR_GRAY,
    BTN_BG_COLOR,
    BTN_BG_COLOR_GRAY,
    BTN_BG_COLOR_GRAY_SELECTED,
    BTN_BG_COLOR_SELECTED
  } from '$lib/config';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const {
    formValues,
    IconComponent
  }: {
    formValues: Record<string, unknown>;
    IconComponent: Component<{ icon: ScarabSpinsTomeOfLifeIcon }>;
  } = $props();

  let resultIndex = $state(0);

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const floatsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);

        return simulateRounds(floatGenerator)
          .flatMap((round) => round.centerPositions)
          .map((round) => round.float);
      },
      350
    )
  );
</script>

{#if floatsDebounced.debouncing}
  <Loader />
{:else}
  {@const floats = floatsDebounced.value!}
  {@const float = floats[resultIndex]}

  <ContentBlock className="mt-5 mb-7 p-5 text-center text-base dark:text-white text-black">
    <p class="text-lg">How it works</p>
    <p class="mb-4 text-sm">
      Slot features 5 reels of symbols. The first 4 reels each contain 30 symbols, while the final
      reel contains 41 symbols. The ordering of symbols on each reel can be found in the
      <b>Symbol Ordering</b> section.
    </p>
    <p class="mb-4 text-sm">
      For every round, 5 floats are generated—one for each reel—to determine the central position of
      that reel. This process is explained in detail below.
    </p>
    <p class="text-sm">
      When 3 scatter symbols appear in a round, a <b>bonus round</b> is triggered, awarding
      <b>15 additional spins</b>. If any of these bonus rounds also result in 3 scatters, another 15
      spins are granted—up to a maximum of <b>180 total rounds</b>.
    </p>
  </ContentBlock>

  <p class="text-center text-lg">Float &rarr; Reel Position Process</p>
  <p class="mb-5 text-center text-sm">
    Click a position to see how it was retrieved using the stake provably fair algorithm
  </p>

  <ResultTabs
    {seed}
    items={floats.map((float, n) => ({ chosen: Math.floor(float * (n % 5 === 4 ? 41 : 30)) }))}
    bind:resultIndex
    tabNameModifier={(chosen, n) =>
      `round ${Math.floor(n / 5) + 1}<br>pos<br>${(chosen as number) + 1}`}
    tabSelectedClassModifier={(n) =>
      Math.floor(n / 5) % 2 === 0 ? BTN_BG_COLOR_SELECTED : BTN_BG_COLOR_GRAY_SELECTED}
    tabClassModifier={(n) => (Math.floor(n / 5) % 2 === 0 ? BTN_BG_COLOR : BTN_BG_COLOR_GRAY)}
  />

  <SymbolOrderSlotBoard {floats} {resultIndex} {IconComponent} />

  <FloatGenerationStep stepNumber={1} {resultIndex} {seed} {float} />
  <FloatToReelPositionStep stepNumber={2} {resultIndex} {float} />
{/if}
