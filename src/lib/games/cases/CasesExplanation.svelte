<script lang="ts">
  import type { CasesDifficulty, CasesSeed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import { debouncer } from '$lib/debounce.svelte';
  import CasesResultStep from '$lib/games/cases/CasesResultStep.svelte';
  import { getPayout } from '$lib/util/cases';
  import Loader from '$lib/games/Loader.svelte';

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
        const payout = getPayout(seed, float);
        return { float, payout } satisfies Result;
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
      {@const float = result.float}

      <FloatGenerationStep stepNumber={1} resultIndex={0} {seed} {float} />
      <CasesResultStep stepNumber={2} {seed} {...result} />
    {/if}
  </div>
</div>
