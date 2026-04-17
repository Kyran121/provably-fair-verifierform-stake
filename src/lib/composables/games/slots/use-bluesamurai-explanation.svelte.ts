import { buildFlatItems, buildBoardColumns } from '$lib/domain/games/bluesamurai';
import type { BlueSamuraiRound } from '$lib/types';

/** Blue Samurai explanation state management */
export function useBlueSamuraiExplanation(rounds: BlueSamuraiRound[] | null) {
  let selectedRoundIndex = $state(0);
  let selectedSymbolIndex = $state(0);

  const flatItems = $derived(rounds ? buildFlatItems(rounds) : []);
  const selectedRound = $derived(rounds?.[selectedRoundIndex]);
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
    if (rounds) {
      selectedRoundIndex = 0;
      selectedSymbolIndex = 0;
    }
  });

  return {
    get selectedRoundIndex() {
      return selectedRoundIndex;
    },
    set selectedRoundIndex(value: number) {
      selectedRoundIndex = value;
    },
    get selectedSymbolIndex() {
      return selectedSymbolIndex;
    },
    set selectedSymbolIndex(value: number) {
      selectedSymbolIndex = value;
    },
    get flatItems() {
      return flatItems;
    },
    get selectedRound() {
      return selectedRound;
    },
    get selectedSymbol() {
      return selectedSymbol;
    },
    get boardColumns() {
      return boardColumns;
    },
    get resultIndex() {
      return resultIndex;
    },
    get isLockedSamurai() {
      return isLockedSamurai;
    }
  };
}
