<script lang="ts">
  import { RockPaperScissorsOutcome, type Seed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import RockPaperScissorsResultStep from '$lib/games/rockpaperscissors/RockPaperScissorsResultStep.svelte';
  import { shuffle } from '$lib/util/shuffle-impl/shuffle';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const outcomes = Object.values(RockPaperScissorsOutcome);

  let resultIndex = $state(0);

  let seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const resultsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return shuffle(floatGenerator, outcomes, 20);
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if resultsDebounced.debouncing}
      <Loader />
    {:else}
      {@const results = resultsDebounced.value!}

      <ResultTabs {seed} items={results} bind:resultIndex tabWidthClass="w-15" />

      {@const result = results[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={result.float} />
      <RockPaperScissorsResultStep stepNumber={2} {...result} />
    {/if}
  </div>
</div>
