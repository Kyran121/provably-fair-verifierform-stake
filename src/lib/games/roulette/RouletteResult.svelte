<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed } from '$lib/types';
  import RouletteBoard from '$lib/games/roulette/RouletteBoard.svelte';
  import Loader from '$lib/games/Loader.svelte';

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
  <div class="mb-4 flex justify-center">
    <div
      class="inline-flex min-w-[100px] flex-col items-center justify-center rounded border-2 border-green-500 bg-green-50 px-6 py-4 shadow-lg dark:border-green-400 dark:bg-green-900/20"
    >
      <span class="mb-1 text-xs text-gray-500 dark:text-gray-400">Roulette number</span>
      <span
        data-testid="roulette-result"
        class="text-2xl font-bold text-green-600 dark:text-green-400"
        >{chosenNumberDebounced.value!}</span
      >
    </div>
  </div>
  <RouletteBoard chosenNumber={chosenNumberDebounced.value!} />
{/if}
