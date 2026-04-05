<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { MinesSeed } from '$lib/types';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import MinesBoard from '$lib/games/mines/MinesBoard.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<MinesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    mines: formValues.mines as number
  });

  const chosenMinesDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const minesBoard = Array.from({ length: 25 }).map((_v, i) => i + 1);
        const chosenMines = fisherYates(floatGenerator, minesBoard, seed.mines)
          .map((item) => item.chosen)
          .sort((a, b) => a - b);
        return chosenMines;
      },
      350
    )
  );
</script>

{#if chosenMinesDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="mines-result" class="hidden">
    {chosenMinesDebounced.value!.join(', ')}
  </p>

  <ContentBlock className="p-4">
    <MinesBoard chosenMines={chosenMinesDebounced.value!} />
  </ContentBlock>
{/if}
