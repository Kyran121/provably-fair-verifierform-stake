# Phase 1: Reorganize Constants & Configuration - Detailed Implementation Plan

## 📋 Overview

**Goal**: Split the monolithic `src/lib/constants.ts` file into logical, focused configuration files following the Single Responsibility Principle.

**Impact**: 40 files will need their imports updated
**Estimated Time**: 2-3 hours
**Risk Level**: Low (automated find/replace, TypeScript will catch errors)

---

## 🎯 Objectives

1. **Separate UI concerns from domain logic**
2. **Improve testability** of game configurations
3. **Enable better tree-shaking** for smaller bundle sizes
4. **Create clear ownership** of configuration values
5. **Set foundation** for future phases

---

## 📊 Current State Analysis

### Files Affected (40 total)

#### UI Color Constants Usage
- **39 files** use color constants (TEXT_HIGHLIGHT_COLOR, BG_COLOR, etc.)
- Most common files: `ContentBlock.svelte`, `HighlightText.svelte`, layout components

#### Game Configuration Constants Usage
- **DARTS_COLOR_TO_MULTI**: 2 files (darts game)
- **DRAGON_TOWER_LEVEL_MAP**: 2 files (dragon tower game)
- **SNAKES_MULTIPLIER_SHIFT_MAP**: 2 files (snakes game)
- **PUMP_DIFFICULTY_TO_SLICE**: 2 files (pump game)
- **CHICKEN_DIFFICULTY_TO_SLICE**: 2 files (chicken game)
- **CRASH_SEED**: 4 files (crash multiplayer game)
- **SLIDE_SEEDS**: 4 files (slide multiplayer game)

### Current File Structure
```
src/lib/
└── constants.ts (110 lines - everything mixed together)
```

---

## 🏗️ New File Structure

```
src/lib/
├── config/
│   ├── index.ts                      # Re-export everything for convenience
│   │
│   ├── ui/
│   │   ├── index.ts                  # Re-exports
│   │   ├── colors.ts                 # Color constants
│   │   └── theme.ts                  # Future: theme configuration
│   │
│   └── games/
│       ├── index.ts                  # Re-exports all game configs
│       ├── darts.config.ts           # Darts-specific config
│       ├── dragon-tower.config.ts    # Dragon Tower config
│       ├── snakes.config.ts          # Snakes config
│       ├── pump.config.ts            # Pump config
│       ├── chicken.config.ts         # Chicken config
│       └── multiplayer.config.ts     # Crash/Slide seeds
```

---

## 📝 Step-by-Step Implementation

### Step 1: Create Directory Structure

```bash
mkdir -p src/lib/config/ui
mkdir -p src/lib/config/games
```

### Step 2: Create UI Color Configuration

**File**: `src/lib/config/ui/colors.ts`

```typescript
/**
 * UI Color Constants
 *
 * Tailwind CSS classes for consistent theming across components.
 * These values should be used for UI presentation only.
 */

// Highlight colors for text and links
export const TEXT_HIGHLIGHT_COLOR = 'text-purple-500 dark:text-purple-400';

// Step container styling
export const STEP_CONTAINER_BG_COLOR = 'bg-gray-200 dark:bg-gray-800';
export const STEP_CONTAINER_TEXT_COLOR = 'text-gray-500 dark:text-gray-400';

// Purple theme (primary)
export const BG_COLOR = 'bg-purple-500 text-white';
export const BTN_BG_COLOR = 'bg-purple-500 hover:bg-purple-600';
export const BTN_BG_COLOR_SELECTED = 'bg-purple-900';

// Gray theme
export const BG_COLOR_GRAY = 'dark:bg-gray-600 bg-gray-400';
export const BTN_BG_COLOR_GRAY =
  'dark:bg-gray-600 dark:hover:bg-gray-700 bg-gray-400 dark:bg-gray-500';
export const BTN_BG_COLOR_GRAY_SELECTED = 'bg-gray-700 dark:bg-gray-800';

// Green theme
export const BG_COLOR_GREEN = 'bg-green-500 dark:bg-green-600';
export const BTN_BG_COLOR_GREEN = 'bg-green-600 hover:bg-green-700';
export const BTN_BG_COLOR_GREEN_SELECTED = 'bg-green-900';

// Blue theme
export const BG_COLOR_BLUE = 'bg-blue-700 dark:bg-blue-600 text-white';
export const BTN_BG_COLOR_BLUE =
  'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700';
export const BTN_BG_COLOR_BLUE_SELECTED = 'bg-blue-950';

// Red theme
export const BG_COLOR_RED = 'bg-red-600 dark:bg-red-700 dark:text-white';
export const BTN_BG_COLOR_RED = 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800';
export const BTN_BG_COLOR_RED_SELECTED = 'bg-red-900';

// Gold theme
export const BG_COLOR_GOLD = 'bg-[#FFD700]';
```

**File**: `src/lib/config/ui/index.ts`

```typescript
/**
 * UI Configuration
 *
 * Re-exports all UI-related configuration for convenient importing.
 */
export * from './colors';
```

### Step 3: Create Game Configuration Files

**File**: `src/lib/config/games/darts.config.ts`

```typescript
import type { DartsDifficulty, DartsColor } from '$lib/types';

/**
 * Darts Game Configuration
 *
 * Maps difficulty levels and dart colors to multiplier values.
 * Higher difficulty levels have higher risk/reward ratios.
 */
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
```

**File**: `src/lib/config/games/dragon-tower.config.ts`

```typescript
import type { DragonTowerDifficulty, DragonTowerDifficultyConfig } from '$lib/types';

/**
 * Dragon Tower Game Configuration
 *
 * Defines the number of safe spots (count) and grid size for each difficulty level.
 * Higher difficulty = fewer safe spots = higher risk.
 */
export const DRAGON_TOWER_LEVEL_MAP: Record<DragonTowerDifficulty, DragonTowerDifficultyConfig> = {
  easy: { count: 3, size: 4 },
  medium: { count: 2, size: 3 },
  hard: { count: 1, size: 2 },
  expert: { count: 1, size: 3 },
  master: { count: 1, size: 4 }
};
```

**File**: `src/lib/config/games/snakes.config.ts`

```typescript
import type { SnakesDifficulty } from '$lib/types';

/**
 * Snakes Game Configuration
 *
 * Maps multiplier shifts for different difficulty levels.
 * The key is the base multiplier, the value is the adjusted multiplier.
 */
export const SNAKES_MULTIPLIER_SHIFT_MAP: Record<SnakesDifficulty, { [multi: number]: number }> = {
  easy: { 1.01: 1.08 },
  medium: { 1.11: 1.2 },
  hard: { 1.38: 1.5 },
  expert: { 3.82: 4 },
  master: { 17.64: 18 }
};
```

**File**: `src/lib/config/games/pump.config.ts`

```typescript
import type { PumpDifficulty } from '$lib/types';

/**
 * Pump Game Configuration
 *
 * Maps difficulty levels to slice counts.
 * Higher difficulty = more slices = higher precision required.
 */
export const PUMP_DIFFICULTY_TO_SLICE: Record<PumpDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
  expert: 10
};
```

**File**: `src/lib/config/games/chicken.config.ts`

```typescript
import type { ChickenDifficulty } from '$lib/types';

/**
 * Chicken Game Configuration
 *
 * Maps difficulty levels to slice counts.
 * Higher difficulty = more slices = higher precision required.
 */
export const CHICKEN_DIFFICULTY_TO_SLICE: Record<ChickenDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 5,
  expert: 10
};
```

**File**: `src/lib/config/games/multiplayer.config.ts`

```typescript
/**
 * Multiplayer Game Configuration
 *
 * Seeds used for verifying multiplayer game fairness.
 * These are blockchain-based hash values that ensure provable fairness.
 */

/**
 * Crash game seed
 * Used as the starting point for the crash game hash chain
 */
export const CRASH_SEED = '0000000000000000001b34dc6a1e86083f95500b096231436e9b25cbdd0075c4';

/**
 * Slide game seeds
 * [0] = slide hash (game-specific)
 * [1] = block hash (blockchain verification)
 */
export const SLIDE_SEEDS = [
  '0000000000000000000b20f796f5421cac95c4efb06c6bbf6408d6f9b5d7b9dc',
  '00000000000000000000644330e1340fc6e894a95c37060bdd180ed11d068944'
];
```

**File**: `src/lib/config/games/index.ts`

```typescript
/**
 * Game Configuration
 *
 * Re-exports all game-specific configuration for convenient importing.
 */
export * from './darts.config';
export * from './dragon-tower.config';
export * from './snakes.config';
export * from './pump.config';
export * from './chicken.config';
export * from './multiplayer.config';
```

### Step 4: Create Main Index Files

**File**: `src/lib/config/index.ts`

```typescript
/**
 * Configuration Module
 *
 * Central re-export point for all configuration.
 * This allows both granular imports and convenience imports.
 *
 * Usage:
 * - Granular: import { DARTS_COLOR_TO_MULTI } from '$lib/config/games/darts.config';
 * - Convenient: import { DARTS_COLOR_TO_MULTI, TEXT_HIGHLIGHT_COLOR } from '$lib/config';
 */

// UI configuration
export * from './ui';

// Game configuration
export * from './games';
```

### Step 5: Update Import Statements

Update all 40 files that import from `$lib/constants`:

#### Option A: Minimal Changes (Backwards Compatible)

Keep the old import path working by updating `src/lib/constants.ts`:

```typescript
/**
 * @deprecated This file is deprecated. Import from '$lib/config' instead.
 * This file will be removed in a future version.
 *
 * Migration guide:
 * - UI colors: import from '$lib/config/ui/colors'
 * - Game configs: import from '$lib/config/games/[game-name].config'
 * - Or use: import from '$lib/config' for all exports
 */
export * from './config';
```

This allows existing imports to continue working while we gradually migrate.

#### Option B: Complete Migration (Recommended)

Update all imports in one go:

**Search Pattern**: `from '\$lib/constants'`
**Replace With**: `from '$lib/config'`

Affected files (40 total):
- All files in `src/lib/games/` that use colors or game configs
- All layout components
- All test files
- Library submodule files (`provably-fair-verifierform-lib/`)

### Step 6: Create Migration Script (Optional)

**File**: `scripts/migrate-constants.sh`

```bash
#!/bin/bash

# Phase 1: Update all imports from $lib/constants to $lib/config
echo "Migrating imports from \$lib/constants to \$lib/config..."

# Find all TypeScript and Svelte files
find src -type f \( -name "*.ts" -o -name "*.svelte" \) -exec sed -i '' "s/from '\$lib\/constants'/from '\$lib\/config'/g" {} +

echo "Migration complete!"
echo "Please run 'pnpm run check' to verify no TypeScript errors."
```

### Step 7: Update Tests

Check if any tests import from constants and update them:

```typescript
// Before
import { CRASH_SEED, SLIDE_SEEDS } from '$lib/constants';

// After (option 1: specific)
import { CRASH_SEED, SLIDE_SEEDS } from '$lib/config/games/multiplayer.config';

// After (option 2: general)
import { CRASH_SEED, SLIDE_SEEDS } from '$lib/config';
```

### Step 8: Create Unit Tests for Configurations

**File**: `tests/lib/config/games/darts.config.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { DARTS_COLOR_TO_MULTI } from '$lib/config/games/darts.config';
import { DartsDifficulty, DartsColor } from '$lib/types';

describe('Darts Configuration', () => {
  it('should have configurations for all difficulty levels', () => {
    expect(DARTS_COLOR_TO_MULTI).toHaveProperty(DartsDifficulty.EASY);
    expect(DARTS_COLOR_TO_MULTI).toHaveProperty(DartsDifficulty.MEDIUM);
    expect(DARTS_COLOR_TO_MULTI).toHaveProperty(DartsDifficulty.HARD);
    expect(DARTS_COLOR_TO_MULTI).toHaveProperty(DartsDifficulty.EXPERT);
  });

  it('should have multipliers for all dart colors', () => {
    const easyConfig = DARTS_COLOR_TO_MULTI[DartsDifficulty.EASY];

    expect(easyConfig).toHaveProperty(DartsColor.GREEN);
    expect(easyConfig).toHaveProperty(DartsColor.RED);
    expect(easyConfig).toHaveProperty(DartsColor.ORANGE);
    expect(easyConfig).toHaveProperty(DartsColor.YELLOW);
    expect(easyConfig).toHaveProperty(DartsColor.LIGHT_GRAY);
    expect(easyConfig).toHaveProperty(DartsColor.DARK_GRAY);
  });

  it('should have higher multipliers for higher difficulty', () => {
    const easyGreen = DARTS_COLOR_TO_MULTI[DartsDifficulty.EASY][DartsColor.GREEN];
    const expertGreen = DARTS_COLOR_TO_MULTI[DartsDifficulty.EXPERT][DartsColor.GREEN];

    expect(expertGreen).toBeGreaterThan(easyGreen);
  });
});
```

Similar tests should be created for:
- `dragon-tower.config.test.ts`
- `snakes.config.test.ts`
- `pump.config.test.ts`
- `chicken.config.test.ts`
- `multiplayer.config.test.ts`

---

## ✅ Verification Checklist

After implementing Phase 1:

- [ ] All new config files created in `src/lib/config/`
- [ ] Directory structure matches the plan
- [ ] All constants moved from old file to new locations
- [ ] Import statements updated (all 40 files)
- [ ] TypeScript compilation passes (`pnpm run check`)
- [ ] All tests pass (`pnpm test`)
- [ ] No runtime errors in development (`pnpm dev`)
- [ ] Unit tests created for config files
- [ ] JSDoc comments added to all exports
- [ ] Old `constants.ts` either removed or deprecated
- [ ] No TypeScript errors in IDE
- [ ] Git commit created with clear message

---

## 🧪 Testing Strategy

### 1. Type Checking
```bash
pnpm run check
```

### 2. Unit Tests
```bash
pnpm test
```

### 3. Visual Testing
```bash
pnpm dev
# Manually test each game to ensure configs load correctly
```

### 4. Build Testing
```bash
pnpm build
# Ensure production build succeeds
```

---

## 📦 Implementation Order

1. **Create directory structure** (Step 1) - 2 min
2. **Create UI config files** (Step 2) - 10 min
3. **Create game config files** (Step 3) - 20 min
4. **Create index files** (Step 4) - 5 min
5. **Update imports** (Step 5) - 30-60 min (manual) or 5 min (script)
6. **Run TypeScript check** - 2 min
7. **Create config tests** (Step 8) - 30 min
8. **Run all tests** - 5 min
9. **Manual verification** - 15 min
10. **Git commit** - 5 min

**Total Time**: ~2-3 hours

---

## 🎯 Success Criteria

- ✅ Zero TypeScript errors
- ✅ All tests passing (existing + new)
- ✅ No visual regression (all games work)
- ✅ All 40 files updated successfully
- ✅ Improved code organization (clear separation)
- ✅ Better developer experience (easier to find configs)
- ✅ Foundation set for future phases

---

## 🔄 Rollback Plan

If something goes wrong:

1. **Git revert**: `git reset --hard HEAD~1`
2. **Restore from stash**: If changes were stashed
3. **Keep deprecated file**: If Option A was used, old imports still work

---

## 📚 Import Examples After Migration

```typescript
// Specific imports (recommended for tree-shaking)
import { TEXT_HIGHLIGHT_COLOR } from '$lib/config/ui/colors';
import { DARTS_COLOR_TO_MULTI } from '$lib/config/games/darts.config';

// Category imports
import { BG_COLOR, BTN_BG_COLOR } from '$lib/config/ui';
import { CRASH_SEED, SLIDE_SEEDS } from '$lib/config/games';

// Convenience import (all configs)
import {
  TEXT_HIGHLIGHT_COLOR,
  DARTS_COLOR_TO_MULTI,
  CRASH_SEED
} from '$lib/config';
```

---

## 🚀 Next Steps After Phase 1

Once Phase 1 is complete:
- [ ] Review and validate all changes
- [ ] Create pull request for team review
- [ ] Merge to main branch
- [ ] Begin Phase 2: Extract utilities to `src/lib/utils/`
- [ ] Begin Phase 3: Create domain layer

---

## 📝 Notes

- This phase is low-risk because TypeScript will catch any import errors
- Can be done incrementally (one config file at a time)
- No changes to runtime behavior - purely organizational
- Sets foundation for better architecture in future phases
