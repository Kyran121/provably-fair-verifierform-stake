<script lang="ts">
  import { useChickenMultiplier, useChickenResult } from '$lib/composables';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();
  const chicken = useChickenMultiplier(() => formValues);
  const result = useChickenResult(chicken.items, chicken.payline);

  const deathIndex = $derived(result.deathIndex);
  const maxMulti = $derived(result.maxMulti);
</script>

{#if chicken.isCalculating}
  <Loader />
{:else}
  {@const maxIndex = maxMulti ? chicken.payline.indexOf(maxMulti) : null}
  {@const deathMulti =
    maxIndex && maxIndex + 1 < chicken.payline.length ? chicken.payline[maxIndex + 1] : null}

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
