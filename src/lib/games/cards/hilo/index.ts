import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import CardExplanation from '$lib/games/cards/CardExplanation.svelte';
import HiloResult from '$lib/games/cards/hilo/HiloResult.svelte';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const gameDefinition: GameDefinition = {
  name: 'Hilo',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: HiloResult,
  ExplanationComponent: CardExplanation
};
