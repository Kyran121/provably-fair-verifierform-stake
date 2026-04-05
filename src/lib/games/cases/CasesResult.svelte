<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { CasesDifficulty, CasesSeed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import paylines from '$lib/assets/cases-paylines.json';
  import { getPayout } from '$lib/util/payout';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<CasesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as CasesDifficulty
  });

  const multiDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const float = floatGenerator.next().value;
        const payline = paylines[seed.difficulty];
        return getPayout(payline, float);
      },
      350
    )
  );
</script>

{#if multiDebounced.debouncing}
  <Loader />
{:else}
  <div data-testid="cases-result" class="text-center text-base">
    <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">Payout multiplier</p>
    <div
      class="inline-flex min-w-[100px] flex-col items-center justify-center rounded border-2 border-green-500 bg-green-50 px-6 py-4 shadow-lg dark:border-green-400 dark:bg-green-900/20"
    >
      <span class="text-3xl font-bold text-gray-800 dark:text-gray-100"
        >{multiDebounced.value!.toFixed(2)}x</span
      >
    </div>
  </div>
{/if}
