<script lang="ts">
  import { debouncer } from '$lib/debounce.svelte';
  import {
    BlueSamuraiIcon as BlueSamuraiIconT,
    BlueSamuraiRetriggerType,
    type Seed
  } from '$lib/types';
  import BlueSamuraiFloatToSymbolTable from '$lib/games/bluesamurai/BlueSamuraiFloatToSymbolTable.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { simulateRounds } from '$lib/util/bluesamurai';
  import Loader from '$lib/games/Loader.svelte';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import BlueSamuraiIcon from '$lib/games/bluesamurai/BlueSamuraiIcon.svelte';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/config';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  // selectedRound is 0-based index into allRounds
  // selectedSymbolIndex is the symbol.index (0–17) within that round
  let selectedRoundIndex = $state(0);
  let selectedSymbolIndex = $state(0);

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
        return simulateRounds(floatGenerator);
      },
      350
    )
  );

  type ItemWithSymbol = ReturnType<typeof simulateRounds>[number] & {
    symbol: ReturnType<typeof simulateRounds>[number]['symbols'][number];
  };

  // Flat items list (symbols with floats across all rounds), used for resultIndex passed to FloatGenerationStep
  const items = $derived.by(() => {
    if (!roundsDebounced.value) return [] as ItemWithSymbol[];
    return roundsDebounced.value.flatMap((round) =>
      round.symbols.filter((symbol) => symbol.float).map((symbol) => ({ ...round, symbol }))
    );
  });

  // The currently selected round object
  const selectedRound = $derived(roundsDebounced.value?.[selectedRoundIndex]);

  // Clamp selectedSymbolIndex to a valid float-having symbol when the round changes
  $effect(() => {
    if (!selectedRound) return;
    const sym = selectedRound.symbols[selectedSymbolIndex];
    if (!sym?.float) {
      // Find the first symbol in this round that has a float
      const first = selectedRound.symbols.find((s) => s.float);
      if (first) selectedSymbolIndex = first.index;
    }
  });

  // Reset to first spin / first symbol when seed results change
  $effect(() => {
    if (roundsDebounced.value) {
      selectedRoundIndex = 0;
      selectedSymbolIndex = 0;
    }
  });

  // The currently selected symbol
  const selectedSymbol = $derived(selectedRound?.symbols[selectedSymbolIndex]);

  // Flat resultIndex into items[] for FloatGenerationStep
  const resultIndex = $derived.by(() => {
    if (!selectedRound || !selectedSymbol) return 0;
    return items.findIndex(
      (it) => it.round === selectedRound.round && it.symbol.index === selectedSymbolIndex
    );
  });

  const isLockedSamurai = $derived(
    !!(
      selectedRound?.specialRound &&
      selectedRound.stuckSamurais?.has(selectedSymbolIndex) &&
      !selectedRound.newlyLockedSamurais?.has(selectedSymbolIndex)
    )
  );

  // Board cell layout — mirrors BlueSamuraiBoard reel slicing
  // Returns a 5-column array of symbol arrays: [outerReel1, inner1, inner2, inner3, outerReel2]
  const boardColumns = $derived.by(() => {
    if (!selectedRound)
      return [] as {
        symbolIndex: number;
        floatIndex: number;
        icon: BlueSamuraiIconT;
        hasFloat: boolean;
        locked: boolean;
      }[][];
    const syms = selectedRound.symbols;
    const sr = selectedRound.specialRound;
    const stuck = selectedRound.stuckSamurais;
    const newlyLocked = selectedRound.newlyLockedSamurais;

    // Build a map from symbol.index → global float index across all spins
    const floatIndexMap = new Map<number, number>();
    for (const s of syms) {
      if (s.float) {
        const gi = items.findIndex(
          (it) => it.round === selectedRound.round && it.symbol.index === s.index
        );
        if (gi !== -1) floatIndexMap.set(s.index, gi);
      }
    }

    function col(slice: typeof syms, indexOffset: number, isOuter: boolean) {
      return slice.map((s, i) => ({
        symbolIndex: s.index,
        floatIndex: floatIndexMap.get(s.index) ?? -1,
        icon: sr && stuck?.has(s.index) ? BlueSamuraiIconT.SAMURAI : s.icon,
        hasFloat: !!s.float,
        locked: !!(sr && stuck?.has(s.index) && !newlyLocked?.has(s.index)),
        isOuter: isOuter
      }));
    }

    return [
      col(syms.slice(0, 3), 0, true),
      col(syms.slice(3, 7), 3, false),
      col(syms.slice(7, 11), 7, false),
      col(syms.slice(11, 15), 11, false),
      col(syms.slice(15), 15, true)
    ];
  });

  // Round type helpers
  function getRoundBadgeClass(round: ReturnType<typeof simulateRounds>[number]): string {
    if (round.retrigger && round.retriggerType === BlueSamuraiRetriggerType.SPECIAL)
      return 'border-red-500 bg-red-100 text-red-700 dark:border-red-400 dark:bg-red-900/30 dark:text-red-400';
    if (round.specialRound)
      return 'border-blue-500 bg-blue-100 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400';
    if (round.retrigger && round.retriggerType === BlueSamuraiRetriggerType.BONUS)
      return 'border-green-500 bg-green-100 text-green-700 dark:border-green-400 dark:bg-green-900/30 dark:text-green-400';
    return 'border-purple-500 bg-purple-100 text-purple-700 dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-400';
  }

  function getRoundLabel(round: ReturnType<typeof simulateRounds>[number]): string {
    if (round.specialRound) return `Special Round ${round.specialSpin}/5`;
    if (round.bonusSpin! > 0) return `Bonus Round ${round.bonusSpin}/${round.totalBonusRounds}`;
    return `Spin ${round.round}`;
  }

  function getRoundTriggerBadge(round: ReturnType<typeof simulateRounds>[number]): string | null {
    if (!round.retrigger) return null;
    if (round.retriggerType === BlueSamuraiRetriggerType.SPECIAL)
      return '⚔️ Triggered +5 Special Rounds';
    if (round.retriggerType === BlueSamuraiRetriggerType.BONUS)
      return '⭐ Triggered +10 Bonus Rounds';
    return null;
  }

  // Selected cell ring colour
  function getSelectedRing(round: ReturnType<typeof simulateRounds>[number]): string {
    if (round.retrigger && round.retriggerType === BlueSamuraiRetriggerType.SPECIAL)
      return 'ring-2 ring-red-500 dark:ring-red-400';
    if (round.specialRound) return 'ring-2 ring-blue-500 dark:ring-blue-400';
    if (round.retrigger && round.retriggerType === BlueSamuraiRetriggerType.BONUS)
      return 'ring-2 ring-green-500 dark:ring-green-400';
    return 'ring-2 ring-purple-500 dark:ring-purple-400';
  }
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if roundsDebounced.debouncing}
      <Loader />
    {:else}
      {@const allRounds = roundsDebounced.value!}

      <!-- Header banner -->
      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400"
            >Each reel position is generated from a float.</span
          >
          Special rounds use 12 floats; all other rounds use 18.
        </p>
      </ContentBlock>

      <!-- Need To Know -->
      <ContentBlock className="mb-6 p-5">
        <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Need To Know
        </p>
        <ul class="list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-gray-300">
          <li>
            A bonus game is triggered when 3 or more scatter symbols appear on the inner three
            reels.
          </li>
          <li>
            A special game is triggered when either the left or right outer reel contains only
            samurai symbols.
          </li>
          <li>
            A special game can trigger during a bonus game. It is handled separately and awards 5
            additional spins. Once the special game ends, the remaining bonus spins resume.
          </li>
          <li>
            Every symbol requires a float, except during the 5 special rounds where samurai symbols
            are stuck on the outer reels. Since each outer reel has 3 positions, this results in 30
            fewer floats (3 × 2 × 5).
          </li>
          <li>
            During special rounds, inner reel positions that were locked as Samurai in a previous
            special round still consume a float from the sequence to preserve the provably fair
            chain — but that float is ignored and the symbol is fixed as 🔒 Samurai.
          </li>
        </ul>
      </ContentBlock>

      <!-- Step 1 -->
      {#if selectedRound && selectedSymbol}
        {@const float = selectedSymbol.float!}
        <ContentBlock className="mb-6 p-5 overflow-visible">
          <p class="mb-4 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
            Step 1 — Generate Float
          </p>

          <!-- Spin navigator + grid picker -->
          <div class="mb-5">
            <!-- Spin nav header -->
            <div class="mb-3 flex items-center justify-between gap-2">
              <button
                type="button"
                class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                onclick={() => (selectedRoundIndex = Math.max(0, selectedRoundIndex - 1))}
                disabled={selectedRoundIndex === 0}
                aria-label="Previous spin"
              >
                ‹
              </button>

              <div class="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <!-- Main spin label badge -->
                <span
                  class={[
                    'rounded border-2 px-3 py-1 text-xs font-semibold',
                    getRoundBadgeClass(selectedRound)
                  ]}
                >
                  {getRoundLabel(selectedRound)}
                  <span class="ml-1 opacity-60">({selectedRoundIndex + 1}/{allRounds.length})</span>
                </span>

                <!-- Context badges -->
                {#if selectedRound.retrigger}
                  {@const triggerBadge = getRoundTriggerBadge(selectedRound)}
                  {#if triggerBadge}
                    <span
                      class={[
                        'rounded border-2 px-2.5 py-0.5 text-[10px] font-semibold',
                        selectedRound.retriggerType === BlueSamuraiRetriggerType.SPECIAL
                          ? 'border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400'
                          : 'border-green-400 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-400'
                      ]}
                    >
                      {triggerBadge}
                    </span>
                  {/if}
                {/if}

                {#if selectedRound.specialRound && selectedRound.totalBonusRounds > 0}
                  <span
                    class="rounded border-2 border-amber-400 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-400"
                  >
                    ⏸ Bonus paused at {selectedRound.bonusSpin -
                      1}/{selectedRound.totalBonusRounds}
                  </span>
                {/if}
              </div>

              <button
                type="button"
                class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-500 transition-all hover:border-gray-400 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                onclick={() =>
                  (selectedRoundIndex = Math.min(allRounds.length - 1, selectedRoundIndex + 1))}
                disabled={selectedRoundIndex === allRounds.length - 1}
                aria-label="Next spin"
              >
                ›
              </button>
            </div>

            <!-- Symbol grid picker — 5 columns matching the board reels -->
            <div class="grid grid-cols-5 gap-1">
              {#each boardColumns as col, colIdx}
                <div
                  class={[
                    'flex flex-col gap-1',
                    colIdx === 0 || colIdx === 4 ? 'justify-center' : ''
                  ]}
                >
                  {#each col as cell}
                    {#if cell.hasFloat}
                      {@const isSelected = cell.symbolIndex === selectedSymbolIndex}
                      <button
                        type="button"
                        class={[
                          'relative flex flex-col items-center justify-center rounded p-0.5 transition-all !outline-none',
                          'border',
                          isSelected
                            ? [
                                'border-transparent',
                                getSelectedRing(selectedRound),
                                'z-10 scale-105 bg-white shadow-md dark:bg-gray-700'
                              ]
                            : 'border-gray-200 bg-gray-50 opacity-70 hover:border-gray-400 hover:opacity-90 dark:border-gray-700 dark:bg-gray-800'
                        ]}
                        onclick={() => (selectedSymbolIndex = cell.symbolIndex)}
                        title={cell.locked
                          ? '🔒 Locked — float consumed but symbol is predetermined'
                          : undefined}
                      >
                        <BlueSamuraiIcon icon={cell.icon} />
                        <span
                          class="mt-0.5 mb-2 block text-[11px] leading-none text-gray-400 dark:text-gray-300"
                        >
                          {cell.floatIndex}
                        </span>
                        {#if cell.locked}
                          <span
                            class="pointer-events-none absolute top-0 right-0 text-[8px] leading-none"
                            >🔒</span
                          >
                        {/if}
                      </button>
                    {:else}
                      <!-- No float (outer reel in special round) — non-interactive placeholder -->
                      <div
                        class="flex flex-col items-center justify-center rounded border border-dashed border-gray-200 p-0.5 opacity-30 dark:border-gray-700"
                      >
                        <BlueSamuraiIcon icon={cell.icon} />
                        <span class="mt-0.5 block text-[11px] leading-none text-gray-400">—</span>
                      </div>
                    {/if}
                  {/each}
                </div>
              {/each}
            </div>

            <!-- Column labels: reel names -->
            <div class="mt-1 grid grid-cols-5 gap-1 text-center">
              {#each ['Outer', 'Inner 1', 'Inner 2', 'Inner 3', 'Outer'] as label}
                <span class="text-[11px] text-gray-400 dark:text-gray-400">{label}</span>
              {/each}
            </div>
          </div>

          {#if isLockedSamurai}
            <!-- Locked samurai notice -->
            <div
              class="mt-5 rounded-lg border-2 border-amber-400 bg-amber-50 p-4 dark:border-amber-500 dark:bg-amber-900/20"
            >
              <p class="font-semibold text-amber-700 dark:text-amber-400">
                🔒 Locked Position — Symbol Predetermined
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                This inner reel position was locked as <strong>Samurai</strong> in an earlier
                special round. A float (<span
                  class="font-mono font-semibold text-amber-700 dark:text-amber-400"
                  >{float.toFixed(8)}</span
                >) is still consumed from the sequence to keep the provably fair chain intact, but
                the symbol is fixed regardless of what the float would normally map to.
              </p>
              <p class="mt-2 text-gray-500 dark:text-gray-400">
                The float-to-symbol lookup (Step 2) is shown below for transparency, but its result
                does not affect the game outcome for this position.
              </p>
            </div>
          {:else}
            <div class="mt-5 border-t border-gray-200 pt-5 dark:border-gray-700">
              <FloatGenerationStep
                stepNumber={1.1}
                {resultIndex}
                {seed}
                {float}
                hideStepNumber={true}
                contentBlockClassName="py-6"
              />
            </div>
          {/if}
        </ContentBlock>

        <!-- Step 2 -->
        <ContentBlock className="mb-6 p-5">
          <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
            Step 2 — Float to Symbol
          </p>
          {#if isLockedSamurai}
            <p class="mb-4 text-sm text-amber-700 dark:text-amber-400">
              ⚠️ This position is locked — the float-to-symbol lookup is shown for transparency
              only. The symbol is fixed as 🔒 Samurai regardless of the result below.
            </p>
          {:else}
            <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
              Each symbol has a probability of appearing. These are accumulated left-to-right into a
              <span class="font-semibold">summed</span> value per reel type (<span
                class={TEXT_HIGHLIGHT_COLOR}>{selectedSymbol.reelType}</span
              >
              reel here). The float is matched to the
              <span class="font-semibold">first symbol</span> whose summed value exceeds it — shown in
              the highlighted column below, where the float sits between the previous summed (lower bound)
              and this symbol's summed (upper bound).
            </p>
          {/if}

          <BlueSamuraiFloatToSymbolTable {float} reelType={selectedSymbol.reelType} />
        </ContentBlock>
      {/if}
    {/if}
  </div>
</div>
