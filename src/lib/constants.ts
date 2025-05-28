import type {
  DragonTowerDifficulty,
  DragonTowerDifficultyConfig,
  PumpDifficulty,
  SnakesDifficulty
} from '$lib/types';

export const CRASH_SEED = '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4';
export const SLIDE_SEEDS = [
  '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc',
  '00000000000000000000644330e1340fc6e894a95c37060bdd180ed11d068944'
];
export const PUMP_DIFFICULTY_TO_SLICE: Record<PumpDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
  expert: 10
};
export const DRAGON_TOWER_LEVEL_MAP: Record<DragonTowerDifficulty, DragonTowerDifficultyConfig> = {
  easy: { count: 3, size: 4 },
  medium: { count: 2, size: 3 },
  hard: { count: 1, size: 2 },
  expert: { count: 1, size: 3 },
  master: { count: 1, size: 4 }
};
export const SNAKES_MULTIPLIER_SHIFT_MAP: Record<SnakesDifficulty, { [multi: number]: number }> = {
  easy: { 1.01: 1.08 },
  medium: { 1.11: 1.2 },
  hard: { 1.38: 1.5 },
  expert: { 3.82: 4 },
  master: { 17.64: 18 }
};
