import probabilities from '$lib/assets/bluesamurai/bluesamurai-probabilities.json';
import {
  BlueSamuraiIcon,
  BlueSamuraiReelType,
  BlueSamuraiRetriggerType,
  type BlueSamuraiRound,
  type BlueSamuraiSymbol
} from '$lib/types';
import { OrderedSet } from 'immutable';
import bigDecimal from 'js-big-decimal';

type SymbolData = {
  min?: bigDecimal;
  max?: bigDecimal;
  symbol: BlueSamuraiIcon;
};

export const innerTileProbabilitySummed = getInnerTileProbabilitySummed();
export const outerTileProbabilitySummed = getOuterTileProbabilitySummed();

function getInnerTileProbabilitySummed() {
  const summed = [];
  let inner = new bigDecimal(0);
  for (const probability of probabilities) {
    inner = inner.add(new bigDecimal(probability.inner));
    summed.push({ max: inner, symbol: probability.symbol });
  }
  return summed;
}

function getOuterTileProbabilitySummed() {
  const summed = [];
  let outer = new bigDecimal(0);
  for (const probability of probabilities) {
    if (probability.outer === 0) continue;

    outer = outer.add(new bigDecimal(probability.outer));
    summed.push({ max: outer, symbol: probability.symbol });
  }
  return summed;
}

export function isLeftOuterReelSamurais(round: BlueSamuraiRound) {
  return round.symbols.slice(0, 3).every(({ icon }) => icon === BlueSamuraiIcon.SAMURAI);
}

export function isRightOuterReelSamurais(round: BlueSamuraiRound) {
  return round.symbols.slice(-3).every(({ icon }) => icon === BlueSamuraiIcon.SAMURAI);
}

export function simulateRounds(floatGenerator: Generator<number, number, number>) {
  let rounds = 1;
  let specialRounds = 0;
  const allRounds: BlueSamuraiRound[] = [];
  let stuckSamurais: OrderedSet<number> = OrderedSet([]);
  let totalBonusRounds = 0;
  let bonusSpin = 0;
  let round = 1;

  while (rounds > 0) {
    const symbols: BlueSamuraiSymbol[] = [];
    let retrigger = false;
    let retriggerType = undefined;
    const specialRound = specialRounds > 0;
    let scatters = 0;
    const stuckSamuraisBefore = stuckSamurais;
    for (let i = 0; i < 18; i++) {
      const outerReel = i < 3 || i > 14;
      //float not generated for outer reels on special rounds
      let float = undefined;
      if (!(specialRound && outerReel)) {
        float = floatGenerator.next().value;
      }
      const reelType = outerReel ? BlueSamuraiReelType.OUTER : BlueSamuraiReelType.INNER;
      const {
        min,
        max,
        symbol: icon
      }: SymbolData = outerReel && specialRound
        ? //outer reels are only samurais in special rounds
          { min: undefined, max: undefined, symbol: BlueSamuraiIcon.SAMURAI }
        : findSymbol(float!, reelType);

      if (icon === BlueSamuraiIcon.SCATTER) {
        scatters++;
      }
      if (specialRound && !stuckSamurais.has(i) && icon === BlueSamuraiIcon.SAMURAI && !outerReel) {
        stuckSamurais = stuckSamurais.add(i);
      }
      symbols.push({ float, icon, reelType, min, max, index: i });
    }
    const specialRoundTrigger = specialRounds === 0 && isSpecialRoundTrigger(symbols);
    if (scatters >= 3) {
      //bonus trigger
      retrigger = true;
      retriggerType = BlueSamuraiRetriggerType.BONUS;
      totalBonusRounds += 10;
    } else if (specialRounds === 0) {
      //special round trigger
      if (specialRoundTrigger) {
        retrigger = true;
        retriggerType = BlueSamuraiRetriggerType.SPECIAL;
      }
    }
    allRounds.push({
      retrigger,
      retriggerType,
      round: round++,
      specialRound,
      bonusSpin,
      specialSpin: specialRound ? 5 - specialRounds + 1 : undefined,
      stuckSamurais: specialRound ? stuckSamurais : undefined,
      newlyLockedSamurais: specialRound ? stuckSamurais.subtract(stuckSamuraisBefore) : undefined,
      totalBonusRounds,
      symbols
    });
    if (specialRounds === 0) {
      bonusSpin++;
    }
    specialRounds = Math.max(specialRounds - 1, 0);
    if (specialRounds === 0) {
      //special rounds concluded
      stuckSamurais = stuckSamurais.clear();
    }
    rounds--;
    if (scatters >= 3) {
      rounds += 10;
    } else if (specialRoundTrigger) {
      specialRounds += 5;
      rounds += 5;
    }
  }
  return allRounds;
}

function isSpecialRoundTrigger(symbols: BlueSamuraiSymbol[]) {
  return (
    symbols.slice(0, 3).every(({ icon }) => icon === BlueSamuraiIcon.SAMURAI) ||
    symbols.slice(-3).every(({ icon }) => icon === BlueSamuraiIcon.SAMURAI)
  );
}

function findSymbol(float: number, innerOrOuter: BlueSamuraiReelType): SymbolData {
  const probabilities =
    innerOrOuter === BlueSamuraiReelType.INNER
      ? innerTileProbabilitySummed
      : outerTileProbabilitySummed;

  let symbol: BlueSamuraiIcon | null = null;
  let min: bigDecimal | null = null;
  let max: bigDecimal | null = null;
  for (let i = 0; i < probabilities.length; i++) {
    if (new bigDecimal(float).compareTo(probabilities[i].max) < 0) {
      symbol = probabilities[i].symbol as BlueSamuraiIcon;
      min = probabilities[i - 1]?.max || new bigDecimal(0);
      max = probabilities[i].max;
      break;
    }
  }
  return { symbol: symbol!, min: min!, max: max! };
}
