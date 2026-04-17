import { z } from 'zod';
import SlideExplanation from '$lib/games/multiplayer/slide/SlideExplanation.svelte';
import SlideResult from '$lib/games/multiplayer/slide/SlideResult.svelte';
import { SLIDE_SEEDS } from '$lib/config';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const gameDefinition: GameDefinition = {
  name: 'Slide',
  schema: z.object({
    slidehash: z.string(),
    blockhash: z.string(),
  }),
  controls: [
    {
      id: 'slidehash',
      name: 'slidehash',
      label: 'Slide Hash',
      type: 'text',
      required: true,
    },
    {
      id: 'blockhash',
      name: 'blockhash',
      label: 'Block Hash',
      type: 'select',
      options: SLIDE_SEEDS,
    },
  ],
  ResultComponent: SlideResult,
  ExplanationComponent: SlideExplanation,
};
