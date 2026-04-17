import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import KenoExplanation from '$lib/games/keno/KenoExplanation.svelte';
import KenoResult from '$lib/games/keno/KenoResult.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Keno',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: KenoResult,
  ExplanationComponent: KenoExplanation,
};
