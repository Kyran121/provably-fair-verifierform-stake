# Clean Architecture Refactoring - Implementation Roadmap

## 📋 Overview

This document provides the **actual implementation sequence** for the clean architecture refactoring, aligned with the master plan in [clean-architecture-refactoring.md](clean-architecture-refactoring.md).

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

### 📝 **Step 2: Phase 2 - Composables** (NEXT)
**Status**: 🔄 Not Started
**Time**: ~3-4 hours
**Risk**: Medium
**Dependencies**: None (can start now)

**Goals:**
- Extract business logic from components into `.svelte.ts` composables
- Create reusable reactive state management
- Separate concerns: logic vs UI

**Structure to create:**
```
src/lib/composables/
├── use-dice-roll.svelte.ts
├── use-wheel-spin.svelte.ts
├── use-plinko-path.svelte.ts
├── use-card-shuffle.svelte.ts
└── core/
    ├── use-debounced-computation.svelte.ts
    └── use-seed-parser.svelte.ts
```

**Example:**
- Component: `DiceResult.svelte` (currently has logic + UI)
- Extract to: `useDiceRoll()` composable
- Component becomes: pure UI rendering

**Benefits:**
- Components become simpler and focused on UI
- Business logic is reusable across components
- Easier to test (composables can be tested independently)
- Foundation for Phase 3 domain layer

**Implementation plan**: [phase-2-composables-implementation-plan.md](phase-2-composables-implementation-plan.md) *(to be created)*

---

### 📝 **Step 3: Phase 3 - Domain Layer** (AFTER COMPOSABLES)
**Status**: 📋 Planned
**Time**: ~4-5 hours
**Risk**: Low
**Dependencies**: Phase 2 (composables should call domain functions)

**Goals:**
- Create pure, framework-agnostic business logic
- Move game-specific utilities from `src/lib/util/` to `src/lib/domain/games/`
- Organize crypto/seed logic into domain layer

**Structure to create:**
```
src/lib/domain/
├── seed/
│   ├── types.ts              # Seed types
│   ├── parser.ts             # parseSeed(formValues)
│   └── validator.ts          # validateSeed()
│
├── games/
│   ├── dice.ts               # calculateDiceRoll()
│   ├── wheel.ts              # calculateWheelPosition()
│   ├── plinko.ts             # calculatePlinkoPath()
│   ├── darts.ts              # (from util/darts.ts)
│   ├── tarot.ts              # (from util/tarot.ts)
│   └── shared/
│       ├── payout.ts         # getPayout() - from util/
│       └── shuffle.ts        # Card shuffling logic
│
└── crypto/
    ├── byte-generation.ts    # ByteGenerator logic
    └── float-generation.ts   # FloatGenerator logic
```

**What moves here:**
- `src/lib/util/payout.ts` → `domain/games/shared/payout.ts`
- `src/lib/util/darts.ts` → `domain/games/darts.ts`
- `src/lib/util/tarot.ts` → `domain/games/tarot.ts`
- `src/lib/util/packs.ts` → `domain/games/packs.ts`
- `src/lib/util/drill.ts` → `domain/games/drill.ts`
- etc.

**Benefits:**
- 100% testable pure functions
- Framework-agnostic (can be used anywhere)
- Clear separation: domain vs infrastructure
- Composables become thin wrappers around domain logic

**Implementation plan**: [phase-3-domain-layer-implementation-plan.md](phase-3-domain-layer-implementation-plan.md) *(to be created)*

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

### 📝 **Step 5: Phase 4 - Component Structure** (POLISH)
**Status**: 📋 Planned
**Time**: ~3-4 hours
**Risk**: Medium
**Dependencies**: Phase 2 (needs composables), Phase 3 (needs domain layer)

**Goals:**
- Refactor components to use composables
- Split into smart (container) and dumb (presentation) components
- Improve component organization

**Example transformation:**
```
src/lib/games/dice/
├── index.ts                    # GameDefinition
├── config.ts                   # Game-specific config (if needed)
├── components/
│   ├── DiceResult.svelte       # Smart component (uses composable)
│   ├── DiceResultDisplay.svelte # Presentation component
│   ├── DiceExplanation.svelte
│   └── DiceResultStep.svelte
└── __tests__/
    └── DiceResult.test.ts
```

**Smart component** (DiceResult.svelte):
- Uses `useDiceRoll()` composable
- Manages state
- Passes data to presentation component

**Dumb component** (DiceResultDisplay.svelte):
- Only receives props
- Pure UI rendering
- No business logic

**Implementation plan**: [phase-4-components-implementation-plan.md](phase-4-components-implementation-plan.md) *(to be created)*

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

---

## ✅ Progress Tracking

| Phase | Status | Branch/Commit | Time Spent | Notes |
|-------|--------|---------------|------------|-------|
| Phase 1: Constants | ✅ Complete | 82f6f82 | ~1hr | All tests passing |
| Phase 2: Composables | 🔄 Next | - | - | Implementation plan needed |
| Phase 3: Domain Layer | 📋 Planned | - | - | Depends on Phase 2 |
| Phase 5: Utilities | 📋 Planned | - | - | Can be parallel |
| Phase 4: Components | 📋 Planned | - | - | Depends on 2 & 3 |
| Phase 6: Types | 📋 Planned | - | - | After major refactoring |
| Phase 7: Testing | 📋 Planned | - | - | Ongoing |

---

## 🎯 Current Focus: Phase 2 - Composables

**Next steps:**
1. Create [phase-2-composables-implementation-plan.md](phase-2-composables-implementation-plan.md)
2. Identify components with mixed concerns (logic + UI)
3. Extract business logic into composables
4. Start with simple example (Dice game)
5. Create pattern for other games to follow

**Key deliverables:**
- `src/lib/composables/` directory structure
- At least 3-5 composables created (dice, wheel, etc.)
- Components refactored to use composables
- Tests for composables
- Documentation of the pattern

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
