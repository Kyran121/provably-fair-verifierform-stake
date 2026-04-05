<script lang="ts">
  import type { CasesDifficulty, CasesSeed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import CasesResultStep from '$lib/games/cases/CasesResultStep.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import paylines from '$lib/assets/cases-paylines.json';
  import { getPayout } from '$lib/util/payout';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let seed = $derived<CasesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as CasesDifficulty
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
        const float = floatGenerator.next().value;
        const payline = paylines[seed.difficulty];
        const payout = getPayout(payline, float);
        return { float, payout } satisfies Result;
      },
      350
    )
  );
</script>

<div class="mt-8 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if resultDebounced.debouncing}
      <Loader />
    {:else}
      {@const result = resultDebounced.value!}
      {@const float = result.float}

      <ContentBlock
        className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400"
      >
        <p class="font-medium">
          <span class="text-blue-600 dark:text-blue-400">Follow the steps below</span> to see how your
          case result was determined using Stake's provably fair algorithm.
        </p>
      </ContentBlock>

      <FloatGenerationStep stepNumber={1} resultIndex={0} {seed} {float} />
      <CasesResultStep stepNumber={2} {seed} {...result} />
    {/if}
  </div>
</div>
