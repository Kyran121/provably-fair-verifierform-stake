<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed } from '$lib/types';
  import RouletteBoard from '$lib/games/roulette/RouletteBoard.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const chosenNumberDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return Math.floor(floatGenerator.next().value * 37);
      },
      350
    )
  );
</script>

{#if chosenNumberDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="roulette-result" class="text-center text-base">
    roulette ball landed on <span class="text-xl {TEXT_HIGHLIGHT_COLOR}"
      >{chosenNumberDebounced.value!}</span
    >
  </p>
  <RouletteBoard chosenNumber={chosenNumberDebounced.value!} />
{/if}
