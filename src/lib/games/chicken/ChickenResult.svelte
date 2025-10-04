<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { ChickenDifficulty, ChickenSeed } from '$lib/types';
  import paylines from '$lib/assets/chicken-paylines.json';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import { BG_COLOR, CHICKEN_DIFFICULTY_TO_SLICE } from '$lib/constants';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<ChickenSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as ChickenDifficulty
  });

  const payline = $derived(paylines[seed.difficulty]);

  let selectedEl: HTMLDivElement | null = $state(null);

  $effect(() => {
    selectedEl?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });

  const multiDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const slice = CHICKEN_DIFFICULTY_TO_SLICE[seed.difficulty];
        const indexes = Array.from({ length: 20 }).map((_v, i) => i);
        const deathIndex = Math.min(
          ...fisherYates(floatGenerator, indexes, slice).map((item) => item.chosen)
        );
        return deathIndex - 1 < 0 ? 1 : payline[deathIndex - 1];
      },
      350
    )
  );
</script>

{#if multiDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="pump-result" class="hidden text-center text-base">
    highest payout <span class="text-xl text-purple-500">{multiDebounced.value!.toFixed(2)}x</span>
  </p>

  <div class="flex gap-1 overflow-x-scroll pb-5 md:gap-1.5">
    {#each payline as multi, i (i)}
      {#if multi === multiDebounced.value!}
        <div class="col p-2 text-center {BG_COLOR}" bind:this={selectedEl}>
          <span class="text-xs">({i})</span>
          {multi.toFixed(2)}x
        </div>
      {:else}
        <div class="col bg-gray-200 p-2 text-center dark:bg-gray-700">
          <span class="text-xs">({i})</span>
          {multi.toFixed(2)}x
        </div>
      {/if}
    {/each}
  </div>
{/if}
