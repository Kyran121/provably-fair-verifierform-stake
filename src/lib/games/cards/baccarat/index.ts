import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import BaccaratExplanation from '$lib/games/cards/baccarat/BaccaratExplanation.svelte';
import BaccaratResult from '$lib/games/cards/baccarat/BaccaratResult.svelte';

export const gameDefinition = {
  name: 'Baccarat',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: BaccaratResult,
  ExplanationComponent: BaccaratExplanation
};
