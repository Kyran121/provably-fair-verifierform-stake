import { DARTS_COLOR_TO_MULTI } from '$lib/config';
import { DartsColor, DartsDifficulty } from '$lib/types';

export function multiForDart(difficulty: DartsDifficulty, color: DartsColor) {
  return DARTS_COLOR_TO_MULTI[difficulty][color];
}

export function colorForDart(difficulty: DartsDifficulty, rotation: number, normDist: number) {
  if (difficulty === DartsDifficulty.EASY) {
    return easyColorForDart(rotation, normDist);
  } else if (difficulty === DartsDifficulty.MEDIUM) {
    return mediumColorForDart(rotation, normDist);
  } else if (difficulty === DartsDifficulty.HARD) {
    return hardColorForDart(rotation, normDist);
  } else if (difficulty === DartsDifficulty.EXPERT) {
    return expertColorForDart(rotation, normDist);
  }
  return DartsColor.DARK_GRAY;
}

function easyColorForDart(rotation: number, normDist: number): DartsColor {
  const r = normDist * 1000;

  if (r <= 62.5) return DartsColor.GREEN;
  if (r <= 275) return DartsColor.DARK_GRAY;
  if (r <= 375) return DartsColor.LIGHT_GRAY;
  if (r < 450) return wedgeColor(rotation); // strictly inside (375, 450)
  return DartsColor.DARK_GRAY;
}

function mediumColorForDart(rotation: number, normDist: number): DartsColor {
  const r = normDist * 1000;

  if (r <= 50) return DartsColor.GREEN;
  if (r <= 225) return DartsColor.DARK_GRAY;
  if (r <= 350) return DartsColor.LIGHT_GRAY;
  if (r < 400) return wedgeColor(rotation); // strictly inside (350, 400)
  return DartsColor.DARK_GRAY;
}

function hardColorForDart(rotation: number, normDist: number): DartsColor {
  const r = normDist * 1000;

  if (r <= 30) return DartsColor.GREEN;
  if (r <= 200) return DartsColor.DARK_GRAY;
  if (r <= 330) return DartsColor.LIGHT_GRAY;
  if (r < 375) return hardWedgeColor(rotation); // strictly inside (330, 375)
  return DartsColor.DARK_GRAY;
}

function expertColorForDart(rotation: number, normDist: number): DartsColor {
  const r = normDist * 1000;

  if (r <= 10) return DartsColor.GREEN;
  if (r <= 250) return DartsColor.DARK_GRAY;
  if (r <= 355) return DartsColor.LIGHT_GRAY;
  if (r < 375) return expertWedgeColor(rotation); // strictly inside (355, 375)
  return DartsColor.DARK_GRAY;
}

function wedgeColor(rotation: number): DartsColor {
  const deg = (((rotation % 1) + 1) % 1) * 360; // 0 ≤ deg < 360
  const bin = Math.floor(deg / 20); // bins: [0,20),[20,40),...,[340,360)
  if ([1, 5, 9, 13, 15].includes(bin)) return DartsColor.ORANGE; // orange
  if ([3, 7, 11, 17].includes(bin)) return DartsColor.RED; // red
  return DartsColor.YELLOW; // yellow
}

function hardWedgeColor(rotation: number): DartsColor {
  const deg = (((rotation % 1) + 1) % 1) * 360; // 0 ≤ deg < 360
  const bin = Math.floor(deg / 20); // bins: [0,20),[20,40),...,[340,360)
  if ([1, 3, 7, 9, 13, 15].includes(bin)) return DartsColor.ORANGE; // orange
  if ([5, 11, 17].includes(bin)) return DartsColor.RED; // red
  return DartsColor.YELLOW; // yellow
}

function expertWedgeColor(rotation: number): DartsColor {
  const deg = (((rotation % 1) + 1) % 1) * 360; // 0 ≤ deg < 360
  const bin = Math.floor(deg / 20); // bins: [0,20),[20,40),...,[340,360)
  if ([1, 7, 10, 16].includes(bin)) return DartsColor.ORANGE; // orange
  if ([4, 13].includes(bin)) return DartsColor.RED; // red
  return DartsColor.YELLOW; // yellow
}
