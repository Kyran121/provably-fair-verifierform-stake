<script lang="ts">
  import { CoinFlip, type Item, type Seed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import FlipResultStep from '$lib/games/flip/FlipResultStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  let seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const flip = [CoinFlip.TAIL, CoinFlip.HEAD];

  const flipsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const flips: Item<CoinFlip>[] = [];
        for (let i = 0; i < 20; i++) {
          const float = floatGenerator.next().value;
          const chosenIndex = float <= 0.5 ? 0 : 1;
          const chosen = flip[chosenIndex];
          flips.push({ float, chosenIndex, chosen });
        }
        return flips;
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if flipsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = flipsDebounced.value!}

      <p class="mb-7 bg-gray-200 p-2 text-center text-base dark:bg-gray-700">
        Flips made in the order shown below. Click a flip to find out how it was generated using
        stake's provably fair algorithm
      </p>

      <ResultTabs {seed} {items} bind:resultIndex />

      {@const flip = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={flip.float} />
      <FlipResultStep stepNumber={2} {...flip} />
    {/if}
  </div>
</div>
