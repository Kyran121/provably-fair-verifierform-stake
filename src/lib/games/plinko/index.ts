import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import { z } from 'zod';
import PlinkoResult from '$lib/games/plinko/PlinkoResult.svelte';
import PlinkoExplanation from '$lib/games/plinko/PlinkoExplanation.svelte';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const gameDefinition: GameDefinition = {
  name: 'Plinko',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
    risk: z.enum(['low', 'medium', 'high']),
    rows: z.number().min(8).max(16)
  }),
  controls: [
    ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
    {
      id: 'risk',
      name: 'risk',
      label: 'Risk',
      type: 'select',
      options: ['low', 'medium', 'high']
    },
    {
      id: 'rows',
      name: 'rows',
      label: 'Rows',
      type: 'number',
      default: 8,
      required: true,
      attrs: {
        min: 8,
        max: 16
      }
    }
  ],
  ResultComponent: PlinkoResult,
  ExplanationComponent: PlinkoExplanation
};
