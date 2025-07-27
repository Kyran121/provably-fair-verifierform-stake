<script lang="ts">
  import type { BarsDifficulty, BarsSeed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import { getPayout } from '$lib/util/payout';
  import ResultTabs from '../ResultTabs.svelte';
  import paylines from '$lib/assets/bars-paylines.json';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import BarsResultStep from './BarsResultStep.svelte';

  let resultIndex = $state(0);

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let seed = $derived<BarsSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as BarsDifficulty,
    barCount: formValues.barcount as number
  });

  type Result = {
    float: number;
    payout: number;
  };

  const resultDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const results = [];
        for (let i = 0; i < 30; i++) {
          const float = floatGenerator.next().value;
          const payline = paylines[seed.difficulty];
          const multiNotDivided = getPayout(payline, float);
          const multi = multiNotDivided / seed.barCount;
          results.push({ multiNotDivided, multi, float });
        }
        return results;
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if resultDebounced.debouncing}
      <Loader />
    {:else}
      {@const result = resultDebounced.value!}

      <ContentBlock className="mb-7 p-2 text-center text-base text-gray-900 dark:text-white">
        <p>
          Multis generated in the order shown below. Click a multi to find out how it was generated
          using stake's provably fair algorithm
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        items={result.map((item) => ({ chosen: `${item.multi.toFixed(2)}x` }))}
        bind:resultIndex
      />

      {@const selectedItem = result[resultIndex]}
      {@const float = selectedItem.float}

      <FloatGenerationStep stepNumber={1} resultIndex={0} {seed} {float} />
      <BarsResultStep stepNumber={2} {seed} {...selectedItem} />
    {/if}
  </div>
</div>
