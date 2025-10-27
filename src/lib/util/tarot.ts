import minorArcanaEasy from '$lib/assets/tarot/tarot-minor-arcana-easy.json';
import minorArcanaMedium from '$lib/assets/tarot/tarot-minor-arcana-medium.json';
import minorArcanaHard from '$lib/assets/tarot/tarot-minor-arcana-hard.json';
import minorArcanaExpert from '$lib/assets/tarot/tarot-minor-arcana-expert.json';
import majorArcanaEasy from '$lib/assets/tarot/tarot-major-arcana-easy.json';
import majorArcanaMedium from '$lib/assets/tarot/tarot-major-arcana-medium.json';
import majorArcanaHard from '$lib/assets/tarot/tarot-major-arcana-hard.json';
import majorArcanaExpert from '$lib/assets/tarot/tarot-major-arcana-expert.json';
import type { TarotCard, TarotDifficulty, TarotArcanaType } from '$lib/types';

const minorArcanaByDifficulty = {
  easy: minorArcanaEasy,
  medium: minorArcanaMedium,
  hard: minorArcanaHard,
  expert: minorArcanaExpert
};

const majorArcanaByDifficulty = {
  easy: majorArcanaEasy,
  medium: majorArcanaMedium,
  hard: majorArcanaHard,
  expert: majorArcanaExpert
};

export function findCard(
  value: number,
  difficulty: TarotDifficulty,
  arcanaType: TarotArcanaType
): TarotCard | null {
  const cards =
    arcanaType === 'minor'
      ? minorArcanaByDifficulty[difficulty]
      : majorArcanaByDifficulty[difficulty];

  for (const entry of cards) {
    if (value >= entry.min) {
      return entry;
    }
  }
  return null;
}

export function getCards(difficulty: TarotDifficulty, arcanaType: TarotArcanaType): TarotCard[] {
  return arcanaType === 'minor'
    ? minorArcanaByDifficulty[difficulty]
    : majorArcanaByDifficulty[difficulty];
}
