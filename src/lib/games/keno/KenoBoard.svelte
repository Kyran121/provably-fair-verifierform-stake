<script lang="ts">
  const { chosenNumbers }: { chosenNumbers: number[] } = $props();
  const chosenNumbersLookup = $derived(new Set(chosenNumbers));

  const getColorClass = (n: number) =>
    chosenNumbersLookup.has(n)
      ? 'bg-blue-400 dark:bg-blue-500 font-bold'
      : 'dark:bg-gray-600 bg-gray-400';

  const columns = Array.from({ length: 40 }).map((_v, i) => i + 1);
</script>

<div class="mt-5 mb-5 rounded-lg bg-gray-200 dark:bg-gray-900 dark:text-white">
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
