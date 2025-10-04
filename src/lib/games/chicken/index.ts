import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import { z } from 'zod';
import ChickenResult from './ChickenResult.svelte';
import ChickenExplanation from './ChickenExplanation.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Chicken',
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
  ResultComponent: ChickenResult,
  ExplanationComponent: ChickenExplanation
};
