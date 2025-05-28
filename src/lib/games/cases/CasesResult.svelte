<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { CasesDifficulty, CasesSeed } from '$lib/types';
  import { getPayout } from '$lib/util/cases';
  import Loader from '$lib/games/Loader.svelte';

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
        return getPayout(seed, float);
      },
      350
    )
  );
</script>

{#if multiDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="cases-result" class="text-center text-base">
    you hit <span class="text-xl text-blue-500">{multiDebounced.value!.toFixed(2)}x</span>
  </p>
{/if}
