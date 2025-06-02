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

  const rollNumberDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return Math.floor(floatGenerator.next().value * 10001) / 100;
      },
      350
    )
  );
</script>

{#if rollNumberDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="dice-result" class="text-center text-base">
    you rolled a <span class="text-xl {TEXT_HIGHLIGHT_COLOR}"
      >{rollNumberDebounced.value!.toFixed(2)}</span
    >
  </p>
{/if}
