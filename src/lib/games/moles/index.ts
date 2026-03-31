import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import MolesResult from './MolesResult.svelte';
import MolesExplanation from './MolesExplanation.svelte';
import { z } from 'zod';

export const gameDefinition: GameDefinition = {
  name: 'Moles',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA.extend({
    molescount: z.number().min(1).max(6)
  }),
  controls: [
    ...CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
    {
      id: 'molescount',
      name: 'molescount',
      label: 'Moles Count',
      type: 'number',
      required: true,
      default: 3,
      attrs: {
        min: 1,
        max: 6
      }
    }
  ],
  ResultComponent: MolesResult,
  ExplanationComponent: MolesExplanation
};
