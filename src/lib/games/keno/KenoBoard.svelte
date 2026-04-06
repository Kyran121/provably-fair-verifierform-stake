<script lang="ts">
  import { BG_COLOR } from '$lib/config';

  const { chosenNumbers }: { chosenNumbers: number[] } = $props();
  const chosenNumbersLookup = $derived(new Set(chosenNumbers));

  const getColorClass = (n: number) =>
    chosenNumbersLookup.has(n) ? BG_COLOR : 'dark:bg-gray-500 bg-gray-300';

  const columns = Array.from({ length: 40 }).map((_v, i) => i + 1);
</script>

<div class="mt-5 mb-5 rounded-lg dark:bg-gray-900 dark:text-white">
  <!-- Number Grid -->
  <div class="grid grid-cols-8 gap-1 md:gap-1.5">
    {#each columns as col, n (n)}
      <div
        class={['flex aspect-square h-10 w-full items-center justify-center', getColorClass(col)]}
      >
        {col}
      </div>
    {/each}
  </div>
</div>
