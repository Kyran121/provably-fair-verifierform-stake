import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import DrillResult from './DrillResult.svelte';
import DrillExplanation from './DrillExplanation.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Drill',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: DrillResult,
  ExplanationComponent: DrillExplanation,
};
