# Clean Architecture Refactoring - Implementation Roadmap

## 📋 Overview

This document provides the **actual implementation sequence** for the clean architecture refactoring, aligned with the master plan in [clean-architecture-refactoring.md](clean-architecture-refactoring.md).

**Last Updated**: 2026-04-16

---

## 🎯 **Executive Summary: Current State**

### **Overall Progress: ~50% Complete**

**Major Discovery**: The roadmap was significantly outdated. Analysis reveals we're **much further along** than previously documented:

| Metric | Status |
|--------|--------|
| **Overall Completion** | ~50% (was tracked as ~15%) |
| **Time Invested** | ~8-10 hours |
| **Time Remaining** | ~16-23 hours (updated after component review) |
| **Architecture Quality** | Strong foundation already in place |

### **Phase Completion Summary**

| Phase | Completion | Status |
|-------|-----------|--------|
| Phase 1: Constants | 100% | ✅ Complete |
| Phase 2: Composables | 70% | ⚠️ Nearly done - needs tests/docs |
| Phase 4: Components | 75% | ⚠️ Pattern already implemented |
| Phase 3: Domain Layer | 40% | ⚠️ Logic exists, needs reorganization |
| Phase 5: Utilities | 0% | ❌ File reorganization pending |
| Phase 6: Types | 0% | ❌ Splitting pending |
| Phase 7: Testing | 0% | ❌ Not started |

### **Key Findings**

✅ **What's Working Well:**
- Excellent composables architecture (30+ files)
- Smart/dumb component separation fully implemented
- Pure domain logic exists and is well-structured
- Type-safe throughout with TypeScript + Zod
- Scales beautifully across 30+ games

⚠️ **What Needs Work:**
- File organization doesn't match clean architecture conventions
- No test coverage yet
- Types in single monolithic file
- Generic utilities mixed with game-specific logic

🎯 **Next Priority**: Phase 3 - Domain Layer Reorganization (2-3 hours)

---

## 🎯 Master Plan Phases (Logical Grouping)

The master plan organizes refactoring into 7 logical phases:

| Phase | Name | Focus |
|-------|------|-------|
| **Phase 1** | Constants | Split monolithic constants into modular config |
| **Phase 2** | Composables | Extract business logic from components |
| **Phase 3** | Domain Layer | Create pure functions, organize utilities |
| **Phase 4** | Component Structure | Split smart/dumb components |
| **Phase 5** | Utilities | Modernize utility organization |
| **Phase 6** | Types | Reorganize type definitions |
| **Phase 7** | Testing | Improve test coverage and structure |

---

## 🚀 Recommended Implementation Order

Based on dependencies and risk, the master plan recommends this order:

### ✅ **Step 1: Phase 1 - Constants** (COMPLETED)
**Status**: ✅ Done (Commit: 82f6f82)
**Time**: ~1 hour
**Risk**: Low

**What was done:**
- Created `src/lib/config/` structure
- Separated UI colors from game configs
- Updated 40 import statements
- Removed legacy `constants.ts`

**Files**:
- Implementation: [phase-1-implementation-plan.md](phase-1-implementation-plan.md)
- Summary: [phase-1-completion-summary.md](phase-1-completion-summary.md)

---

### ⚠️ **Step 2: Phase 2 - Composables** (MOSTLY COMPLETE)
**Status**: ⚠️ ~70% Complete (Commit: 153e20d)
**Time**: ~3-4 hours (spent)
**Risk**: Low (major work done)
**Dependencies**: None

**What was done:**
- ✅ Created `src/lib/composables/` directory structure
- ✅ Implemented **30+ composables** across all game categories:
  - Core: `use-float-generation`, `use-seed-parser`, `use-extended-seed-parser`, `use-debounced-computation`, `use-scroll-reset`
  - Simple games: `use-dice-roll`, `use-coin-flip`, `use-limbo`, `use-wheel-spin`, `use-rps`
  - Grid games: `use-plinko-path`, `use-roulette-spin`, `use-keno-numbers`, `use-mines-result`, etc.
  - Skill games: `use-darts-throw`, `use-chicken-escapes`, `use-pump-explodes`, etc.
  - Card games: `use-card-deck`, `use-baccarat-result`, `use-blackjack-game`, etc.
  - Slots: `use-blue-samurai`, `use-slot-result`
  - Multiplayer: `use-crash-result`, `use-slide-result`
- ✅ Components refactored to use composables (DiceResult.svelte, etc.)
- ✅ Reactive state management with `$derived` and debouncing
- ✅ Separation of business logic from UI

**Actual structure created:**
```
src/lib/composables/
├── core/
│   ├── use-float-generation.svelte.ts
│   ├── use-seed-parser.svelte.ts
│   ├── use-extended-seed-parser.svelte.ts
│   ├── use-debounced-computation.svelte.ts
│   └── use-scroll-reset.svelte.ts
└── games/
    ├── simple/     # 5 composables
    ├── grid/       # 10 composables
    ├── skill/      # 6 composables
    ├── cards/      # 7 composables
    ├── slots/      # 2 composables
    └── multiplayer/ # 2 composables
```

**What remains:**
- ❌ Add tests for composables
- ❌ Create formal documentation/examples
- ✅ **HIGH Priority refactoring completed** (2026-04-16)

**Component Refactoring Status** (Updated 2026-04-16):

✅ **HIGH Priority - COMPLETED** (All 6 components refactored):
- ✅ [BlueSamuraiExplanation.svelte](../src/lib/games/bluesamurai/BlueSamuraiExplanation.svelte) → `useBlueSamuraiExplanation()` composable
- ✅ [DartsMultiplierStep.svelte](../src/lib/games/darts/DartsMultiplierStep.svelte) → `useDartsMultiplierCalc()` composable
- ✅ [DartsExplanation.svelte](../src/lib/games/darts/DartsExplanation.svelte) → Moved data rebuilding to `{@const}` block
- ✅ [DragonTowerResult.svelte](../src/lib/games/dragontower/DragonTowerResult.svelte) → `useDragonTowerGrid()` composable
- ✅ [MinesExplanation.svelte](../src/lib/games/mines/MinesExplanation.svelte) → `useMinesExplanation()` composable
- ✅ [MolesExplanation.svelte](../src/lib/games/moles/MolesExplanation.svelte) → `useMolesExplanation()` composable

**New Composables Created**:
- `src/lib/composables/games/slots/use-bluesamurai-explanation.svelte.ts`
- `src/lib/composables/games/skill/use-darts-multiplier-calc.svelte.ts`
- `src/lib/composables/games/grid/use-dragontower-grid.svelte.ts`
- `src/lib/composables/games/grid/use-moles-explanation.svelte.ts`
- `src/lib/composables/games/grid/use-mines-explanation.svelte.ts`

✅ **MEDIUM Priority - COMPLETED** (8 components refactored):
- ✅ KenoResultStep → `useFisherYatesDisplay(40)`
- ✅ MinesResultStep → `useFisherYatesDisplay(25)`
- ✅ MolesResultStep → `useFisherYatesDisplay(7)`
- ✅ DragonTowerResultStep → `useFisherYatesDisplay(size)`
- ✅ VideoPokerResultStep → `useFisherYatesCardsDisplay()`
- ✅ ChickenResult → `useChickenResult()`
- ✅ WheelResultStep → `useWheelResult()`
- ✅ PlinkoExplanation → Fixed BG_COLOR comparison bug

**New Composables**:
- `use-fisheryates-display.svelte.ts` - Generic Fisher-Yates helper (reusable)
- `use-fisheryates-cards-display.svelte.ts` - Card deck variant
- `use-chicken-result.svelte.ts` - Death index & multiplier
- `use-wheel-result.svelte.ts` - Payline lookup

**LOW Priority** (11 components - DEFER):
- Simple display formulas (acceptable as-is): LimboResultStep, DiceResultStep, RouletteResultStep, etc.
- These are display-focused and show the calculation formula - no action needed

**Benefits achieved:**
- ✅ Components are simpler and focused on UI
- ✅ Business logic is reusable across components
- ✅ Clear separation: logic vs UI
- ✅ Excellent foundation for Phase 3 domain layer

---

### ⚠️ **Step 3: Phase 3 - Domain Layer** (REORGANIZATION NEEDED)
**Status**: ⚠️ ~40% Complete (Logic exists, needs restructuring)
**Time**: ~2-3 hours (reorganization only)
**Risk**: Low (just file moves + import updates)
**Dependencies**: Phase 2 (✅ complete)

**Current state:**
- ✅ Pure, framework-agnostic business logic **already exists**
- ✅ Crypto logic in `src/lib/generator/` (ByteGenerator, FloatGenerator, ChunkGenerator)
- ✅ Game utilities in `src/lib/util/` (27 files: darts, tarot, plinko, shuffle, payout, etc.)
- ❌ **Not organized** according to clean architecture structure

**Current structure:**
```
src/lib/
├── generator/              # ✅ Pure domain crypto logic
│   ├── ByteGenerator.ts
│   ├── FloatGenerator.ts
│   └── ChunkGenerator.ts
├── util/                   # ✅ Pure game domain logic (wrong location)
│   ├── payout.ts
│   ├── darts.ts
│   ├── tarot.ts
│   ├── plinko.ts
│   ├── shuffle.ts
│   ├── drill.ts
│   ├── packs.ts
│   └── [20+ more game utilities]
└── types.ts                # ✅ Domain entities
```

**Target structure:**
```
src/lib/domain/
├── crypto/
│   ├── byte-generation.ts    # (from generator/ByteGenerator.ts)
│   ├── float-generation.ts   # (from generator/FloatGenerator.ts)
│   └── chunk-generation.ts   # (from generator/ChunkGenerator.ts)
│
├── games/
│   ├── dice.ts
│   ├── wheel.ts
│   ├── plinko.ts             # (from util/plinko.ts)
│   ├── darts.ts              # (from util/darts.ts)
│   ├── tarot.ts              # (from util/tarot.ts)
│   ├── drill.ts              # (from util/drill.ts)
│   ├── packs.ts              # (from util/packs.ts)
│   └── shared/
│       ├── payout.ts         # (from util/payout.ts)
│       └── shuffle.ts        # (from util/shuffle.ts)
│
└── types/
    └── index.ts              # (from types.ts, or keep at root for now)
```

**Migration tasks:**
1. Move `src/lib/generator/*.ts` → `src/lib/domain/crypto/`
2. Move game-specific `src/lib/util/*.ts` → `src/lib/domain/games/`
3. Move shared utilities → `src/lib/domain/games/shared/`
4. Update all imports in composables (30+ files)
5. Update re-exports in `src/lib/domain/index.ts`

**Benefits:**
- ✅ Already has 100% testable pure functions
- ✅ Already framework-agnostic
- 🎯 Will have clear separation: domain vs infrastructure
- 🎯 Matches clean architecture conventions

**Next action**: Create migration script or manual file moves + import updates

---

### 📝 **Step 4: Phase 5 - Modernize Utilities** (FOUNDATION UTILITIES)
**Status**: 📋 Planned (file exists as phase-5-utilities-implementation-plan.md)
**Time**: ~2 hours
**Risk**: Low
**Dependencies**: None (can be done after Phase 1, before or parallel to Phase 2/3)

**Goals:**
- Organize generic utilities (not game-specific)
- Separate framework-agnostic from Svelte-specific
- Create reusable utility library

**Structure to create:**
```
src/lib/utils/
├── core/                      # Framework-agnostic
│   ├── array.ts              # chunk, partition, shuffle
│   ├── math.ts               # clamp, round, mapToRange
│   ├── color.ts              # hexToRgb, getClosestColor
│   └── functional.ts         # pipe, compose
│
├── svelte/                    # Svelte-specific
│   ├── debounce.svelte.ts    # (from src/lib/debounce.svelte.ts)
│   └── scroll.svelte.ts      # (from util/scroll-impl/)
│
└── validation/
    └── parsers.ts            # Safe parsing helpers
```

**What moves here:**
- `src/lib/debounce.svelte.ts` → `utils/svelte/debounce.svelte.ts`
- `src/lib/util/array/chunk.ts` → `utils/core/array.ts`
- `src/lib/util/color.ts` → `utils/core/color.ts`
- `src/lib/util/scroll-impl/` → `utils/svelte/scroll.svelte.ts`

**Note:** This is different from Phase 3 - Phase 3 handles **game-specific** utilities (domain), Phase 5 handles **generic** utilities.

**Implementation plan**: [phase-5-utilities-implementation-plan.md](phase-5-utilities-implementation-plan.md) ✅ *Already exists*

---

### ⚠️ **Step 5: Phase 4 - Component Structure** (MOSTLY COMPLETE)
**Status**: ⚠️ ~75% Complete (Pattern already implemented)
**Time**: ~1-2 hours (cleanup remaining)
**Risk**: Low
**Dependencies**: Phase 2 (✅ complete)

**What was done:**
- ✅ Components refactored to use composables across all 30+ games
- ✅ Smart/dumb component separation **already implemented**
- ✅ Smart components use composables for state management
- ✅ Presentation components are pure UI (layout components)
- ✅ Clear component organization per game

**Current structure (Example: Dice):**
```
src/lib/games/dice/
├── index.ts                    # ✅ GameDefinition
├── DiceResult.svelte           # ✅ Smart component (uses useDiceRoll)
└── DiceExplanation.svelte      # ✅ Smart component (uses useDiceRoll)

src/lib/games/layout/           # ✅ Dumb/presentation components
├── ContentBlock.svelte
├── Loader.svelte
├── HighlightText.svelte
└── [other shared UI components]
```

**Smart component pattern** (already implemented):
```svelte
<!-- DiceResult.svelte (23 lines) -->
<script lang="ts">
  import { useDiceRoll } from '$lib/composables';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues } = $props();
  const diceRoll = useDiceRoll(() => formValues);
</script>

{#if diceRoll.isCalculating}
  <Loader />
{:else}
  <div data-testid="dice-result">
    {diceRoll.rollNumber!.toFixed(2)}
  </div>
{/if}
```

**Dumb component pattern** (already implemented):
- FloatGenerationStep.svelte (263 lines) - Pure presentation
- ContentBlock.svelte - Layout wrapper
- Loader.svelte - Loading indicator

**Statistics:**
- ✅ 98 component files across 30+ games
- ✅ Consistent naming: `[Game]Result.svelte`, `[Game]Explanation.svelte`
- ✅ Average component size: < 100 lines (focused)
- ✅ Clear separation: smart components call composables, dumb components receive props

**What remains:**
- ❌ Add `__tests__/` directories (Phase 7)
- ❌ Consider adding `components/` subdirectory per game (optional refinement)
- ❌ Document the pattern formally

**Benefits achieved:**
- ✅ Components use composables for state
- ✅ Smart/dumb separation implemented
- ✅ Clear, maintainable component structure
- ✅ Consistent pattern across all games

---

### 📝 **Step 6: Phase 6 - Types** (ORGANIZATION)
**Status**: 📋 Planned
**Time**: ~2 hours
**Risk**: Low
**Dependencies**: Should be done after major refactoring (Phase 2-5)

**Goals:**
- Split large `types.ts` file into logical modules
- Improve type discoverability

**Structure:**
```
src/lib/types/
├── index.ts              # Re-exports
├── common.ts             # Seed, FormValues, etc.
├── games/
│   ├── dice.ts
│   ├── wheel.ts
│   └── index.ts
├── ui.ts                 # Component props
└── validation.ts         # Zod-related types
```

**Implementation plan**: [phase-6-types-implementation-plan.md](phase-6-types-implementation-plan.md) *(to be created)*

---

### 📝 **Step 7: Phase 7 - Testing** (QUALITY)
**Status**: 📋 Planned
**Time**: Ongoing
**Risk**: Low
**Dependencies**: Should be done throughout, but formalized at the end

**Goals:**
- Improve test coverage (target 90%+)
- Follow testing pyramid
- Test domain functions, composables, components

**Structure:**
```
tests/
├── unit/
│   ├── domain/           # Pure function tests (70%)
│   └── utils/
├── integration/
│   └── composables/      # Composable tests (20%)
└── component/
    └── games/            # UI tests (10%)
```

**Implementation plan**: [phase-7-testing-implementation-plan.md](phase-7-testing-implementation-plan.md) *(to be created)*

---

## 📊 Implementation Timeline

### **Original Timeline (Outdated)**
```
Week 1:
├─ Day 1-2: Phase 1 (Constants) ✅ DONE
├─ Day 3-4: Phase 2 (Composables) 🔄 NEXT
└─ Day 5: Phase 3 (Domain Layer) - Start

Week 2:
├─ Day 1-2: Phase 3 (Domain Layer) - Complete
├─ Day 3: Phase 5 (Utilities)
├─ Day 4-5: Phase 4 (Components)

Week 3:
├─ Day 1: Phase 6 (Types)
├─ Day 2-5: Phase 7 (Testing) + Polish
```

### **Actual Progress & Revised Timeline**

**✅ Already Completed (Without tracking):**
- Phase 1: Constants (1 hour) ✅
- Phase 2: Composables (~70% - 3-4 hours) ⚠️
- Phase 4: Components (~75% - 3 hours) ⚠️
- Phase 3: Domain logic exists (~40% - unknown) ⚠️

**🎯 Remaining Work (Revised Estimate: 16-23 hours total):**

```
Day 1-2 (~4-6 hours):
├─ Phase 3: Domain Layer Reorganization (2-3 hrs)
│   ├─ Create domain/ directory structure
│   ├─ Move generator/ → domain/crypto/
│   ├─ Move util/ games → domain/games/
│   └─ Update 30+ imports in composables
│
└─ Phase 5: Utilities Organization (1-2 hrs)
    ├─ Separate generic utils → utils/core/
    ├─ Separate Svelte utils → utils/svelte/
    └─ Update imports

Day 3-4 (~6-8 hours):
├─ Phase 2: Component Mixed Concerns Cleanup (6-8 hrs) **NEW**
│   ├─ HIGH Priority (3-4 hrs): Refactor 6 components
│   │   └─ BlueSamurai, Darts, DragonTower, Mines, Moles
│   ├─ MEDIUM Priority (2-3 hrs): Refactor 11 components
│   │   └─ Extract Fisher-Yates display pattern (7 components)
│   │   └─ Clean up calculations in 4 components
│   └─ LOW Priority (1 hr): Optional - simple display logic cleanup
│
└─ Pattern Creation:
    ├─ Create useFisherYatesDisplay() composable
    ├─ Create grid reconstruction utilities
    └─ Extract explanation state management

Day 5 (~2-3 hours):
├─ Phase 6: Types Reorganization (1-2 hrs)
│   ├─ Split types.ts into modules
│   ├─ Create types/common.ts, types/games/, etc.
│   └─ Update imports
│
└─ Phase 2 & 4: Documentation (1 hr)
    ├─ Document composable pattern
    └─ Document component architecture

Day 6-7 (~4-6 hours):
└─ Phase 7: Testing (4-6 hrs)
    ├─ Add domain layer tests (pure functions)
    ├─ Add composable tests
    ├─ Add component smoke tests
    └─ Target: 70-80% coverage
```

**Key Insight**: Component review revealed **more mixed concerns than expected**. Added 6-8 hours for high/medium priority component refactoring. Most work is still **organizational** rather than **architectural redesign**.

---

## ✅ Progress Tracking

| Phase | Original Status | **Actual Status** | Completion | Time Spent | Notes |
|-------|----------------|-------------------|------------|------------|-------|
| Phase 1: Constants | ✅ Complete | ✅ **Complete** | **100%** | ~1hr | 82f6f82 - Perfect execution |
| Phase 2: Composables | 🔄 Next | ✅ **~95% Done** | **95%** | ~5-6hr | 40+ composables, high+medium priority done |
| Phase 3: Domain Layer | 📋 Planned | ⚠️ **~40% Done** | **40%** | - | Logic exists, needs reorganization |
| Phase 4: Components | 📋 Planned | ⚠️ **~75% Done** | **75%** | ~3hr | Pattern already implemented |
| Phase 5: Utilities | 📋 Planned | ❌ **Not Started** | **0%** | - | Needs file reorganization |
| Phase 6: Types | 📋 Planned | ❌ **Not Started** | **0%** | - | Single types.ts needs splitting |
| Phase 7: Testing | 📋 Planned | ❌ **Not Started** | **0%** | - | No visible test files |

---

## 🎯 **Reality Check: Where We Actually Are**

### **Major Discovery: Roadmap is Outdated!**

The roadmap suggested we were at **Phase 2 (Not Started)**, but codebase analysis reveals we're actually **much further along**:

**✅ What's Already Done (Not Reflected in Roadmap):**
1. **Phase 1**: ✅ 100% Complete (correctly tracked)
2. **Phase 2**: ✅ ~70% Complete - 30+ composables across all game categories
3. **Phase 4**: ✅ ~75% Complete - Smart/dumb component pattern fully implemented
4. **Phase 3**: ⚠️ ~40% Complete - Pure domain logic exists, just needs reorganization

**❌ What Actually Remains:**
1. **Phase 3**: File reorganization (2-3 hours) - Move `util/` → `domain/games/`, `generator/` → `domain/crypto/`
2. **Phase 5**: Utility consolidation (1-2 hours) - Separate generic from Svelte-specific utils
3. **Phase 6**: Type splitting (1-2 hours) - Split monolithic `types.ts` into modules
4. **Phase 7**: Testing (4-6 hours) - Add comprehensive test coverage
5. **Phase 2**: Polish (1 hour) - Add tests and documentation for composables
6. **Phase 4**: Polish (30 min) - Formal documentation

**Revised Time Estimate**: ~10-15 hours remaining (not 2-3 weeks!)

---

## 🎯 Current Focus: Phase 3 - Domain Layer Reorganization

**This is the highest priority** because it unlocks clean architecture formally.

**Next steps:**
1. Create `src/lib/domain/` directory structure
2. Move crypto generators: `src/lib/generator/` → `src/lib/domain/crypto/`
3. Move game utilities: `src/lib/util/*.ts` → `src/lib/domain/games/`
4. Update imports in 30+ composable files
5. Create `src/lib/domain/index.ts` for re-exports
6. Verify all tests still pass (when they exist)

**Key deliverables:**
- Clean architecture folder structure
- All imports updated
- No breaking changes
- Clear separation: domain vs infrastructure

---

## 📝 Notes

- Phase numbers in master plan are **logical grouping**
- Implementation order is **dependency-based**
- Can do some phases in parallel (e.g., Phase 5 utilities while doing Phase 2)
- Each phase should have:
  - Detailed implementation plan
  - Clear success criteria
  - Git commit when complete
  - Documentation/examples

---

## 🔗 Related Documents

- [clean-architecture-refactoring.md](clean-architecture-refactoring.md) - Master plan
- [phase-1-implementation-plan.md](phase-1-implementation-plan.md) - Phase 1 details
- [phase-1-completion-summary.md](phase-1-completion-summary.md) - Phase 1 results
- [phase-5-utilities-implementation-plan.md](phase-5-utilities-implementation-plan.md) - Phase 5 details
