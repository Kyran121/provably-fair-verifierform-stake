<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed } from '$lib/types';
  import KenoBoard from '$lib/games/keno/KenoBoard.svelte';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import Loader from '$lib/games/Loader.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/config';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const chosenNumbersDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const kenoBoard = Array.from({ length: 40 }).map((_v, i) => i + 1);
        const chosenNumbers = fisherYates(floatGenerator, kenoBoard, 10)
          .map((item) => item.chosen)
          .sort((a, b) => a - b);
        return chosenNumbers;
      },
      350
    )
  );
</script>

{#if chosenNumbersDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="keno-result" class="hidden text-center text-base">
    keno numbers are:<br /><span class="text-xl {TEXT_HIGHLIGHT_COLOR}"
      >{chosenNumbersDebounced.value!.join(', ')}</span
    >
  </p>
  <KenoBoard chosenNumbers={chosenNumbersDebounced.value!} />
{/if}
