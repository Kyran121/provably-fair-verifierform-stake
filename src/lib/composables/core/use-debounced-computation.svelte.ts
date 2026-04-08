import { debouncer } from '$lib/debounce.svelte';

/**
 * Core composable for debounced reactive computations
 *
 * Wraps the debouncer utility with a cleaner API for composables.
 * This is the foundation for all game composables that need to debounce
 * expensive computations.
 *
 * @param getter - Reactive getter for the input value
 * @param compute - Function to compute output from input
 * @param delay - Debounce delay in milliseconds (default: 350)
 * @returns Object with computed value and computing state
 *
 * @example
 * ```typescript
 * const { value, isComputing } = useDebouncedComputation(
 *   () => seed,
 *   (seed) => calculateResult(seed),
 *   350
 * );
 * ```
 */
export function useDebouncedComputation<T, U>(
  getter: () => T,
  compute: (value: T) => U,
  delay: number = 350
) {
  const result = $derived.by(debouncer(getter, compute, delay));

  return {
    get value() {
      return result.value;
    },
    get isComputing() {
      return result.debouncing;
    }
  };
}
