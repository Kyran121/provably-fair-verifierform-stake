import { generateCardDeck } from '$lib/util/cards';
import type { Card } from '$lib/types';

/** Fisher-Yates display helper for card decks */
export function useFisherYatesCardsDisplay(chosenIndexes: number[]) {
  const result = $derived.by(() => {
    const deck = generateCardDeck();
    const previousCards = chosenIndexes.slice(0, -1).map((i) => deck.splice(i, 1)[0]);
    return { previousCards, remainingCards: deck };
  });

  return {
    get previousCards() {
      return result.previousCards;
    },
    get remainingCards() {
      return result.remainingCards;
    }
  };
}
