import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import PumpResult from '$lib/games/pump/PumpResult.svelte';
import { z } from 'zod';
import PumpExplanation from '$lib/games/pump/PumpExplanation.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Pump',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
    difficulty: z.enum(['easy', 'medium', 'hard', 'expert'])
  }),
  controls: [
    ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
    {
      id: 'difficulty',
      name: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      options: ['easy', 'medium', 'hard', 'expert']
    }
  ],
  ResultComponent: PumpResult,
  ExplanationComponent: PumpExplanation
};
