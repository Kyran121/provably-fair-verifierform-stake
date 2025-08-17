import { FloatGenerator } from '$lib/generator/FloatGenerator';
import { it } from 'vitest';
import cards from '$lib/assets/packs/packs-payline.json';

it('will not stop betting until all 240 asset paths are discovered', () => {
  const clientSeed = '2Gb-U__XyD';
  const serverSeed = 'fad1d904fc884b817775353e8969741728d50b509cfdb0e2d854730ee21e446e';

  const foundAssets = new Set();
  const nonces = new Set();

  let nonce = 0;
  while (foundAssets.size < 240) {
    const floatGenerator = FloatGenerator({ clientSeed, serverSeed, nonce });

    //extract 5 floats
    for (let i = 0; i < 5; i++) {
      const card = findCard(floatGenerator.next().value);
      const cardId = card!.cardId;
      if (!foundAssets.has(cardId)) {
        console.log(`found asset id ${cardId} at nonce ${nonce}`);

        nonces.add(nonce);
        foundAssets.add(cardId);
      }
    }

    nonce++;
  }

  console.log('nonces', JSON.stringify([...nonces], null, 4));
});

function findCard(value: number) {
  for (const entry of cards) {
    if (value >= entry.min) {
      return entry;
    }
  }
}
