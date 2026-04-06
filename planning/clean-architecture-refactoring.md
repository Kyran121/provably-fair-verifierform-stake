# Clean Architecture Refactoring Plan

## 📊 Current State Assessment

### Strengths
- ✅ Well-organized game system with clear `GameDefinition` pattern
- ✅ Modern Svelte 5 with runes (reactive, performant)
- ✅ Type-safe with TypeScript strict mode
- ✅ Good separation between library and application

### Areas for Improvement
- ⚠️ **Mixed concerns** in components (business logic + presentation)
- ⚠️ **Utility organization** could be more modular and testable
- ⚠️ **Constants file** is too large and mixed (UI + game config)
- ⚠️ **Inconsistent patterns** across game components
- ⚠️ **Limited composability** - logic tied to components

---

## 🎯 Refactoring Strategy

Following **Clean Architecture** principles for frontend:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Components - UI only, no logic)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Application Layer (Composables)    │
│  (Business logic, state management)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Domain Layer (Core)             │
│  (Pure functions, types, entities)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Infrastructure Layer               │
│  (Generators, crypto, external APIs)    │
└─────────────────────────────────────────┘
```

---

## 📋 Detailed Refactoring Plan

### Phase 1: Reorganize Constants & Configuration

#### Current Issues
- `src/lib/constants.ts` (lines 1-110) mixes UI colors with game configuration
- Hard to test, maintain, or reuse

#### Solution
```
src/lib/
├── config/
│   ├── ui/
│   │   ├── colors.ts          # UI colors (BG_COLOR, TEXT_HIGHLIGHT_COLOR)
│   │   └── theme.ts           # Theme configuration
│   └── games/
│       ├── darts.config.ts    # DARTS_COLOR_TO_MULTI
│       ├── dragon-tower.config.ts  # DRAGON_TOWER_LEVEL_MAP
│       ├── snakes.config.ts   # SNAKES_MULTIPLIER_SHIFT_MAP
│       ├── pump.config.ts     # PUMP_DIFFICULTY_TO_SLICE
│       ├── chicken.config.ts  # CHICKEN_DIFFICULTY_TO_SLICE
│       └── multiplayer.config.ts  # CRASH_SEED, SLIDE_SEEDS
```

#### Benefits
- Single Responsibility Principle
- Easier to test game configs independently
- Better tree-shaking
- Clear separation of UI vs domain concerns

---

### Phase 2: Extract Business Logic to Composables/Hooks

#### Current Issue
Components like `src/lib/games/dice/DiceResult.svelte` (lines 1-41) mix:
- Data transformation (lines 9-13)
- Business logic (lines 15-24)
- UI rendering (lines 27-40)

#### Solution
Create Svelte composables (`.svelte.ts` files):

```
src/lib/composables/
├── use-dice-roll.svelte.ts
├── use-wheel-spin.svelte.ts
├── use-card-shuffle.svelte.ts
├── use-float-generation.svelte.ts
└── core/
    ├── use-debounced-computation.svelte.ts  # Generic debouncer
    └── use-seed-parser.svelte.ts
```

#### Example Refactor

**Before** (`DiceResult.svelte`):
```svelte
<script lang="ts">
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
```

**After**:
```svelte
<!-- DiceResult.svelte -->
<script lang="ts">
  import { useDiceRoll } from '$lib/composables/use-dice-roll.svelte';

  const { formValues } = $props();
  const { rollNumber, isCalculating } = useDiceRoll(formValues);
</script>

{#if isCalculating}
  <Loader />
{:else}
  <DiceResultDisplay value={rollNumber} />
{/if}
```

```typescript
// src/lib/composables/use-dice-roll.svelte.ts
import { FloatGenerator } from '$lib/generator/FloatGenerator';
import { useDebouncedComputation } from './core/use-debounced-computation.svelte';
import { parseSeed } from '$lib/domain/seed';
import { calculateDiceRoll } from '$lib/domain/games/dice';

export function useDiceRoll(formValues: Record<string, unknown>) {
  const seed = $derived(parseSeed(formValues));

  const { value: rollNumber, isComputing: isCalculating } = useDebouncedComputation(
    () => seed,
    (seed) => calculateDiceRoll(FloatGenerator(seed)),
    350
  );

  return {
    get rollNumber() { return rollNumber; },
    get isCalculating() { return isCalculating; }
  };
}
```

```typescript
// src/lib/domain/games/dice.ts (Pure function)
export function calculateDiceRoll(floatGenerator: Generator<number>): number {
  return Math.floor(floatGenerator.next().value * 10001) / 100;
}
```

#### Benefits
- ✅ **Testable**: Pure functions easy to unit test
- ✅ **Reusable**: Composables can be used in multiple components
- ✅ **Single Responsibility**: Components only handle rendering
- ✅ **Maintainable**: Business logic centralized

---

### Phase 3: Create Domain Layer (Pure Functions)

#### Current Issue
- Business logic scattered across components
- Utilities like `src/lib/util/payout.ts` (lines 1-11) are good but not organized

#### Solution
```
src/lib/domain/
├── seed/
│   ├── types.ts              # Seed, SeedInput types
│   ├── parser.ts             # parseSeed(formValues)
│   └── validator.ts          # validateSeed(seed)
│
├── games/
│   ├── dice.ts               # calculateDiceRoll()
│   ├── wheel.ts              # calculateWheelPosition()
│   ├── plinko.ts             # calculatePlinkoPath()
│   ├── cards/
│   │   ├── shuffle.ts        # shuffleDeck()
│   │   ├── deck.ts           # createDeck(), getCard()
│   │   └── scoring.ts        # calculateBlackjackScore()
│   └── shared/
│       ├── payout.ts         # getPayout() - moved here
│       ├── float-to-range.ts # mapFloatToRange()
│       └── probability.ts    # calculateOdds()
│
└── crypto/
    ├── byte-generation.ts    # Move ByteGenerator logic
    └── float-generation.ts   # Move FloatGenerator logic
```

#### Key Principles
- **Pure functions only** - no side effects
- **Deterministic** - same input = same output
- **Framework-agnostic** - can be used anywhere
- **100% testable**

---

### Phase 4: Improve Component Structure

#### Current Structure
```
src/lib/games/dice/
├── index.ts              # GameDefinition
├── DiceResult.svelte     # Result display (mixed logic + UI)
├── DiceExplanation.svelte
└── DiceResultStep.svelte
```

#### Improved Structure
```
src/lib/games/dice/
├── index.ts                    # GameDefinition export
├── config.ts                   # Game-specific config
├── components/
│   ├── DiceResult.svelte       # Smart component (uses composable)
│   ├── DiceResultDisplay.svelte # Presentation component
│   ├── DiceExplanation.svelte
│   └── DiceResultStep.svelte
└── __tests__/
    ├── DiceResult.test.ts
    └── DiceResultDisplay.test.ts
```

#### Component Guidelines

**Smart Components** (Container):
- Use composables for logic
- Manage state
- Pass data to presentation components
- Minimal UI

**Presentation Components** (Dumb):
- Only `$props()` - no derived state
- Pure UI rendering
- No business logic
- Highly reusable

---

### Phase 5: Modernize Utilities

#### Current Issues
- `src/lib/debounce.svelte.ts` (lines 1-26) is game-specific
- Utilities mixed with framework code

#### Solution
```
src/lib/utils/
├── core/                      # Framework-agnostic
│   ├── array.ts              # chunk, partition, etc.
│   ├── math.ts               # clamp, round, etc.
│   ├── string.ts             # format, sanitize
│   └── functional.ts         # pipe, compose, memoize
│
├── svelte/                   # Svelte-specific
│   ├── debounce.svelte.ts    # Reactive debouncer
│   ├── effect-with-previous.svelte.ts
│   └── scroll.svelte.ts
│
└── validation/
    ├── zod-helpers.ts        # Reusable Zod schemas
    └── parsers.ts            # Safe parsing utilities
```

#### Refactor utilities

```typescript
// src/lib/utils/core/math.ts
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const roundToDecimals = (value: number, decimals: number): number =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

export const mapToRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
```

```typescript
// src/lib/utils/svelte/debounce.svelte.ts
import { untrack } from 'svelte';

export interface DebouncedResult<T> {
  value: T | null;
  isComputing: boolean;
}

export function useDebouncedComputation<T, U>(
  getter: () => T,
  compute: (value: T) => U,
  delay: number
): DebouncedResult<U> {
  // Implementation here
  // More descriptive naming
}
```

---

### Phase 6: Improve Type Safety

#### Current
- `src/lib/types.ts` - single large file

#### Improved
```
src/lib/types/
├── index.ts              # Re-exports all types
├── common.ts             # Shared types (Seed, FormValues)
├── games/
│   ├── dice.ts
│   ├── wheel.ts
│   ├── cards.ts
│   └── index.ts
├── ui.ts                 # Component props types
└── validation.ts         # Zod-related types
```

---

### Phase 7: Testing Strategy

#### Current
- Good coverage on generators
- Component tests exist but mix concerns

#### Improved Structure
```
tests/
├── unit/
│   ├── domain/           # Pure function tests (FAST)
│   │   ├── games/
│   │   └── seed/
│   └── utils/
├── integration/
│   └── composables/      # Composable tests
└── component/
    └── games/            # UI component tests
```

#### Testing Pyramid
- **70% Unit** - Pure functions (domain layer)
- **20% Integration** - Composables + domain
- **10% Component** - UI rendering

---

## 🚀 Implementation Priority

Recommended order:

1. **Phase 1: Constants** (Low risk, high impact)
   - Split constants into logical files
   - Update imports

2. **Phase 5: Utilities** (Foundation)
   - Extract pure utilities
   - Create reusable helpers

3. **Phase 3: Domain Layer** (Core value)
   - Extract business logic to pure functions
   - Add comprehensive tests

4. **Phase 2: Composables** (Enable clean components)
   - Create composable hooks
   - Encapsulate reactive logic

5. **Phase 4: Components** (Polish)
   - Refactor components to use composables
   - Split smart/dumb components

6. **Phase 6: Types** (Maintainability)
   - Reorganize type definitions

7. **Phase 7: Tests** (Quality)
   - Add missing tests
   - Improve coverage

---

## ✅ Expected Benefits

After refactoring:

1. **Testability**: 90%+ test coverage achievable
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Composables and utilities reusable across games
4. **Performance**: Better tree-shaking, smaller bundles
5. **Developer Experience**: Easier to find and modify code
6. **Type Safety**: Better IntelliSense and error detection
7. **Scalability**: Easy to add new games following patterns

---

## 📝 Next Steps

Choose one of the following:

1. **Start with Phase 1** (split constants) - quick win
2. **Show complete example** for one game (e.g., Dice) with all layers
3. **Create detailed migration guide** for the team
4. **Begin implementation** - select which phase to start with
