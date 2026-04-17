import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
} from '$lib/controlSetup';
import VideoPokerExplanation from '$lib/games/cards/videopoker/VideoPokerExplanation.svelte';
import VideoPokerResult from '$lib/games/cards/videopoker/VideoPokerResult.svelte';
import type { GameDefinition } from 'provably-fair-verifierform-lib';

export const gameDefinition: GameDefinition = {
  name: 'Video Poker',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: VideoPokerResult,
  ExplanationComponent: VideoPokerExplanation,
};
