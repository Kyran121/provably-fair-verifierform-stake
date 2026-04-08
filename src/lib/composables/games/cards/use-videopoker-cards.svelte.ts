import { FloatGenerator } from '$lib/generator/FloatGenerator';
import { debouncer } from '$lib/debounce.svelte';
import { fisherYates } from '$lib/util/fisherYates';
import { generateCardDeck } from '$lib/util/cards';
import type { FisherYatesItem } from '$lib/types';

/** Video poker cards composable - uses Fisher-Yates to select 10 cards, preserving floats */
export function useVideoPokerCards(getFormValues: () => Record<string, unknown>) {
  const seed = $derived({
    clientSeed: getFormValues().clientseed as string,
    serverSeed: getFormValues().serverseed as string,
    nonce: getFormValues().nonce as number
  });

  const result = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const deck = generateCardDeck();
        return fisherYates(floatGenerator, deck, 10) as FisherYatesItem<
          ReturnType<typeof generateCardDeck>[number]
        >[];
      },
      350
    )
  );

  return {
    get seed() {
      return seed;
    },
    get items() {
      return result.value;
    },
    get isCalculating() {
      return result.debouncing;
    }
  };
}
