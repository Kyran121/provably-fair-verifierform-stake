<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const crashPointDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return (
          Math.floor(
            (16777216 / (Math.floor(floatGenerator.next().value * 16777216) + 1)) * (1 - 0.01) * 100
          ) / 100
        );
      },
      350
    )
  );
</script>

{#if crashPointDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="limbo-result" class="text-center text-base">
    you crashed at <span class="text-xl {TEXT_HIGHLIGHT_COLOR}"
      >{crashPointDebounced.value!.toFixed(2)}x</span
    >
  </p>
{/if}
