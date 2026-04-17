import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import RouletteExplanation from '$lib/games/roulette/RouletteExplanation.svelte';
import RouletteResult from '$lib/games/roulette/RouletteResult.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Roulette',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: RouletteResult,
  ExplanationComponent: RouletteExplanation,
};
