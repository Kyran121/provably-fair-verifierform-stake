import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import ScarabSpinsResult from '$lib/games/scarabspins-tomeoflife/scarabspins/ScarabSpinsResult.svelte';
import ScarabSpinsExplanation from '$lib/games/scarabspins-tomeoflife/scarabspins/ScarabSpinsExplanation.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Scarab Spins',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: ScarabSpinsResult,
  ExplanationComponent: ScarabSpinsExplanation
};
