import { Direction, type Item, type Risk } from '$lib/types';
import paylines from '$lib/assets/plinko-paylines.json';
import { shuffle } from '$lib/util/shuffle-impl/shuffle';

const DIRECTIONS = Object.values(Direction);

export function getDirections(
  floatGenerator: Generator<number, number, number>,
  n: number
): Item<Direction>[] {
  return shuffle(floatGenerator, DIRECTIONS, n);
}

export function getPayline(risk: Risk, rows: number) {
  const halfPayline = paylines[rows as unknown as keyof typeof paylines][risk];
  const fullPayline = (rows % 2 === 0 ? halfPayline.slice(1) : halfPayline.slice(0))
    .reverse()
    .concat(halfPayline);
  return fullPayline;
}

export function getPayout(risk: Risk, rows: number, directions: Item<Direction>[]): number {
  return getPayline(risk, rows)[getDropIndex(directions, rows)];
}

function getDropIndex(directions: Item<Direction>[], rows: number) {
  const target = directions[0].chosenIndex === 0 ? 1 : 0;
  let dropIndex = rows;
  for (let i = 0; i < rows - 1; i++) {
    dropIndex -= directions[i + 1].chosenIndex === target ? 1 : 0;
  }
  return Math.abs(dropIndex);
}
