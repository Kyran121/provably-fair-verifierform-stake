import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import TomeOfLifeResult from '$lib/games/slots/tomeoflife/TomeOfLifeResult.svelte';
import TomeOfLifeExplanation from '$lib/games/slots/tomeoflife/TomeOfLifeExplanation.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Tome Of Life',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: TomeOfLifeResult,
  ExplanationComponent: TomeOfLifeExplanation
};
