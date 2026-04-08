<script lang="ts">
  import { usePumpMultiplier } from '$lib/composables';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();
  const pump = usePumpMultiplier(() => formValues);

  // The death index is the minimum chosen position across all Fisher-Yates draws.
  // Stake uses 1-based positions, so we add 1 to each chosen value before finding min.
  // payline[deathIndex - 1] is the max achievable multiplier.
  const deathIndex = $derived(
    pump.items ? Math.min(...pump.items.map((item) => item.chosen + 1)) : -1
  );
  const maxMulti = $derived(
    deathIndex > pump.payline.length
      ? null
      : deathIndex > 0
        ? pump.payline[deathIndex - 1]
        : pump.payline[0]
  );
</script>

{#if pump.isCalculating}
  <Loader />
{:else}
  {@const maxIndex = maxMulti ? pump.payline.indexOf(maxMulti) : null}
  {@const deathMulti =
    maxIndex && maxIndex + 1 < pump.payline.length ? pump.payline[maxIndex + 1] : null}

  <ContentBlock className="p-4">
    <!-- Legend -->
    <div class="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
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

    <!-- Simplified result boxes -->
    <div class="flex gap-2">
      <div
        class="flex flex-1 items-center justify-center rounded border-2 border-green-500 bg-green-50 px-4 py-3 text-center ring-2 ring-green-400 dark:border-green-400 dark:bg-green-900/30 dark:ring-green-500"
      >
        <span class="text-lg font-bold text-green-800 dark:text-green-300"
          >{maxMulti?.toFixed(2)}x</span
        >
      </div>
      {#if deathMulti !== null}
        <div
          class="flex flex-1 items-center justify-center rounded border-2 border-red-400 bg-red-50 px-4 py-3 text-center ring-2 ring-red-300 dark:border-red-500 dark:bg-red-900/20 dark:ring-red-500"
        >
          <span class="text-lg font-bold text-red-600 dark:text-red-400"
            >{deathMulti.toFixed(2)}x</span
          >
        </div>
      {/if}
    </div>
  </ContentBlock>
{/if}
