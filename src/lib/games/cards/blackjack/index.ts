import {
  CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA
} from '$lib/controlSetup';
import type { GameDefinition } from 'provably-fair-verifierform-lib';
import BlackjackResult from '$lib/games/cards/blackjack/BlackjackResult.svelte';
import CardExplanation from '$lib/games/cards/CardExplanation.svelte';

export const gameDefinition: GameDefinition = {
  name: 'Blackjack',
  schema: CLIENT_SEED_SERVER_SEED_NONCE_SCHEMA,
  controls: CLIENT_SEED_SERVER_SEED_NONCE_CONTROLS,
  ResultComponent: BlackjackResult,
  ExplanationComponent: CardExplanation
};
