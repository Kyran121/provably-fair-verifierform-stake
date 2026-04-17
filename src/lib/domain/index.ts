// Domain layer - Pure business logic (framework-agnostic)

// Crypto utilities
export { default as ByteGenerator } from './crypto/byte-generator';
export { FloatGenerator } from './crypto/float-generator';

// Shared game utilities
export { fisherYates } from './games/shared/fisher-yates';
export { getPayout } from './games/shared/payout';
export { shuffle } from './games/shared/shuffle';

// Game-specific domain logic
// Note: Direct imports are preferred over re-exports to avoid naming conflicts.
// Import directly from './games/{game-name}' when using these modules.
//
// Examples:
// import { simulateRounds } from '$lib/domain/games/bluesamurai';
// import { getDirections } from '$lib/domain/games/plinko';
// import { generateCardDeck } from '$lib/domain/games/cards';
