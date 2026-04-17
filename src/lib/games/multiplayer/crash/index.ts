import { z } from 'zod';
import CrashExplanation from '$lib/games/multiplayer/crash/CrashExplanation.svelte';
import CrashResult from '$lib/games/multiplayer/crash/CrashResult.svelte';
import { CRASH_SEED } from '$lib/config';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const gameDefinition: GameDefinition = {
  name: 'Crash',
  schema: z.object({
    gamehash: z.string(),
  }),
  controls: [
    {
      id: 'gamehash',
      name: 'gamehash',
      label: 'Game Hash',
      type: 'text',
      required: true,
    },
    {
      id: 'blockhash',
      name: 'blockhash',
      label: 'Block Hash',
      type: 'text',
      disabled: true,
      syncToUrl: false,
      attrs: {
        value: CRASH_SEED,
      },
    },
  ],
  ResultComponent: CrashResult,
  ExplanationComponent: CrashExplanation,
};
