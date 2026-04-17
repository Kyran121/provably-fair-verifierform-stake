import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '$lib/controlSetup';
import { z } from 'zod';
import WheelResult from '$lib/games/wheel/WheelResult.svelte';
import WheelExplanation from '$lib/games/wheel/WheelExplanation.svelte';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const gameDefinition: GameDefinition = {
  name: 'Wheel',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
    risk: z.enum(['low', 'medium', 'high']),
    segments: z.number().min(10).max(50).step(10),
  }),
  controls: [
    ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
    {
      id: 'risk',
      name: 'risk',
      label: 'Risk',
      type: 'select',
      options: ['low', 'medium', 'high'],
    },
    {
      id: 'segments',
      name: 'segments',
      label: 'Segments',
      type: 'number',
      default: 10,
      required: true,
      attrs: {
        min: 10,
        max: 50,
        step: 10,
      },
    },
  ],
  ResultComponent: WheelResult,
  ExplanationComponent: WheelExplanation,
};
