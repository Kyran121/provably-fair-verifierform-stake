import { ScarabSpinsTomeOfLifeIcon, type ScarabSpinsTomeOfLifeRound } from '$lib/types';
import reels from '$lib/assets/scarabspins-tomeoflife/slot-reels.json';

export function simulateRounds(floatGenerator: Generator<number, number, number>) {
  const allRounds: ScarabSpinsTomeOfLifeRound[] = [];
  let rounds = 1;
  let totalRounds = 1;
  while (rounds > 0 && allRounds.length < 180) {
    const centerPositions = getCenterPositions(floatGenerator);
    const isRetrigger = retrigger(centerPositions.map((pos) => pos.index));
    rounds--;
    if (isRetrigger) {
      rounds += 15;
      totalRounds += 15;
    }
    allRounds.push({ centerPositions, totalRounds, retrigger: isRetrigger });
  }
  return allRounds;
}

function getCenterPositions(floatGenerator: Generator<number, number, number>) {
  const centerPositions = [];
  for (let i = 0; i < 5; i++) {
    const float = floatGenerator.next().value;
    const index = Math.floor(float * (i === 4 ? 41 : 30));
    centerPositions.push({ float, index });
  }
  return centerPositions;
}

function retrigger(centerPositions: number[]) {
  let scatters = 0;
  for (let i = 0; i < 5; i++) {
    const reelSize = i === 4 ? 41 : 30;

    const previousIndex = (centerPositions[i] - 1 < 0 ? reelSize : centerPositions[i]) - 1;
    scatters += reels[i][previousIndex] === ScarabSpinsTomeOfLifeIcon.SCATTER ? 1 : 0;

    const centerIndex = centerPositions[i];
    scatters += reels[i][centerIndex] === ScarabSpinsTomeOfLifeIcon.SCATTER ? 1 : 0;

    const nextIndex = centerPositions[i] + 1 === reelSize ? 0 : centerPositions[i] + 1;
    scatters += reels[i][nextIndex] === ScarabSpinsTomeOfLifeIcon.SCATTER ? 1 : 0;
  }
  return scatters >= 3;
}
