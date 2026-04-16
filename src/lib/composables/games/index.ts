/**
 * Game Composables
 *
 * Game-specific composables organized by category.
 * Each composable encapsulates the business logic for a specific game.
 */

// Simple games
export * from './simple/use-dice-roll.svelte';
export * from './simple/use-flip-outcome.svelte';
export * from './simple/use-limbo-multiplier.svelte';
export * from './simple/use-wheel-spin.svelte';
export * from './simple/use-rps-outcome.svelte';

// Grid/Position games
export * from './grid/use-plinko-payout.svelte';
export * from './grid/use-roulette-number.svelte';
export * from './grid/use-keno-numbers.svelte';
export * from './grid/use-mines-positions.svelte';
export * from './grid/use-moles-rounds.svelte';
export * from './grid/use-diamonds-gems.svelte';
export * from './grid/use-dragon-tower-levels.svelte';
export * from './grid/use-snakes-steps.svelte';

// Skill/Target games
export * from './skill/use-darts-throw.svelte';
export * from './skill/use-chicken-multiplier.svelte';
export * from './skill/use-pump-multiplier.svelte';
export * from './skill/use-drill-results.svelte';
export * from './skill/use-bars-payout.svelte';
export * from './skill/use-cases-payout.svelte';

// Card/Collection games
export * from './cards/use-card-deck.svelte';
export * from './cards/use-tarots-cards.svelte';
export * from './cards/use-packs-cards.svelte';
export * from './cards/use-baccarat-cards.svelte';
export * from './cards/use-blackjack-cards.svelte';
export * from './cards/use-hilo-cards.svelte';
export * from './cards/use-videopoker-cards.svelte';

// Slot games
export * from './slots/use-bluesamurai-rounds.svelte';
export * from './slots/use-slot-result.svelte';

// Multiplayer games
export * from './multiplayer/use-crash-point.svelte';
export * from './multiplayer/use-slide-point.svelte';

// Explanation/display helpers
export { useBlueSamuraiExplanation } from './slots/use-bluesamurai-explanation.svelte';
export { useDartsMultiplierCalc } from './skill/use-darts-multiplier-calc.svelte';
export { useDragonTowerGrid } from './grid/use-dragontower-grid.svelte';
export { useMolesExplanation } from './grid/use-moles-explanation.svelte';
export { useMinesExplanation } from './grid/use-mines-explanation.svelte';
