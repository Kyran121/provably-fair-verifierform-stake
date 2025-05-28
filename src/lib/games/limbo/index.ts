import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import LimboExplanation from '$lib/games/limbo/LimboExplanation.svelte';
import LimboResult from '$lib/games/limbo/LimboResult.svelte';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const gameDefinition: GameDefinition = {
  name: 'Limbo',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: LimboResult,
  ExplanationComponent: LimboExplanation
};
