<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { CasesDifficulty, CasesSeed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';
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
  <p data-testid="cases-result" class="text-center text-base">
    you hit <span class="text-xl {TEXT_HIGHLIGHT_COLOR}">{multiDebounced.value!.toFixed(2)}x</span>
  </p>
{/if}
