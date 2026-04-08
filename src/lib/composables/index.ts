/**
 * Composables Module
 *
 * Re-exports all composables for convenient importing.
 *
 * Usage examples:
 * ```typescript
 * // Specific import (recommended for better tree-shaking)
 * import { useDiceRoll } from '$lib/composables/games/simple/use-dice-roll.svelte';
 *
 * // Category import
 * import { useDiceRoll, useFlipOutcome } from '$lib/composables/games';
 *
 * // Convenient import (all composables)
 * import { useDiceRoll, useDebouncedComputation } from '$lib/composables';
 * ```
 */

// Core composables
export * from './core';

// Game composables
export * from './games';
