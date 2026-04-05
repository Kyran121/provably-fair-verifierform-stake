<script lang="ts">
  import diamondIcon from '$lib/assets/mines/icons/diamond-50x50.png';
  import mineIcon from '$lib/assets/mines/icons/bomb-50x50.png';
  import diamondIconGray from '$lib/assets/mines/icons/diamond-50x50-gray.png';
  import mineIconGray from '$lib/assets/mines/icons/bomb-50x50-gray.png';

  const { chosenMines, highlightedMine = -1 }: { chosenMines: number[]; highlightedMine?: number } =
    $props();
  const chosenMinesLookup = $derived(new Set(chosenMines));

  const getColorClass = (n: number) =>
    chosenMinesLookup.has(n)
      ? n === highlightedMine
        ? 'border-2 border-red-500 bg-red-100 text-red-700 ring-2 ring-red-400 dark:border-red-400 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-500'
        : 'border-2 border-red-400 bg-red-50 text-red-600 ring-2 ring-transparent dark:border-red-500 dark:bg-red-900/20 dark:text-red-400'
      : n === highlightedMine
        ? 'border-2 border-green-500 bg-green-100 text-green-700 ring-2 ring-green-400 dark:border-green-400 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500'
        : 'border-2 border-gray-200 bg-gray-50 text-gray-500 ring-2 ring-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400';

  const columns = Array.from({ length: 25 }).map((_v, i) => i + 1);
</script>

<div class="grid grid-cols-5 gap-1.5 md:gap-2">
  {#each columns as col, n (n)}
    <div
      class={[
        'flex flex-col items-center justify-center rounded p-1.5 transition-all',
        getColorClass(col)
      ]}
    >
      <span class="text-xs leading-none font-bold">{col}</span>
      <div class="hidden dark:block">
        <img
          class="mt-1 h-8 w-8 object-contain"
          src={chosenMinesLookup.has(col) ? mineIcon : diamondIcon}
          alt={chosenMinesLookup.has(col) ? 'mine' : 'diamond'}
        />
      </div>
      <div class="block dark:hidden">
        <img
          class="mt-1 h-8 w-8 object-contain"
          src={chosenMinesLookup.has(col) ? mineIconGray : diamondIconGray}
          alt={chosenMinesLookup.has(col) ? 'mine' : 'diamond'}
        />
      </div>
    </div>
  {/each}
</div>
