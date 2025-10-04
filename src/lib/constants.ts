import type {
  ChickenDifficulty,
  DartsColor,
  DartsDifficulty,
  DragonTowerDifficulty,
  DragonTowerDifficultyConfig,
  PumpDifficulty,
  SnakesDifficulty
} from '$lib/types';

export const TEXT_HIGHLIGHT_COLOR = 'text-purple-500 dark:text-purple-400';
export const STEP_CONTAINER_BG_COLOR = 'bg-gray-200 dark:bg-gray-800';
export const STEP_CONTAINER_TEXT_COLOR = 'text-gray-500 dark:text-gray-400';

//purple
export const BG_COLOR = 'bg-purple-500 text-white';
export const BTN_BG_COLOR = 'bg-purple-500 hover:bg-purple-600';
export const BTN_BG_COLOR_SELECTED = 'bg-purple-900';

//gray
export const BG_COLOR_GRAY = 'dark:bg-gray-600 bg-gray-400';
export const BTN_BG_COLOR_GRAY =
  'dark:bg-gray-600 dark:hover:bg-gray-700 bg-gray-400 dark:bg-gray-500';
export const BTN_BG_COLOR_GRAY_SELECTED = 'bg-gray-700 dark:bg-gray-800';

//green
export const BG_COLOR_GREEN = 'bg-green-500 dark:bg-green-600';
export const BTN_BG_COLOR_GREEN = 'bg-green-600 hover:bg-green-700';
export const BTN_BG_COLOR_GREEN_SELECTED = 'bg-green-900';

//blue
export const BG_COLOR_BLUE = 'bg-blue-700 dark:bg-blue-600 text-white';
export const BTN_BG_COLOR_BLUE =
  'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700';
export const BTN_BG_COLOR_BLUE_SELECTED = 'bg-blue-950';

//red
export const BG_COLOR_RED = 'bg-red-600 dark:bg-red-700 dark:text-white';
export const BTN_BG_COLOR_RED = 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800';
export const BTN_BG_COLOR_RED_SELECTED = 'bg-red-900';

//gold
export const BG_COLOR_GOLD = 'bg-[#FFD700]';

export const CRASH_SEED = '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4';
export const SLIDE_SEEDS = [
  '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc',
  '00000000000000000000644330e1340fc6e894a95c37060bdd180ed11d068944'
];
export const PUMP_DIFFICULTY_TO_SLICE: Record<ChickenDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
  expert: 10
};
export const CHICKEN_DIFFICULTY_TO_SLICE: Record<PumpDifficulty, number> = {
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
export const DARTS_COLOR_TO_MULTI: Record<DartsDifficulty, Record<DartsColor, number>> = {
  easy: {
    '#24e700': 8.5,
    '#fb053f': 2.7,
    '#fb6120': 1.5,
    '#fcc101': 1.2,
    '#213843': 0.8,
    '#0e202c': 0.5
  },
  medium: {
    '#24e700': 16,
    '#fb053f': 6,
    '#fb6120': 3.1,
    '#fcc101': 1.3,
    '#213843': 0.6,
    '#0e202c': 0.4
  },
  hard: {
    '#24e700': 63,
    '#fb053f': 8.8,
    '#fb6120': 3.6,
    '#fcc101': 2.5,
    '#213843': 0.5,
    '#0e202c': 0.2
  },
  expert: {
    '#24e700': 500,
    '#fb053f': 42,
    '#fb6120': 9.6,
    '#fcc101': 4.8,
    '#213843': 0.5,
    '#0e202c': 0.1
  }
};
