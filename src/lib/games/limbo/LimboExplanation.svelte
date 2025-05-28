<script lang="ts">
  import type { Seed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import LimboResultStep from '$lib/games/limbo/LimboResultStep.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const floatDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return floatGenerator.next().value;
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if floatDebounced.debouncing}
      <Loader />
    {:else}
      <FloatGenerationStep stepNumber={1} resultIndex={0} {seed} float={floatDebounced.value!} />
      <LimboResultStep stepNumber={2} float={floatDebounced.value!} />
    {/if}
  </div>
</div>
