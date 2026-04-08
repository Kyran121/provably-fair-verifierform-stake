# Phase 2: Modernize Utilities - Detailed Implementation Plan

## 📋 Overview

**Goal**: Reorganize utility functions into a clean, testable structure with clear separation between framework-agnostic utilities and Svelte-specific reactive utilities.

**Impact**: ~14 utility files + 1 debounce file will be reorganized
**Estimated Time**: 2-3 hours
**Risk Level**: Low (pure functions, well-tested)

---

## 🎯 Objectives

1. **Separate framework-agnostic from Svelte-specific utilities**
2. **Organize utilities by function type** (array, math, color, etc.)
3. **Improve naming and documentation**
4. **Create reusable, composable utility functions**
5. **Foundation for domain layer** (Phase 3)

---

## 📊 Current State Analysis

### Current Utility Structure
```
src/lib/
├── util/
│   ├── payout.ts                 # Game payout calculation
│   ├── darts.ts                  # Darts game utilities
│   ├── drill.ts                  # Drill game utilities
│   ├── tarot.ts                  # Tarot card utilities
│   ├── packs.ts                  # Pack opening utilities
│   ├── bluesamurai.ts            # Blue Samurai game logic
│   ├── plinko.ts                 # Plinko calculation
│   ├── cards.ts                  # Card deck utilities
│   ├── color.ts                  # Color conversion utilities
│   ├── scarabspins-tomeoflife.ts # Slot game utilities
│   ├── array/
│   │   └── chunk.ts              # Array chunking
│   ├── shuffle-impl/
│   │   ├── fisherYates.ts        # Fisher-Yates shuffle
│   │   └── shuffle.ts            # Shuffle orchestrator
│   └── scroll-impl/
│       └── scrollToCenterVertically.ts  # Scroll utility
│
└── debounce.svelte.ts            # Reactive debouncer (Svelte-specific)
```

### Issues with Current Structure

1. **Mixed Concerns**: Game-specific logic in `util/` (should be in domain layer)
2. **Inconsistent Naming**: Some files use `-impl` suffix, some don't
3. **No Clear Organization**: Hard to find utilities by type
4. **Framework Mixing**: Svelte-specific debouncer at root level

---

## 🏗️ New File Structure

```
src/lib/
├── utils/                         # NEW: Renamed from 'util' for consistency
│   ├── index.ts                   # Re-export common utilities
│   │
│   ├── core/                      # Framework-agnostic utilities
│   │   ├── array.ts               # Array utilities (chunk, partition, etc.)
│   │   ├── math.ts                # Math utilities (clamp, round, etc.)
│   │   ├── color.ts               # Color utilities (hex↔rgb, distance)
│   │   └── functional.ts          # Functional utilities (pipe, compose)
│   │
│   ├── svelte/                    # Svelte-specific utilities
│   │   ├── debounce.svelte.ts     # Reactive debouncer
│   │   └── scroll.svelte.ts       # Scroll utilities
│   │
│   └── validation/                # Validation utilities (future)
│       └── parsers.ts             # Safe parsing helpers
│
└── domain/                        # NEW: Domain logic (Phase 3)
    └── games/                     # Game-specific business logic
        ├── shared/
        │   ├── payout.ts          # Generic payout calculation
        │   ├── shuffle.ts         # Card shuffling logic
        │   └── deck.ts            # Deck creation/management
        ├── darts.ts               # Darts game logic
        ├── drill.ts               # Drill game logic
        ├── tarot.ts               # Tarot game logic
        ├── packs.ts               # Packs game logic
        ├── bluesamurai.ts         # Blue Samurai logic
        ├── plinko.ts              # Plinko calculation
        └── scarabspins-tomeoflife.ts  # Slot game logic
```

---

## 📝 Step-by-Step Implementation

### Step 1: Create New Directory Structure

```bash
mkdir -p src/lib/utils/core
mkdir -p src/lib/utils/svelte
mkdir -p src/lib/utils/validation
mkdir -p src/lib/domain/games/shared
```

### Step 2: Move and Organize Framework-Agnostic Utilities

#### 2.1: Create Array Utilities

**File**: `src/lib/utils/core/array.ts`

```typescript
/**
 * Array Utilities
 *
 * Pure, framework-agnostic array manipulation functions.
 */

/**
 * Splits an array into chunks of specified size
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }

  return Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

/**
 * Partitions array into two based on predicate
 *
 * @example
 * partition([1, 2, 3, 4], x => x % 2 === 0) // [[2, 4], [1, 3]]
 */
export function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];

  arr.forEach((item) => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });

  return [truthy, falsy];
}

/**
 * Shuffles array in place (mutates original)
 *
 * @example
 * shuffleInPlace([1, 2, 3, 4])
 */
export function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Creates a shuffled copy (does not mutate)
 *
 * @example
 * shuffle([1, 2, 3, 4])
 */
export function shuffle<T>(arr: T[]): T[] {
  return shuffleInPlace([...arr]);
}
```

#### 2.2: Create Math Utilities

**File**: `src/lib/utils/core/math.ts`

```typescript
/**
 * Math Utilities
 *
 * Pure mathematical functions for common operations.
 */

/**
 * Clamps a value between min and max
 *
 * @example
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds number to specified decimal places
 *
 * @example
 * roundToDecimals(3.14159, 2) // 3.14
 */
export function roundToDecimals(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Maps value from one range to another
 *
 * @example
 * mapToRange(5, 0, 10, 0, 100) // 50
 */
export function mapToRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Linearly interpolates between two values
 *
 * @example
 * lerp(0, 10, 0.5) // 5
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Checks if number is within range (inclusive)
 *
 * @example
 * inRange(5, 0, 10) // true
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
```

#### 2.3: Move Color Utilities

**File**: `src/lib/utils/core/color.ts`

```typescript
import type { RGB } from '$lib/types';

/**
 * Color Utilities
 *
 * Pure functions for color conversion and manipulation.
 */

/**
 * Converts hex color to RGB array
 *
 * @example
 * hexToRgb('#ff0000') // [255, 0, 0]
 */
export function hexToRgb(hex: string): RGB {
  const sanitized = hex.replace(/^#/, '');

  if (sanitized.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return [r, g, b];
}

/**
 * Converts RGB array to hex color
 *
 * @example
 * rgbToHex([255, 0, 0]) // '#ff0000'
 */
export function rgbToHex([r, g, b]: RGB): string {
  const toHex = (value: number): string => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Calculates Euclidean distance between two RGB colors
 *
 * @example
 * colorDistance([255, 0, 0], [0, 255, 0]) // 360.62...
 */
export function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}

/**
 * Finds the closest color from a list to a target color
 *
 * @example
 * getClosestColor('#ff0000', ['#00ff00', '#ff00ff']) // '#ff00ff'
 */
export function getClosestColor(targetHex: string, colorHexList: string[]): string {
  const targetRgb = hexToRgb(targetHex);

  let closestHex = colorHexList[0];
  let minDistance = colorDistance(targetRgb, hexToRgb(closestHex));

  for (let i = 1; i < colorHexList.length; i++) {
    const currentHex = colorHexList[i];
    const currentDistance = colorDistance(targetRgb, hexToRgb(currentHex));

    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      closestHex = currentHex;
    }
  }

  return closestHex;
}
```

### Step 3: Move Svelte-Specific Utilities

#### 3.1: Move Debouncer

**File**: `src/lib/utils/svelte/debounce.svelte.ts`

```typescript
import { untrack } from 'svelte';

/**
 * Svelte Debounce Utilities
 *
 * Reactive debouncing for Svelte 5 runes.
 */

/**
 * Result of a debounced computation
 */
export interface DebouncedResult<T> {
  /** The computed value, or null if still computing */
  value: T | null;
  /** Whether the computation is currently debouncing */
  isComputing: boolean;
}

/**
 * Creates a debounced reactive computation
 *
 * @param getter - Reactive getter for the input value
 * @param compute - Function to compute output from input
 * @param delay - Debounce delay in milliseconds
 * @returns A getter function returning the debounced result
 *
 * @example
 * const result = $derived.by(
 *   debouncer(() => inputValue, (val) => expensiveOperation(val), 350)
 * );
 */
export function debouncer<T, U>(
  getter: () => T,
  compute: (value: T) => U,
  delay: number
): () => DebouncedResult<U> {
  let current = $state<DebouncedResult<U>>({ value: null, isComputing: true });

  const debouncedUpdate = createDebounce(
    (v: T) => (current = { value: compute(v), isComputing: false }),
    delay
  );

  $effect(() => {
    untrack(() => (current.isComputing = true));
    debouncedUpdate(getter());
  });

  return () => current;
}

/**
 * Creates a debounced function
 */
function createDebounce<T>(fn: (value: T) => void, delay: number): (value: T) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (value: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(value), delay);
  };
}
```

#### 3.2: Move Scroll Utilities

**File**: `src/lib/utils/svelte/scroll.svelte.ts`

```typescript
/**
 * Svelte Scroll Utilities
 *
 * DOM scroll utilities for Svelte components.
 */

/**
 * Scrolls an element to center vertically within its container
 *
 * @param element - The element to scroll into view
 * @param container - The scrollable container (defaults to parent)
 * @param smooth - Whether to use smooth scrolling
 * @param timeout - Timeout in milliseconds (0 = no timeout)
 */
export function scrollToCenterVertically(
  element: HTMLElement,
  container?: HTMLElement,
  smooth = true,
  timeout = 0
): void {
  const scrollContainer = container ?? element.parentElement;
  if (!scrollContainer) return;

  const elementRect = element.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();

  const elementCenter = elementRect.top + elementRect.height / 2;
  const containerCenter = containerRect.top + containerRect.height / 2;
  const scrollOffset = elementCenter - containerCenter;

  const scrollTo = () => {
    scrollContainer.scrollBy({
      top: scrollOffset,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };

  if (timeout > 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    scrollTo();
    clearTimeout(timeoutId);
  } else {
    scrollTo();
  }
}
```

### Step 4: Create Index Files for Re-exports

**File**: `src/lib/utils/core/index.ts`

```typescript
/**
 * Core Utilities
 *
 * Framework-agnostic utility functions.
 */
export * from './array';
export * from './math';
export * from './color';
```

**File**: `src/lib/utils/svelte/index.ts`

```typescript
/**
 * Svelte Utilities
 *
 * Svelte-specific reactive utilities.
 */
export * from './debounce.svelte';
export * from './scroll.svelte';
```

**File**: `src/lib/utils/index.ts`

```typescript
/**
 * Utilities Module
 *
 * Re-exports commonly used utilities for convenience.
 *
 * Usage:
 * - Specific: import { chunk } from '$lib/utils/core/array';
 * - Convenient: import { chunk, debouncer } from '$lib/utils';
 */

// Core utilities (framework-agnostic)
export * from './core';

// Svelte utilities (framework-specific)
export * from './svelte';
```

### Step 5: Move Game-Specific Logic to Domain Layer

This will be detailed in **Phase 3**, but we'll prepare the structure:

**File**: `src/lib/domain/games/shared/payout.ts`

```typescript
/**
 * Payout Calculation
 *
 * Generic payout lookup based on float value and payline configuration.
 */

export interface PaylineEntry {
  min: number;
  multiplier: number;
}

/**
 * Calculates payout based on float value and payline
 *
 * @param payline - Array of min thresholds and multipliers (sorted desc by min)
 * @param float - The generated float value [0, 1)
 * @returns The multiplier for this float value
 *
 * @example
 * getPayout([{ min: 0.9, multiplier: 10 }, { min: 0.5, multiplier: 2 }], 0.95) // 10
 */
export function getPayout(payline: PaylineEntry[], float: number): number {
  let payout = 0;

  for (const { min, multiplier } of payline) {
    if (float >= min) {
      payout = multiplier;
      break;
    }
  }

  return payout;
}
```

### Step 6: Update Import Statements

Update all files that import from:
- `$lib/util/` → `$lib/utils/core/` or `$lib/domain/games/`
- `$lib/debounce.svelte` → `$lib/utils/svelte/debounce.svelte`

### Step 7: Remove Old Files

```bash
rm -rf src/lib/util
rm src/lib/debounce.svelte.ts
```

---

## ✅ Verification Checklist

- [ ] New `src/lib/utils/` structure created
- [ ] Core utilities (array, math, color) created
- [ ] Svelte utilities (debounce, scroll) moved
- [ ] Domain layer structure prepared
- [ ] Import statements updated
- [ ] Old files removed
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] No runtime errors
- [ ] Documentation added (JSDoc)

---

## 📦 Implementation Order

1. **Create directory structure** - 2 min
2. **Create core utilities** (array, math, color) - 30 min
3. **Move Svelte utilities** (debounce, scroll) - 15 min
4. **Create index files** - 5 min
5. **Prepare domain structure** - 10 min
6. **Update imports** - 30-45 min
7. **Remove old files** - 2 min
8. **Run tests and verify** - 10 min
9. **Git commit** - 5 min

**Total Time**: ~2 hours

---

## 🎯 Success Criteria

- ✅ Clear separation: core vs Svelte utilities
- ✅ Framework-agnostic utilities are pure functions
- ✅ Improved discoverability (organized by type)
- ✅ Better naming and documentation
- ✅ Foundation for domain layer (Phase 3)
- ✅ All tests passing
- ✅ No breaking changes

---

## 🚀 Next Steps After Phase 2

- [ ] Begin Phase 3: Create domain layer with pure game logic
- [ ] Move all game-specific utilities to domain layer
- [ ] Extract shuffle logic to domain/games/shared/
- [ ] Create comprehensive unit tests for domain functions

---

## 📝 Notes

- Phase 2 focuses on **organization** more than **refactoring**
- Game-specific logic (darts, packs, etc.) moves in Phase 3
- This phase sets foundation for clean architecture
- Pure functions are easier to test and maintain
