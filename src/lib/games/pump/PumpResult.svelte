<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { PumpDifficulty, PumpSeed } from '$lib/types';
  import paylines from '$lib/assets/pump-paylines.json';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import { BG_COLOR, PUMP_DIFFICULTY_TO_SLICE } from '$lib/constants';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<PumpSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as PumpDifficulty
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
        const slice = PUMP_DIFFICULTY_TO_SLICE[seed.difficulty];
        const indexes = Array.from({ length: 25 }).map((_v, i) => i);
        const pumpIndex = Math.min(
          ...fisherYates(floatGenerator, indexes, slice).map((item) => item.chosen)
        );
        return payline[pumpIndex];
      },
      350
    )
  );
</script>

{#if multiDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="pump-result" class="hidden text-center text-base">
    popped at <span class="text-xl text-purple-500">{multiDebounced.value!.toFixed(2)}x</span>
  </p>

  <div class="flex gap-1 overflow-x-scroll pb-5 md:gap-1.5">
    {#each payline as multi, i (i)}
      {#if multi === multiDebounced.value!}
        <div class="col p-2 text-center font-bold {BG_COLOR}" bind:this={selectedEl}>
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
