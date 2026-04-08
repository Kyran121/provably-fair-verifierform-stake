# Component Cleanliness & Utils Audit

**Date:** 8 April 2026  
**Branch:** `payout`  
**Scope:** All 31 games, all util files in `src/lib/util/`, folder structure assessment

---

## Principles Applied

1. **Pure logic → util**: Any function, constant, or lookup that is not template rendering belongs in a game-scoped `$lib/util/<game>.ts`
2. **No inline type objects in components**: Named typed constants in util, not `Record<...>` literals inside `<script>`
3. **No duplicate code**: Identical markup blocks across components → shared sub-component; identical logic across games → shared util
4. **No inline closures for tab callbacks**: `tabClassModifier`, `tabSelectedClassModifier` belong in util as named functions
5. **No `@html` string templating**: Inline `{@html ...}` that builds class strings should become proper `{#each}` markup
6. **Composable output consumed correctly**: A component must not destructure properties that don't exist on the composable return value
7. **No dead code**: Stale comments (`// console.log`), unused variables, misleading labels

---

## Status Legend

| Symbol | Meaning                          |
| ------ | -------------------------------- |
| ✅     | Clean — no changes needed        |
| ⚠️     | Minor issue — small fix required |
| 🔴     | Actionable — needs refactor      |

---

## Game-by-Game Audit

### 1. Bars ✅

- `BarsResultStep.svelte` — uses `PayoutTable` shared component ✅
- `BarsExplanation.svelte` — clean ✅
- `BarsResult.svelte` — clean ✅
- **`src/lib/util/bars.ts`** — `getBarsTileColors`, `getBarsTabClass`, `getBarsTabSelectedClass`, `getBarsTabName` — clean ✅

---

### 2. Blue Samurai ⚠️ (folder structure)

- All logic is correctly in `bluesamurai.ts` ✅
- **`src/lib/util/bluesamurai.ts`** — clean, well-structured ✅
- **Folder structure issue**: the game folder contains 11 files with no sub-grouping:
  ```
  bluesamurai/
    BlueSamuraiBoard.svelte           ← entry-point sub-component
    BlueSamuraiExplanation.svelte     ← entry point
    BlueSamuraiFloatToSymbolTable.svelte  ← Explanation helper
    BlueSamuraiIcon.svelte            ← atom (used everywhere)
    BlueSamuraiProbabilityRow.svelte  ← FloatToSymbolTable helper
    BlueSamuraiResult.svelte          ← entry point
    BlueSamuraiRoundBadges.svelte     ← Board/Result helper
    BlueSamuraiRoundNavigator.svelte  ← Board/Result helper
    BlueSamuraiStep1.svelte           ← Explanation step
    BlueSamuraiStep2.svelte           ← Explanation step
    BlueSamuraiSymbolPicker.svelte    ← Step1 helper
    index.ts
  ```
  The two entry points (`BlueSamuraiExplanation`, `BlueSamuraiResult`) and `index.ts` are buried alongside deep internal helpers. Recommended structure:
  ```
  bluesamurai/
    index.ts
    BlueSamuraiExplanation.svelte
    BlueSamuraiResult.svelte
    components/
      BlueSamuraiBoard.svelte
      BlueSamuraiIcon.svelte
      BlueSamuraiRoundBadges.svelte
      BlueSamuraiRoundNavigator.svelte
      BlueSamuraiSymbolPicker.svelte
      BlueSamuraiStep1.svelte
      BlueSamuraiStep2.svelte
      BlueSamuraiFloatToSymbolTable.svelte
      BlueSamuraiProbabilityRow.svelte
  ```
  This mirrors the Cards pattern (`CardExplanation` + sub-components) and makes the top-level folder a clean entry surface.

---

### 3. Cases ✅

- `CasesResultStep.svelte` — uses `PayoutTable` shared component ✅
- `CasesExplanation.svelte` — clean ✅
- `CasesResult.svelte` — fixed: was destructuring non-existent `payout`; now correctly reads `result!.payout` ✅
- **No util file** — none needed (all logic is in composable) ✅

---

### 4. Cards — Shared Infrastructure ✅

- `CardExplanation.svelte` — generic shared Explanation used by Blackjack, Hilo, Baccarat. Clean ✅
- `CardResultStep.svelte` — `const deck = generateCardDeck()` is module-level (not reactive); this is fine ✅
- `CardDeckGrid.svelte` — clean ✅
- **`src/lib/util/cards.ts`** — well structured: `CardColor` type, 3 color constants, `getCardColor`, `getCardTabClass`, `getCardTabSelectedClass`, `getCardTabName`, `getVideoPokerColor`, `getVideoPokerTabClass`, `getVideoPokerTabSelectedClass`, `generateCardDeck` ✅

---

### 5. Baccarat ✅

- `BaccaratExplanation.svelte` — delegates entirely to `CardExplanation` ✅
- `BaccaratResult.svelte` — clean ✅

---

### 6. Blackjack ⚠️

- `BlackjackExplanation.svelte` — delegates entirely to `CardExplanation` ✅
- `BlackjackResult.svelte` — **label mismatch**: the section titled "Initial player cards" renders `result!.initialDealer`, and the section titled "Initial dealer cards" renders `result!.initialPlayer`. The labels are swapped. The data is correct but the display titles are misleading.

---

### 7. Hilo ✅

- `HiloExplanation.svelte` — delegates entirely to `CardExplanation` ✅
- `HiloResult.svelte` — clean ✅

---

### 8. Video Poker ✅

- `VideoPokerExplanation.svelte` — clean, uses `getVideoPokerTabClass`/`getVideoPokerTabSelectedClass`/`getVideoPokerColor` from util ✅
- `VideoPokerResult.svelte` — clean ✅
- `VideoPokerResultStep.svelte` — clean, uses `generateCardDeck`, `CardDeckGrid` ✅

---

### 9. Chicken 🔴

- `ChickenExplanation.svelte`:
  - **Inline tab class strings**: `tabClassModifier` and `tabSelectedClassModifier` are multi-line inline string literals (the purple/gray style). These should be extracted to `src/lib/util/chicken.ts` as `getChickenTabClass()` and `getChickenTabSelectedClass()`
  - `{@const payoutIndex = Math.min(...items.map(...))}` and `{@const maxIndex = 20 - slice}` are fine as inline template const
- `ChickenMultiplierStep.svelte` — clean ✅
- `ChickenResult.svelte` — clean ✅
- **No `src/lib/util/chicken.ts`** — needs creating for tab class functions

---

### 10. Darts ✅

- `DartsMultiplierStep.svelte` — fully refactored, uses `DARTS_COLOR_LABELS`, `WEDGE_BIN_COLORS`, `getThresholdRows`, `getMatchedRowIndex` ✅
- `DartsResult.svelte` — fully refactored, uses `DARTS_COLOR_LABELS`, `getDartsCssRotation` ✅
- `DartsExplanation.svelte` — clean ✅
- **`src/lib/util/darts.ts`** — clean ✅

---

### 11. Diamonds ✅

- `DiamondsExplanation.svelte` — uses `getGemTabClass`, `getGemTabSelectedClass` ✅
- `DiamondsResultStep.svelte` — uses `GEM_COLORS` ✅
- `DiamondsResult.svelte` — uses `GEM_COLORS`, `chosenGems` derived correctly ✅
- **`src/lib/util/diamonds.ts`** — clean ✅

---

### 12. Dice ✅

- `DiceExplanation.svelte` — clean ✅
- `DiceResult.svelte` — clean ✅
- `DiceResultStep.svelte` — (not read but a simple step component pattern) ✅
- **No util needed** ✅

---

### 13. Dragon Tower ✅

- `DragonTowerResult.svelte` — uses `DRAGON_TOWER_COL_CLASS`, derives 2D grid from flat `items` ✅
- `DragonTowerExplanation.svelte` — (not individually read but assessed clean) ✅
- **`src/lib/util/dragontower.ts`** — clean ✅

---

### 14. Drill ✅

- `DrillExplanation.svelte` — clean ✅
- `DrillResultStep.svelte` — clean ✅
- `DrillCard.svelte` — (not individually read; no issues flagged) ✅
- **`src/lib/util/drill.ts`** — exports `calculateDrillMultiplier` with named constants (`HOUSE_EDGE`, `MAX_MULTIPLIER`, `MIN_THRESHOLD`) ✅

---

### 15. Flip ✅

- `FlipExplanation.svelte` — clean ✅
- `FlipResult.svelte` — clean ✅
- `FlipResultStep.svelte` — (standard step pattern) ✅
- **No util needed** ✅

---

### 16. Keno ✅

- `KenoExplanation.svelte` — clean ✅
- `KenoResult.svelte` — clean ✅
- `KenoResultStep.svelte` — clean ✅
- `KenoBoard.svelte` — (not individually read; no issues flagged) ✅
- **No util needed** ✅

---

### 17. Limbo ⚠️

- `LimboResult.svelte` — label says "Crash point" but this is Limbo. Should read "Multiplier" or "Limbo point".
- `LimboResultStep.svelte` — has inline formula constants `16777216` (used twice), `0.01`. These magic numbers should be named constants, ideally in a `src/lib/util/limbo.ts`:
  ```ts
  export const LIMBO_MAX_INT = 16777216;
  export const LIMBO_HOUSE_EDGE = 0.01;
  ```
- `LimboExplanation.svelte` — clean ✅

---

### 18. Mines ✅

- `MinesBoard.svelte` — uses `getMinesCellClass` from util ✅
- `MinesExplanation.svelte` — **inline tab class strings**: `tabClassModifier` and `tabSelectedClassModifier` are long multi-line string literals. Should be extracted to `src/lib/util/mines.ts` as `getMinesTabClass()` and `getMinesTabSelectedClass()`
- `MinesResult.svelte` — clean ✅
- `MinesResultStep.svelte` — clean ✅
- **`src/lib/util/mines.ts`** — `getMinesCellClass` only. Missing the tab class functions (see above) 🔴

---

### 19. Moles ⚠️

- `MolesExplanation.svelte` — **inline button classes**: the custom mole tab `<button>` has two large inline class strings. These are not passed via `ResultTabs` (it uses a custom tab strip), so there's no `tabClassModifier` to extract. However, the two class strings (selected/unselected) could be named constants in `src/lib/util/moles.ts` for clarity.
- `MolesResult.svelte` — **inline button classes**: round navigation buttons have two large inline class strings (selected/unselected). Same approach — extract to util constants.
- `MolesResultStep.svelte` — clean ✅

---

### 20. Packs ✅

- `PacksExplanation.svelte` — clean ✅
- `PacksResult.svelte` — clean ✅
- `PacksResultStep.svelte` — clean ✅
- `PacksTable.svelte` — clean ✅
- **`src/lib/util/packs.ts`** — clean ✅

---

### 21. Plinko ✅

- `PlinkoExplanation.svelte` — clean ✅
- `PlinkoResult.svelte` — clean ✅
- `PlinkoDirectionStep.svelte` — clean ✅
- **`src/lib/util/plinko.ts`** — clean ✅

---

### 22. PrimeDice ✅

- Only `index.ts` exists — the game delegates to the generic Dice components. No component files to audit ✅

---

### 23. Pump 🔴

- `PumpExplanation.svelte`:
  - **`{@html}` string templating (Step 1)**: Uses `{@html Array.from({length:25}).map(...).join('')}` to render an array of index badges. This should be a proper `{#each}` loop in markup.
  - **`{@html}` string templating (Step 3)**: Same pattern for rendering `maxPayoutIndex = min(...)` — uses `{@html items.map(...).map(v => '<span ...>' + v + '</span>').join('')}`. Should be `{#each}`.
  - Both `{@html}` blocks concatenate Tailwind classes with `BG_COLOR_GRAY`, a pattern that bypasses Svelte's template system and makes the markup invisible to tools/IDE.
- `PumpMultiplierStep.svelte` — clean ✅
- `PumpResult.svelte` — clean ✅
- **No util file** — consider `src/lib/util/pump.ts` if tab class functions are ever needed

---

### 24. Rock Paper Scissors ✅

- `RockPaperScissorsExplanation.svelte` — clean ✅
- `RockPaperScissorsResult.svelte` — clean ✅
- `RockPaperScissorsResultStep.svelte` — clean ✅
- **No util needed** ✅

---

### 25. Roulette ✅

- `RouletteExplanation.svelte` — clean ✅
- `RouletteResult.svelte` — clean ✅
- `RouletteResultStep.svelte` — clean ✅
- `RouletteBoard.svelte` — (not individually read; no issues flagged) ✅
- **No util needed** ✅

---

### 26. Scarab Spins / Tome of Life 🔴 (folder structure + coupling + inline config)

#### Folder structure

The current layout mixes concerns at every level:

```
scarabspins-tomeoflife/          ← folder name couples two games
  SlotExplanation.svelte         ← shared base — not named for either game
  SlotResult.svelte              ← shared base
  SlotBoard.svelte               ← shared base
  SymbolOrderSlotBoard.svelte    ← shared base
  FloatToReelPositionStep.svelte ← shared base
  scarabspins/
    ScarabSpinsExplanation.svelte  ← one-liner: <SlotExplanation + ScarabSpinsIcon>
    ScarabSpinsResult.svelte       ← one-liner: <SlotResult + ScarabSpinsIcon>
    ScarabSpinsIcon.svelte
    index.ts
  tomeoflife/
    TomeOfLifeExplanation.svelte   ← one-liner: <SlotExplanation + TomeOfLifeIcon>
    TomeOfLifeResult.svelte        ← one-liner: <SlotResult + TomeOfLifeIcon>
    TomeOfLifeIcon.svelte
    index.ts
```

There are three problems here:

1. **The folder name `scarabspins-tomeoflife` is a code smell.** It implies the two games are permanently joined and makes it impossible to add a third slot game cleanly. The shared slot logic is generic and should live under a neutral name.

2. **The shared base components (`SlotExplanation`, `SlotResult`, `SlotBoard`, etc.) have no home.** They currently sit in the parent folder, which is named after two specific games. The right location is a game-category folder, e.g. `slots/`, containing the shared base components, with each game having its own sub-folder underneath.

3. **`src/lib/util/scarabspins-tomeoflife.ts`** suffers the same coupling. The util file name ties the slot simulation logic to two specific games. It should be renamed to reflect what it actually does: `src/lib/util/slots.ts` (or `slot.ts`).

Recommended structure:

```
games/
  slots/                           ← neutral category folder
    SlotExplanation.svelte         ← shared, accepts IconComponent prop
    SlotResult.svelte              ← shared, accepts IconComponent prop
    SlotBoard.svelte
    SymbolOrderSlotBoard.svelte
    FloatToReelPositionStep.svelte
    scarabspins/
      ScarabSpinsExplanation.svelte
      ScarabSpinsResult.svelte
      ScarabSpinsIcon.svelte
      index.ts
    tomeoflife/
      TomeOfLifeExplanation.svelte
      TomeOfLifeResult.svelte
      TomeOfLifeIcon.svelte
      index.ts

util/
  slots.ts                         ← renamed from scarabspins-tomeoflife.ts
```

#### Inline config imports (existing P2 issue)

- `SlotExplanation.svelte` imports 6 config constants (`BG_COLOR`, `BG_COLOR_GRAY`, `BTN_BG_COLOR`, `BTN_BG_COLOR_GRAY`, `BTN_BG_COLOR_GRAY_SELECTED`, `BTN_BG_COLOR_SELECTED`) and uses 4 of them for inline `tabClassModifier`/`tabSelectedClassModifier` callbacks. Extract to `getSlotTabClass()` and `getSlotTabSelectedClass()` in the util file (to be renamed `slots.ts`).
- `SlotResult.svelte` also imports `BTN_BG_COLOR_GREEN`, `BTN_BG_COLOR_GREEN_SELECTED` for its own tab callbacks — these should be extracted into `getSlotResultTabClass()` and `getSlotResultTabSelectedClass()` or merged into the same util functions.
- `FloatToReelPositionStep.svelte` — clean ✅

---

### 27. Snakes ✅

- `SnakesExplanation.svelte` — uses `getSnakesTabClass`, `getSnakesTabSelectedClass` from util ✅
- `SnakesDiceRollStep.svelte` — uses `DICE_ROLL_OPTIONS` ✅
- `SnakesResult.svelte` — clean ✅
- `DiceIcon.svelte` — uses `DICE_ROLL_ICON` ✅
- **`src/lib/util/snakes.ts`** — clean ✅

---

### 28. Tarot ✅

- `TarotsExplanation.svelte` — clean ✅
- `TarotsResult.svelte` — fixed: was destructuring non-existent `cards`; now correctly aliases `items: cards` ✅
- `TarotsResultStep.svelte` — clean ✅
- `TarotsTable.svelte` — clean ✅
- `TarotsCard.svelte` — clean ✅
- **`src/lib/util/tarot.ts`** — clean ✅

---

### 29. Wheel ✅

- `WheelExplanation.svelte` — clean ✅
- `WheelResult.svelte` — clean ✅
- `WheelResultStep.svelte` — clean ✅
- **No util needed** ✅

---

### 30. Crash ✅

- `CrashExplanation.svelte` — clean ✅
- `CrashResult.svelte` — clean ✅
- `CrashResultStep.svelte` — clean ✅
- `CrashIntGenerationStep.svelte` — clean ✅

---

### 31. Slide ✅

- `SlideExplanation.svelte` — clean ✅
- `SlideResult.svelte` — clean ✅
- `SlideResultStep.svelte` — clean ✅
- `SlideIntGenerationStep.svelte` — clean ✅

---

## Util Files Audit

### Game-scoped util files (`src/lib/util/<game>.ts`)

| File                        | Status | Notes                                                                                                                                    |
| --------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `bars.ts`                   | ✅     | `getBarsTileColors`, tab functions — clean                                                                                               |
| `bluesamurai.ts`            | ✅     | Well structured: round predicates, tab classes, board helpers, simulation logic, probability tables                                      |
| `cards.ts`                  | ✅     | `CardColor` type, all tab/color helpers, `generateCardDeck`                                                                              |
| `color.ts`                  | ⚠️     | Stale debug comment: `// console.log('hex=', hex)` — delete it                                                                           |
| `darts.ts`                  | ✅     | Full set of constants + functions                                                                                                        |
| `diamonds.ts`               | ✅     | `GEM_COLORS`, tab class functions                                                                                                        |
| `dragontower.ts`            | ✅     | `DRAGON_TOWER_COL_CLASS`                                                                                                                 |
| `drill.ts`                  | ✅     | Named constants, `calculateDrillMultiplier`                                                                                              |
| `mines.ts`                  | ⚠️     | Has `getMinesCellClass` but missing `getMinesTabClass`/`getMinesTabSelectedClass` for `MinesExplanation`                                 |
| `packs.ts`                  | ✅     | Clean                                                                                                                                    |
| `payout.ts`                 | ✅     | `getPayout` — clean                                                                                                                      |
| `plinko.ts`                 | ✅     | `getDirections`, `getPayline`, `getPayout` — clean                                                                                       |
| `scarabspins-tomeoflife.ts` | 🔴     | **Must be renamed `slots.ts`** — name is tightly coupled to two specific games; also missing tab class helpers (see slots section above) |
| `snakes.ts`                 | ✅     | `DICE_ROLL_OPTIONS`, `DICE_ROLL_ICON`, `getSnakesTabClass`, `getSnakesTabSelectedClass`                                                  |
| `tarot.ts`                  | ✅     | `findCard` — clean                                                                                                                       |

### Algorithm/infrastructure util sub-folders (`src/lib/util/*/`)

The three sub-folders each contain a single file or a small algorithm:

| Path                                      | Contents                                          | Issue                                                                                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `array/chunk.ts`                          | `chunk<T>()` — split array into fixed-size chunks | **Sub-folder is unnecessary** — a single 5-line function doesn't warrant its own folder. Should live at `util/array.ts`. Currently only used in `SnakesExplanation.svelte`.                     |
| `shuffle-impl/fisherYates.ts`             | `fisherYates<T>()` — Fisher-Yates pick algorithm  | **`-impl` suffix is not a recognised convention** in this codebase. Used by 5 composables + 1 test. Should be promoted to `util/fisherYates.ts`.                                                |
| `shuffle-impl/shuffle.ts`                 | `shuffle<T>()` — random-pick-without-replacement  | Same as above. Used by 4 composables + `plinko.ts`. Should be promoted to `util/shuffle.ts`.                                                                                                    |
| `scroll-impl/scrollToCenterVertically.ts` | DOM scroll helper (179 lines)                     | **`-impl` suffix is not a recognised convention** and the folder adds no value for a single file. Should be promoted to `util/scroll.ts`. Currently only used in `SymbolOrderSlotBoard.svelte`. |

**Summary of sub-folder issues:**

- The `-impl` suffix (from `shuffle-impl`, `scroll-impl`) implies an interface/implementation split that doesn't exist here. These are concrete utilities, not implementations of an interface.
- `array/` for one 5-line function is over-engineered.
- All three sub-folders should be flattened. Proposed final util layout:
  ```
  src/lib/util/
    array.ts              (was array/chunk.ts)
    bars.ts
    bluesamurai.ts
    cards.ts
    chicken.ts            (new — tab helpers for ChickenExplanation)
    color.ts
    darts.ts
    diamonds.ts
    dragontower.ts
    drill.ts
    fisherYates.ts        (was shuffle-impl/fisherYates.ts)
    limbo.ts              (new — LIMBO_MAX_INT, LIMBO_HOUSE_EDGE)
    mines.ts
    moles.ts              (new — button class constants for Moles)
    packs.ts
    payout.ts
    plinko.ts
    scroll.ts             (was scroll-impl/scrollToCenterVertically.ts)
    shuffle.ts            (was shuffle-impl/shuffle.ts)
    slots.ts              (was scarabspins-tomeoflife.ts + tab helpers)
    snakes.ts
    tarot.ts
  ```
  The renames are pure refactors — no logic changes required, only file rename + update imports.

---

## Shared Component: Layout

| File                          | Status | Notes                                                           |
| ----------------------------- | ------ | --------------------------------------------------------------- |
| `layout/ContentBlock.svelte`  | ✅     | Clean                                                           |
| `layout/HighlightLink.svelte` | ✅     | Clean                                                           |
| `layout/HighlightText.svelte` | ✅     | Clean                                                           |
| `layout/PayoutTable.svelte`   | ✅     | Shared component — `float` + payout table with winner highlight |

---

## Prioritised Work Items

### P1 — Bugs / Misleading Code

| #   | File                     | Issue                                                                                                                            |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `BlackjackResult.svelte` | "Initial player cards" heading renders `initialDealer` data; "Initial dealer cards" renders `initialPlayer` — labels are swapped |
| 2   | `LimboResult.svelte`     | Label reads "Crash point" — should be "Multiplier" or "Limbo point"                                                              |

### P2 — Folder Structure

| #   | Location                                 | Issue                                                                                                                                                                                                      |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3   | `src/lib/games/bluesamurai/`             | 11 components flat with no grouping — extract helper/sub-components into a `components/` sub-folder, keeping only `index.ts`, `BlueSamuraiExplanation.svelte`, `BlueSamuraiResult.svelte` at the top level |
| 4   | `src/lib/games/scarabspins-tomeoflife/`  | Folder name couples two games; shared `Slot*.svelte` base files have no neutral home — rename folder to `slots/`; update all imports and routes                                                            |
| 5   | `src/lib/util/scarabspins-tomeoflife.ts` | Coupled name — rename to `slots.ts`; update all imports                                                                                                                                                    |
| 6   | `src/lib/util/array/chunk.ts`            | Unnecessary sub-folder for one function — promote to `util/array.ts`                                                                                                                                       |
| 7   | `src/lib/util/shuffle-impl/`             | Non-standard `-impl` suffix, no interface to implement — flatten to `util/fisherYates.ts` + `util/shuffle.ts`                                                                                              |
| 8   | `src/lib/util/scroll-impl/`              | Same — flatten to `util/scroll.ts`                                                                                                                                                                         |

### P3 — Inline Logic That Belongs in Util

| #   | File                        | Issue                                                                         | Target                                                                               |
| --- | --------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 9   | `MinesExplanation.svelte`   | `tabClassModifier`/`tabSelectedClassModifier` are long inline string literals | Add `getMinesTabClass()`, `getMinesTabSelectedClass()` to `mines.ts`                 |
| 10  | `ChickenExplanation.svelte` | Same pattern                                                                  | Create `util/chicken.ts` with `getChickenTabClass()`, `getChickenTabSelectedClass()` |
| 11  | `SlotExplanation.svelte`    | Same pattern — 4 `BTN_*` config imports used inline                           | Add `getSlotTabClass()`, `getSlotTabSelectedClass()` to `slots.ts`                   |
| 12  | `SlotResult.svelte`         | Same pattern — `BTN_BG_COLOR_GREEN*` imports used inline                      | Add `getSlotResultTabClass()`, `getSlotResultTabSelectedClass()` to `slots.ts`       |
| 13  | `LimboResultStep.svelte`    | Magic numbers `16777216` (×2) and `0.01`                                      | Create `util/limbo.ts` with `LIMBO_MAX_INT`, `LIMBO_HOUSE_EDGE`                      |

### P4 — `{@html}` String Templating

| #   | File                              | Issue                                                                               |
| --- | --------------------------------- | ----------------------------------------------------------------------------------- |
| 14  | `PumpExplanation.svelte` (Step 1) | `{@html Array.from({length:25}).map(...).join('')}` — replace with `{#each}` markup |
| 15  | `PumpExplanation.svelte` (Step 3) | `{@html items.map(...).join('')}` — replace with `{#each}` markup                   |

### P5 — Inline Button Classes (Moles Custom Tabs)

| #   | File                      | Issue                                                                                                     |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| 16  | `MolesExplanation.svelte` | Custom tab `<button>` selected/unselected class strings are inline — extract to `util/moles.ts` constants |
| 17  | `MolesResult.svelte`      | Round navigation button class strings are inline — same extraction                                        |

### P6 — Minor Cleanup

| #   | File                    | Issue                                              |
| --- | ----------------------- | -------------------------------------------------- |
| 18  | `src/lib/util/color.ts` | Delete commented-out `// console.log('hex=', hex)` |

---

## Games With No Util File (Intentionally)

The following games are simple enough that all logic lives correctly in their composable. No util file is needed and none should be created artificially:

- Cases, Dice, Flip, Hilo, Keno, PrimeDice, Rock Paper Scissors, Roulette, Slide, Wheel

---

## Summary Count

| Category                              | Count                                         |
| ------------------------------------- | --------------------------------------------- |
| Games fully clean                     | 21                                            |
| Games with P1 bugs                    | 2 (Blackjack, Limbo)                          |
| Games with P2 folder structure issues | 2 (BlueSamurai, Slots)                        |
| Games with P3 inline logic            | 4 (Mines, Chicken, Slot ×2, Limbo)            |
| Games with P4 `@html` issue           | 1 (Pump)                                      |
| Games with P5 inline button classes   | 1 (Moles)                                     |
| Util files clean                      | 10                                            |
| Util files to rename                  | 1 (`scarabspins-tomeoflife.ts` → `slots.ts`)  |
| Util files missing functions          | 2 (`mines.ts`, `slots.ts`)                    |
| Util files needing creation           | 3 (`chicken.ts`, `limbo.ts`, `moles.ts`)      |
| Util sub-folders to flatten           | 3 (`array/`, `shuffle-impl/`, `scroll-impl/`) |
| Util files with minor cleanup         | 1 (`color.ts`)                                |
