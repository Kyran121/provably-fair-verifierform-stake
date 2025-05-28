import { CardSuit, type Card } from '$lib/types';

export function generateCardDeck(): Card[] {
  const cards: Card[] = [];
  const suits = [CardSuit.DIAMOND, CardSuit.HEART, CardSuit.SPADE, CardSuit.CLUB];
  for (let value = 2; value <= 10; value++) {
    for (const suit of suits) {
      cards.push({ suit, value: '' + value });
    }
  }
  const high = ['J', 'Q', 'K', 'A'];
  for (const value of high) {
    for (const suit of suits) {
      cards.push({ suit, value });
    }
  }
  return cards;
}
