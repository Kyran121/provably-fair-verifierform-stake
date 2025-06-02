<script lang="ts">
  import { type Seed, Gem } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import DiamondsResultStep from '$lib/games/diamonds/DiamondsResultStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import { shuffle } from '$lib/util/shuffle-impl/shuffle';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  let gems = Object.values(Gem);

  let seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const chosenGemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return shuffle(floatGenerator, gems, 5);
      },
      350
    )
  );
</script>

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if chosenGemsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = chosenGemsDebounced.value!}

      <ContentBlock className="mb-7 p-2 text-center text-base text-gray-900 dark:text-white">
        <p>
          Gems drawn in the order shown below. Click a gem to find out how it was generated using
          stake's provably fair algorithm
        </p>
      </ContentBlock>

      <ResultTabs {seed} {items} bind:resultIndex />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <DiamondsResultStep stepNumber={2} {...selectedItem} />
    {/if}
  </div>
</div>
