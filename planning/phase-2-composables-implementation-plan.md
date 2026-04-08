# Phase 2: Extract Business Logic to Composables - Detailed Implementation Plan

## 📋 Overview

**Goal**: Extract business logic from components into reusable Svelte composables (`.svelte.ts` files), following the Application Layer pattern of clean architecture.

**Impact**: ALL 31 game result components will be refactored
**Estimated Time**: 6-8 hours
**Risk Level**: Medium (changes component structure, but well-tested by existing tests)

---

## 🎯 Objectives

1. **Separate business logic from UI presentation**
2. **Create reusable composables** that encapsulate reactive state and computations
3. **Make components pure and focused** on rendering
4. **Enable easier testing** (composables can be tested independently)
5. **Prepare for Phase 3** (domain layer with pure functions)

---

## 📊 Current State Analysis

### Pattern Observed in Components

All game result components follow this pattern:

**Example: DiceResult.svelte**

```svelte
<script lang="ts">
  // 1. Imports
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';

  // 2. Props
  const { formValues } = $props();

  // 3. Seed parsing (LOGIC)
  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  // 4. Computation with debouncing (LOGIC)
  const rollNumberDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return Math.floor(floatGenerator.next().value * 10001) / 100;
      },
      350
    )
  );
</script>

<!-- 5. UI rendering -->
{#if rollNumberDebounced.debouncing}
  <Loader />
{:else}
  <div>Result: {rollNumberDebounced.value}</div>
{/if}
```

### ALL Components to Refactor (31 Total)

**Simple Games** (5 games - basic float generation):

1. `DiceResult.svelte` - Simple float to dice roll
2. `FlipResult.svelte` - Coin flip
3. `LimboResult.svelte` - Limbo multiplier
4. `WheelResult.svelte` - Wheel segment selection
5. `RockPaperScissorsResult.svelte` - RPS outcome

**Grid/Position Games** (8 games - position-based):

6. `PlinkoResult.svelte` - Path calculation + payout
7. `RouletteResult.svelte` - Number selection
8. `KenoResult.svelte` - Number selection array
9. `MinesResult.svelte` - Mine positions
10. `MolesResult.svelte` - Mole positions
11. `DiamondsResult.svelte` - Diamond positions
12. `DragonTowerResult.svelte` - Multi-level game
13. `SnakesResult.svelte` - Dice rolls with multipliers

**Skill/Target Games** (6 games - color/target selection):

14. `DartsResult.svelte` - Color to multiplier
15. `ChickenResult.svelte` - Chicken positions
16. `PumpResult.svelte` - Pump positions
17. `DrillResult.svelte` - Drill positions
18. `BarsResult.svelte` - Bar positions
19. `CasesResult.svelte` - Case opening

**Card/Collection Games** (6 games - shuffling/selection):

20. `TarotsResult.svelte` - Tarot card selection
21. `PacksResult.svelte` - Pack opening
22. `BaccaratResult.svelte` - Card shuffle + scoring
23. `BlackjackResult.svelte` - Card shuffle + scoring
24. `HiloResult.svelte` - Card shuffle
25. `VideoPokerResult.svelte` - Card shuffle + hand evaluation

**Slot Games** (4 games - reel-based):

26. `BlueSamuraiResult.svelte` - Blue Samurai slots
27. `SlotResult.svelte` - Generic slot (parent)
28. `ScarabSpinsResult.svelte` - Scarab Spins variant
29. `TomeOfLifeResult.svelte` - Tome of Life variant

**Multiplayer** (2 games - hash-based):

30. `CrashResult.svelte` - Hash chain calculation
31. `SlideResult.svelte` - Hash calculation

---

## 🏗️ New Composable Structure

```
src/lib/composables/
├── index.ts                          # Re-exports
│
├── core/                             # Core composables (reusable)
│   ├── use-debounced-computation.svelte.ts   # Generic debouncer wrapper
│   ├── use-seed-parser.svelte.ts              # Parse formValues to Seed
│   └── use-float-generation.svelte.ts         # Generate float from seed
│
├── games/                            # Game-specific composables (31 total)
│   ├── simple/                       # Simple games (5)
│   │   ├── use-dice-roll.svelte.ts
│   │   ├── use-flip-outcome.svelte.ts
│   │   ├── use-limbo-multiplier.svelte.ts
│   │   ├── use-wheel-spin.svelte.ts
│   │   └── use-rps-outcome.svelte.ts
│   │
│   ├── grid/                         # Grid/Position games (8)
│   │   ├── use-plinko-path.svelte.ts
│   │   ├── use-roulette-number.svelte.ts
│   │   ├── use-keno-numbers.svelte.ts
│   │   ├── use-mines-positions.svelte.ts
│   │   ├── use-moles-positions.svelte.ts
│   │   ├── use-diamonds-positions.svelte.ts
│   │   ├── use-dragon-tower.svelte.ts
│   │   └── use-snakes-rolls.svelte.ts
│   │
│   ├── skill/                        # Skill/Target games (6)
│   │   ├── use-darts-shot.svelte.ts
│   │   ├── use-chicken-run.svelte.ts
│   │   ├── use-pump-action.svelte.ts
│   │   ├── use-drill-hit.svelte.ts
│   │   ├── use-bars-selection.svelte.ts
│   │   └── use-cases-opening.svelte.ts
│   │
│   ├── cards/                        # Card games (6)
│   │   ├── use-card-shuffle.svelte.ts    # Shared card shuffling
│   │   ├── use-tarot-draw.svelte.ts
│   │   ├── use-packs-opening.svelte.ts
│   │   ├── use-baccarat-hand.svelte.ts
│   │   ├── use-blackjack-hand.svelte.ts
│   │   ├── use-hilo-hand.svelte.ts
│   │   └── use-video-poker-hand.svelte.ts
│   │
│   ├── slots/                        # Slot games (4)
│   │   ├── use-slot-spin.svelte.ts       # Shared slot logic
│   │   ├── use-blue-samurai-spin.svelte.ts
│   │   ├── use-scarab-spins-spin.svelte.ts
│   │   └── use-tome-of-life-spin.svelte.ts
│   │
│   └── multiplayer/                  # Multiplayer games (2)
│       ├── use-crash-multiplier.svelte.ts
│       └── use-slide-multiplier.svelte.ts
│
└── README.md                         # Composable patterns and usage
```

---

## 📝 Step-by-Step Implementation

### Step 1: Create Core Composables

#### 1.1: Generic Debounced Computation

**File**: `src/lib/composables/core/use-debounced-computation.svelte.ts`

```typescript
import { debouncer } from '$lib/debounce.svelte';

/**
 * Core composable for debounced reactive computations
 *
 * Wraps the debouncer utility with a cleaner API for composables.
 *
 * @param getter - Reactive getter for the input value
 * @param compute - Function to compute output from input
 * @param delay - Debounce delay in milliseconds (default: 350)
 * @returns Object with computed value and computing state
 *
 * @example
 * const { value, isComputing } = useDebouncedComputation(
 *   () => seed,
 *   (seed) => calculateResult(seed),
 *   350
 * );
 */
export function useDebouncedComputation<T, U>(
  getter: () => T,
  compute: (value: T) => U,
  delay: number = 350
) {
  const result = $derived.by(debouncer(getter, compute, delay));

  return {
    get value() {
      return result.value;
    },
    get isComputing() {
      return result.debouncing;
    }
  };
}
```

#### 1.2: Seed Parser

**File**: `src/lib/composables/core/use-seed-parser.svelte.ts`

```typescript
import type { Seed } from '$lib/types';

/**
 * Parses form values into a Seed object
 *
 * @param formValues - The reactive form values
 * @returns Parsed seed object
 *
 * @example
 * const seed = useSeedParser(formValues);
 */
export function useSeedParser(formValues: Record<string, unknown>) {
  return $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });
}

/**
 * Parses form values into a Seed object with additional properties
 *
 * @param formValues - The reactive form values
 * @param additionalFields - Function to extract additional fields
 * @returns Extended seed object
 *
 * @example
 * const seed = useExtendedSeedParser(formValues, (fv) => ({
 *   risk: fv.risk as Risk,
 *   rows: fv.rows as number
 * }));
 */
export function useExtendedSeedParser<T extends Seed>(
  formValues: Record<string, unknown>,
  additionalFields: (fv: Record<string, unknown>) => Omit<T, keyof Seed>
) {
  const baseSeed = useSeedParser(formValues);
  const additional = $derived(additionalFields(formValues));

  return $derived<T>({
    ...baseSeed,
    ...additional
  } as T);
}
```

#### 1.3: Float Generation

**File**: `src/lib/composables/core/use-float-generation.svelte.ts`

```typescript
import { FloatGenerator } from '$lib/generator/FloatGenerator';
import type { Seed } from '$lib/types';

/**
 * Generates a float from seed (used by most games)
 *
 * @param seed - The reactive seed
 * @returns Float generator instance
 *
 * @example
 * const float = useFloatGeneration(seed);
 */
export function useFloatGeneration(seed: Seed) {
  return $derived(FloatGenerator(seed));
}
```

### Step 2: Create Game-Specific Composables

#### 2.1: Dice Roll Composable

**File**: `src/lib/composables/games/use-dice-roll.svelte.ts`

```typescript
import { FloatGenerator } from '$lib/generator/FloatGenerator';
import { useDebouncedComputation } from '../core/use-debounced-computation.svelte';
import { useSeedParser } from '../core/use-seed-parser.svelte';

/**
 * Dice roll composable
 *
 * Handles the business logic for calculating a dice roll result.
 *
 * @param formValues - Reactive form values
 * @returns Object with roll number and computing state
 *
 * @example
 * const { rollNumber, isCalculating } = useDiceRoll(formValues);
 */
export function useDiceRoll(formValues: Record<string, unknown>) {
  const seed = useSeedParser(formValues);

  const { value: rollNumber, isComputing: isCalculating } = useDebouncedComputation(
    () => seed,
    (seed) => {
      const floatGenerator = FloatGenerator(seed);
      const float = floatGenerator.next().value;
      return Math.floor(float * 10001) / 100;
    },
    350
  );

  return {
    get rollNumber() {
      return rollNumber;
    },
    get isCalculating() {
      return isCalculating;
    }
  };
}
```

#### 2.2: Wheel Spin Composable

**File**: `src/lib/composables/games/use-wheel-spin.svelte.ts`

```typescript
import { FloatGenerator } from '$lib/generator/FloatGenerator';
import { useDebouncedComputation } from '../core/use-debounced-computation.svelte';
import { useExtendedSeedParser } from '../core/use-seed-parser.svelte';
import type { WheelSeed, Risk } from '$lib/types';
import paylines from '$lib/assets/wheel-paylines.json';

/**
 * Wheel spin composable
 *
 * Handles the business logic for calculating a wheel spin result.
 *
 * @param formValues - Reactive form values
 * @returns Object with payout, payline, and computing state
 */
export function useWheelSpin(formValues: Record<string, unknown>) {
  const seed = useExtendedSeedParser<WheelSeed>(formValues, (fv) => ({
    risk: fv.risk as Risk,
    segments: fv.segments as number
  }));

  const payline = $derived(paylines[seed.segments as unknown as keyof typeof paylines][seed.risk]);

  const distinctPayline = $derived([...new Set(payline.slice(0))].sort((a, b) => a - b));

  const { value: payout, isComputing } = useDebouncedComputation(
    () => seed,
    (seed) => {
      const floatGenerator = FloatGenerator(seed);
      const float = floatGenerator.next().value;
      return payline[Math.floor(float * seed.segments)];
    },
    350
  );

  return {
    get payout() {
      return payout;
    },
    get payline() {
      return distinctPayline;
    },
    get isCalculating() {
      return isComputing;
    }
  };
}
```

#### 2.3: Plinko Path Composable

**File**: `src/lib/composables/games/use-plinko-path.svelte.ts`

```typescript
import { FloatGenerator } from '$lib/generator/FloatGenerator';
import { useDebouncedComputation } from '../core/use-debounced-computation.svelte';
import { useExtendedSeedParser } from '../core/use-seed-parser.svelte';
import type { PlinkoSeed, Risk } from '$lib/types';
import { getDirections, getPayout } from '$lib/util/plinko';
import paylines from '$lib/assets/plinko-paylines.json';

/**
 * Plinko path composable
 *
 * Handles the business logic for calculating a plinko ball path and payout.
 *
 * @param formValues - Reactive form values
 * @returns Object with payout, payline, and computing state
 */
export function usePlinkoPath(formValues: Record<string, unknown>) {
  const seed = useExtendedSeedParser<PlinkoSeed>(formValues, (fv) => ({
    risk: fv.risk as Risk,
    rows: fv.rows as number
  }));

  const payline = $derived([
    ...new Set(paylines[seed.rows as unknown as keyof typeof paylines][seed.risk])
  ]);

  const { value: payout, isComputing } = useDebouncedComputation(
    () => seed,
    (seed) => {
      const floatGenerator = FloatGenerator(seed);
      const directions = getDirections(floatGenerator, seed.rows);
      return getPayout(seed.risk, seed.rows, directions);
    },
    350
  );

  return {
    get payout() {
      return payout;
    },
    get payline() {
      return payline;
    },
    get isCalculating() {
      return isComputing;
    }
  };
}
```

### Step 3: Refactor Components to Use Composables

#### 3.1: Refactored DiceResult Component

**Before** (40 lines with logic):

```svelte
<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const rollNumberDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return Math.floor(floatGenerator.next().value * 10001) / 100;
      },
      350
    )
  );
</script>

{#if rollNumberDebounced.debouncing}
  <Loader />
{:else}
  <div data-testid="dice-result" class="text-center text-base">
    <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">Roll result</p>
    <div
      class="inline-flex min-w-[100px] flex-col items-center justify-center rounded border-2 border-green-500 bg-green-50 px-6 py-4 shadow-lg dark:border-green-400 dark:bg-green-900/20"
    >
      <span class="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {rollNumberDebounced.value!.toFixed(2)}
      </span>
    </div>
  </div>
{/if}
```

**After** (20 lines, pure UI):

```svelte
<script lang="ts">
  import { useDiceRoll } from '$lib/composables/games/use-dice-roll.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues } = $props();
  const { rollNumber, isCalculating } = useDiceRoll(formValues);
</script>

{#if isCalculating}
  <Loader />
{:else}
  <div data-testid="dice-result" class="text-center text-base">
    <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">Roll result</p>
    <div
      class="inline-flex min-w-[100px] flex-col items-center justify-center rounded border-2 border-green-500 bg-green-50 px-6 py-4 shadow-lg dark:border-green-400 dark:bg-green-900/20"
    >
      <span class="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {rollNumber!.toFixed(2)}
      </span>
    </div>
  </div>
{/if}
```

**Benefits:**

- ✅ 50% less code in component
- ✅ Logic is testable independently
- ✅ Component is pure UI
- ✅ Composable is reusable

### Step 4: Create Index Files

**File**: `src/lib/composables/core/index.ts`

```typescript
/**
 * Core Composables
 *
 * Reusable composables for common patterns.
 */
export * from './use-debounced-computation.svelte';
export * from './use-seed-parser.svelte';
export * from './use-float-generation.svelte';
```

**File**: `src/lib/composables/games/index.ts`

```typescript
/**
 * Game Composables
 *
 * Game-specific composables for business logic.
 */
export * from './use-dice-roll.svelte';
export * from './use-wheel-spin.svelte';
export * from './use-plinko-path.svelte';
// Add more as we create them
```

**File**: `src/lib/composables/index.ts`

```typescript
/**
 * Composables Module
 *
 * Re-exports all composables for convenient importing.
 *
 * Usage:
 * - Specific: import { useDiceRoll } from '$lib/composables/games/use-dice-roll.svelte';
 * - Convenient: import { useDiceRoll } from '$lib/composables';
 */
export * from './core';
export * from './games';
```

### Step 5: Create Tests for Composables

**File**: `tests/lib/composables/games/use-dice-roll.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { useDiceRoll } from '$lib/composables/games/use-dice-roll.svelte';

describe('useDiceRoll', () => {
  it('should calculate dice roll from seed', () => {
    const formValues = {
      clientseed: 'test-client-seed',
      serverseed: 'test-server-seed',
      nonce: 0
    };

    const { rollNumber, isCalculating } = useDiceRoll(formValues);

    // Initially should be calculating
    expect(isCalculating).toBe(true);

    // After debounce, should have value
    // (Note: In real test, would need to handle async debouncing)
  });
});
```

---

## 📋 Implementation Order (ALL 31 Games)

### Phase A: Core Infrastructure (30 min)

1. Create `src/lib/composables/` directory structure
2. Create `core/use-debounced-computation.svelte.ts`
3. Create `core/use-seed-parser.svelte.ts`
4. Create `core/use-float-generation.svelte.ts`
5. Create index files for all game categories

**Files created**: 3 core + 6 index files = 9 files

---

### Phase B: Simple Games (1.5 hours) - 5 games

1. `use-dice-roll.svelte.ts` + refactor `DiceResult.svelte`
2. `use-flip-outcome.svelte.ts` + refactor `FlipResult.svelte`
3. `use-limbo-multiplier.svelte.ts` + refactor `LimboResult.svelte`
4. `use-wheel-spin.svelte.ts` + refactor `WheelResult.svelte`
5. `use-rps-outcome.svelte.ts` + refactor `RockPaperScissorsResult.svelte`

**Verify**: All 5 components refactored, tests passing

---

### Phase C: Grid/Position Games (2 hours) - 8 games

1. `use-plinko-path.svelte.ts` + refactor `PlinkoResult.svelte`
2. `use-roulette-number.svelte.ts` + refactor `RouletteResult.svelte`
3. `use-keno-numbers.svelte.ts` + refactor `KenoResult.svelte`
4. `use-mines-positions.svelte.ts` + refactor `MinesResult.svelte`
5. `use-moles-positions.svelte.ts` + refactor `MolesResult.svelte`
6. `use-diamonds-positions.svelte.ts` + refactor `DiamondsResult.svelte`
7. `use-dragon-tower.svelte.ts` + refactor `DragonTowerResult.svelte`
8. `use-snakes-rolls.svelte.ts` + refactor `SnakesResult.svelte`

**Verify**: All 8 components refactored, tests passing

---

### Phase D: Skill/Target Games (1.5 hours) - 6 games

1. `use-darts-shot.svelte.ts` + refactor `DartsResult.svelte`
2. `use-chicken-run.svelte.ts` + refactor `ChickenResult.svelte`
3. `use-pump-action.svelte.ts` + refactor `PumpResult.svelte`
4. `use-drill-hit.svelte.ts` + refactor `DrillResult.svelte`
5. `use-bars-selection.svelte.ts` + refactor `BarsResult.svelte`
6. `use-cases-opening.svelte.ts` + refactor `CasesResult.svelte`

**Verify**: All 6 components refactored, tests passing

---

### Phase E: Card/Collection Games (2 hours) - 6 games

1. `use-card-shuffle.svelte.ts` (shared utility for all card games)
2. `use-tarot-draw.svelte.ts` + refactor `TarotsResult.svelte`
3. `use-packs-opening.svelte.ts` + refactor `PacksResult.svelte`
4. `use-baccarat-hand.svelte.ts` + refactor `BaccaratResult.svelte`
5. `use-blackjack-hand.svelte.ts` + refactor `BlackjackResult.svelte`
6. `use-hilo-hand.svelte.ts` + refactor `HiloResult.svelte`
7. `use-video-poker-hand.svelte.ts` + refactor `VideoPokerResult.svelte`

**Verify**: All 6 components refactored, tests passing

---

### Phase F: Slot Games (1.5 hours) - 4 games

1. `use-slot-spin.svelte.ts` (shared slot logic)
2. `use-blue-samurai-spin.svelte.ts` + refactor `BlueSamuraiResult.svelte`
3. `use-scarab-spins-spin.svelte.ts` + refactor `ScarabSpinsResult.svelte`
4. `use-tome-of-life-spin.svelte.ts` + refactor `TomeOfLifeResult.svelte`
5. Refactor `SlotResult.svelte` (parent component)

**Verify**: All 4 slot components refactored, tests passing

---

### Phase G: Multiplayer Games (1 hour) - 2 games

1. `use-crash-multiplier.svelte.ts` + refactor `CrashResult.svelte`
2. `use-slide-multiplier.svelte.ts` + refactor `SlideResult.svelte`

**Verify**: Both components refactored, tests passing

---

### Summary

- **Total Time**: 6-8 hours
- **Total Composables**: 31 game composables + 3 core = 34 files
- **Total Components Refactored**: 31 result components
- **Total Tests**: 31+ composable tests

---

## ✅ Verification Checklist

### Directory Structure

- [ ] `src/lib/composables/` directory created
- [ ] `src/lib/composables/core/` subdirectory created
- [ ] `src/lib/composables/games/simple/` subdirectory created
- [ ] `src/lib/composables/games/grid/` subdirectory created
- [ ] `src/lib/composables/games/skill/` subdirectory created
- [ ] `src/lib/composables/games/cards/` subdirectory created
- [ ] `src/lib/composables/games/slots/` subdirectory created
- [ ] `src/lib/composables/games/multiplayer/` subdirectory created

### Core Composables (3 files)

- [ ] `core/use-debounced-computation.svelte.ts` created
- [ ] `core/use-seed-parser.svelte.ts` created
- [ ] `core/use-float-generation.svelte.ts` created

### Game Composables (31 files)

- [ ] Simple games (5) - all composables created
- [ ] Grid games (8) - all composables created
- [ ] Skill games (6) - all composables created
- [ ] Card games (6) - all composables created
- [ ] Slot games (4) - all composables created
- [ ] Multiplayer games (2) - all composables created

### Components Refactored (31 components)

- [ ] All 31 Result components refactored to use composables
- [ ] All components reduced to pure UI (50%+ less code)
- [ ] No business logic remaining in components

### Index Files

- [ ] `composables/index.ts` created
- [ ] `composables/core/index.ts` created
- [ ] `composables/games/index.ts` created
- [ ] Category-specific index files created

### Quality Checks

- [ ] TypeScript compilation passes
- [ ] All existing tests still pass (31+ component tests)
- [ ] No runtime errors in dev mode
- [ ] No console errors or warnings
- [ ] Components are simpler and more focused
- [ ] Logic is extracted to testable composables

---

## 🎯 Success Criteria

- ✅ **All 31 components** refactored (not just 5)
- ✅ **34 composables created** (31 game + 3 core)
- ✅ Components reduced to pure UI (50%+ less code)
- ✅ Business logic extracted to testable composables
- ✅ Reusable patterns established (shared card shuffle, slot spin)
- ✅ No breaking changes (all 31+ existing tests pass)
- ✅ Clear documentation of composable patterns
- ✅ Foundation ready for Phase 3 (domain layer)
- ✅ Organized by game category for easy navigation

---

## 🚀 Next Phase

After Phase 2 completes, Phase 3 will:

1. Extract pure functions from composables
2. Create domain layer (`src/lib/domain/games/`)
3. Move game logic (dice calculation, payout, etc.) to domain
4. Composables become thin wrappers around domain functions

---

## 📝 Notes

### Implementation Strategy

- **Start with simple games** (Dice, Flip) to establish pattern
- **Work in batches** by game category for consistency
- **Verify after each phase** - run tests, check TypeScript
- **Composables should be small and focused** - one responsibility
- **Don't extract domain logic yet** (that's Phase 3)
- **Keep existing tests passing** throughout all changes
- **Document patterns** for team consistency

### Common Patterns to Follow

1. **Seed parsing**: Use `useSeedParser()` or `useExtendedSeedParser()`
2. **Computation**: Use `useDebouncedComputation()` for expensive operations
3. **Return values**: Always return getters for reactivity
4. **Naming**: `use-{game}-{action}.svelte.ts` format
5. **Testing**: Create corresponding test for each composable

### Shared Composables to Create

- `use-card-shuffle.svelte.ts` - Reused by all 4 card games
- `use-slot-spin.svelte.ts` - Reused by all 4 slot games
- These reduce duplication and ensure consistency

### Quality Gates

After each phase (B-G), verify:

- ✅ All components in that category refactored
- ✅ Tests passing for those games
- ✅ No TypeScript errors
- ✅ No console warnings in dev mode
- ✅ Git commit with phase completion message

### Total Deliverables

- **34 composable files** (31 games + 3 core)
- **31 refactored components** (all result components)
- **8 index files** (for re-exports)
- **31+ tests** (one per composable minimum)
- **README.md** documenting patterns

This is a comprehensive refactoring covering 100% of game result components.
