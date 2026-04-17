import { FloatGenerator } from '$lib/domain/crypto/float-generator';
import type { Seed } from '$lib/types';

/**
 * Generates a FloatGenerator from seed
 *
 * Most games use float generation as the basis for their random outcomes.
 * This composable wraps the FloatGenerator creation for easier use in composables.
 *
 * @param seed - The reactive seed
 * @returns Float generator instance
 *
 * @example
 * ```typescript
 * const floatGen = useFloatGeneration(seed);
 * const float = floatGen.next().value;
 * ```
 */
export function useFloatGeneration(seed: Seed) {
  const floatGenerator = $derived(FloatGenerator(seed));
  return {
    get floatGenerator() {
      return floatGenerator;
    }
  };
}
