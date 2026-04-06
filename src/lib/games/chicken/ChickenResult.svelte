<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { ChickenDifficulty, ChickenSeed } from '$lib/types';
  import paylines from '$lib/assets/chicken-paylines.json';
  import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
  import { CHICKEN_DIFFICULTY_TO_SLICE } from '$lib/config';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';

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
        return payline[deathIndex];
      },
      350
    )
  );
</script>

{#if multiDebounced.debouncing}
  <Loader />
{:else}
  {@const maxMulti = multiDebounced.value!}
  {@const maxIndex = payline.indexOf(maxMulti)}
  {@const deathMulti = maxIndex + 1 < payline.length ? payline[maxIndex + 1] : null}

  <p data-testid="pump-result" class="hidden">
    {maxMulti.toFixed(2)}x
  </p>

  <ContentBlock className="p-4">
    <!-- Legend -->
    <div class="mb-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
      <span class="flex items-center gap-1">
        <span
          class="inline-block h-3 w-3 rounded border-2 border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/30"
        ></span>
        Max achievable
      </span>
      {#if deathMulti !== null}
        <span class="flex items-center gap-1">
          <span
            class="inline-block h-3 w-3 rounded border-2 border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/30"
          ></span>
          Death point
        </span>
      {/if}
    </div>

    <!-- Payline strip -->
    <div class="flex gap-1 overflow-x-auto pt-2 pb-2 md:gap-1.5">
      {#each payline as multi, i (i)}
        {@const isMax = multi === maxMulti}
        {@const isDeath = deathMulti !== null && i === maxIndex + 1}
        {#if isMax}
          <div
            class="flex w-auto flex-col items-center justify-center rounded border-2 border-green-500 bg-green-50 px-2 py-2 text-center ring-2 ring-green-400 transition-all dark:border-green-400 dark:bg-green-900/30 dark:ring-green-500"
            bind:this={selectedEl}
          >
            <span class="text-[10px] font-semibold text-green-600 dark:text-green-400">✓ MAX</span>
            <span class="text-xs font-bold whitespace-nowrap text-green-800 dark:text-green-300"
              >{multi.toFixed(2)}x</span
            >
          </div>
        {:else if isDeath}
          <div
            class="flex w-auto flex-col items-center justify-center rounded border-2 border-red-400 bg-red-50 px-2 py-2 text-center ring-2 ring-red-300 transition-all dark:border-red-500 dark:bg-red-900/20 dark:ring-red-500"
          >
            <span class="text-[10px] font-semibold text-red-500 dark:text-red-400">💀</span>
            <span class="text-xs font-bold whitespace-nowrap text-red-600 dark:text-red-400"
              >{multi.toFixed(2)}x</span
            >
          </div>
        {:else}
          <div
            class="flex w-auto flex-col items-center justify-center rounded border-2 border-gray-200 bg-gray-50 px-2 py-2 text-center ring-2 ring-transparent transition-all dark:border-gray-600 dark:bg-gray-800"
          >
            <span class="text-[10px] text-gray-400 dark:text-gray-500">({i})</span>
            <span class="text-xs font-bold whitespace-nowrap text-gray-600 dark:text-gray-400"
              >{multi.toFixed(2)}x</span
            >
          </div>
        {/if}
      {/each}
    </div>
  </ContentBlock>
{/if}
