<script lang="ts">
  import { useBlueSamuraiRounds } from '$lib/composables';
  import BlueSamuraiStep1 from '$lib/games/bluesamurai/components/BlueSamuraiStep1.svelte';
  import BlueSamuraiStep2 from '$lib/games/bluesamurai/components/BlueSamuraiStep2.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';
  import { buildFlatItems, buildBoardColumns } from '$lib/util/bluesamurai';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let selectedRoundIndex = $state(0);
  let selectedSymbolIndex = $state(0);

  const blueSamurai = useBlueSamuraiRounds(() => formValues);

  const flatItems = $derived(blueSamurai.rounds ? buildFlatItems(blueSamurai.rounds) : []);
  const selectedRound = $derived(blueSamurai.rounds?.[selectedRoundIndex]);
  const selectedSymbol = $derived(selectedRound?.symbols[selectedSymbolIndex]);
  const boardColumns = $derived(selectedRound ? buildBoardColumns(selectedRound, flatItems) : []);

  const resultIndex = $derived.by(() => {
    if (!selectedRound || !selectedSymbol) return 0;
    return flatItems.findIndex(
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

  // Clamp selectedSymbolIndex to a valid float-having symbol when the round changes
  $effect(() => {
    if (!selectedRound) return;
    const sym = selectedRound.symbols[selectedSymbolIndex];
    if (!sym?.float) {
      const first = selectedRound.symbols.find((s) => s.float);
      if (first) selectedSymbolIndex = first.index;
    }
  });

  // Reset to first round / first symbol when seed results change
  $effect(() => {
    if (blueSamurai.rounds) {
      selectedRoundIndex = 0;      selectedSymbolIndex = 0;
    }
  });
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if blueSamurai.isCalculating || !blueSamurai.rounds}
      <Loader />
    {:else}
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

      {#if selectedRound && selectedSymbol}
        {@const float = selectedSymbol.float!}

        <BlueSamuraiStep1
          rounds={blueSamurai.rounds}
          {selectedRoundIndex}
          {selectedSymbolIndex}
          {boardColumns}
          {isLockedSamurai}
          {float}
          {resultIndex}
          seed={blueSamurai.seed}
          onRoundChange={(i) => (selectedRoundIndex = i)}
          onSymbolSelect={(i) => (selectedSymbolIndex = i)}
        />

        <BlueSamuraiStep2 {float} reelType={selectedSymbol.reelType} {isLockedSamurai} />
      {/if}
    {/if}
  </div>
</div>
