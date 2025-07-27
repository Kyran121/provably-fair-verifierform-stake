<script lang="ts">
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { DartsDifficulty, DartsSeed } from '$lib/types';
  import FloatGenerationStep from '../FloatGenerationStep.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import Loader from '../Loader.svelte';
  import ResultTabs from '../ResultTabs.svelte';

  let resultIndex = $state(0);

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let seed = $derived<DartsSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as DartsDifficulty
  });

  const floatsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return [{ float: floatGenerator.next().value }, { float: floatGenerator.next().value }];
      },
      350
    )
  );
</script>

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if floatsDebounced.debouncing}
      <Loader />
    {:else}
      {@const items = floatsDebounced.value!}

      <ContentBlock
        className="mt-5 mb-7 p-2 pb-4 text-center text-base text-gray-900 dark:text-white"
      >
        <p class="mb-2 text-lg">Explanation</p>
        <p class="text-sm">
          The position of the dart is generated with 2 floats, one for the rotation and one for the
          distance from the center. The distance is normalized to a range of 0 to 0.5, where 0 is
          the center and 0.5 is the edge of the dartboard. The rotation is a float value between 0
          and 1, where 0 is the top of the dartboard and 0.5 is the bottom.
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        items={items.map((item) => ({ chosen: item.float.toFixed(3) }))}
        bind:resultIndex
      />

      {@const selectedItem = items[resultIndex]}

      <FloatGenerationStep
        stepNumber={1}
        {resultIndex}
        {seed}
        float={selectedItem.float}
        hideStepNumber={true}
      />
    {/if}
  </div>
</div>
