<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import { RockPaperScissorsOutcome, type Seed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import { BG_COLOR_GRAY } from '$lib/constants';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const outcomes = Object.values(RockPaperScissorsOutcome);

  const resultsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const results: RockPaperScissorsOutcome[] = [];
        for (let i = 0; i < 20; i++) {
          results.push(outcomes[Math.floor(floatGenerator.next().value * 3)]);
        }
        return results;
      },
      350
    )
  );
</script>

{#if resultsDebounced.debouncing}
  <Loader />
{:else}
  {@const results = resultsDebounced.value!}

  <p data-testid="rockpaperscissors-result" class="hidden text-center text-base">
    {results}
  </p>

  <p class="mb-3 text-center">first 20 rounds</p>

  <div class="mb-5">
    <div class="grid grid-cols-6 gap-1 md:grid-cols-7 md:gap-1.5">
      {#each results as result, i (i)}
        <div class="col text-center {BG_COLOR_GRAY}">
          <span class="text-xs">({i + 1})</span><br />
          {result}
        </div>
      {/each}
    </div>
  </div>
{/if}
