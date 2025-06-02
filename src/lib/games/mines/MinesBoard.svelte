<script lang="ts">
  import diamondIcon from '$lib/assets/mines/icons/diamond-50x50.png';
  import mineIcon from '$lib/assets/mines/icons/bomb-50x50.png';
  import { BG_COLOR, BG_COLOR_GRAY } from '$lib/constants';

  const { chosenMines }: { chosenMines: number[] } = $props();
  const chosenMinesLookup = $derived(new Set(chosenMines));

  const getColorClass = (n: number) => (chosenMinesLookup.has(n) ? BG_COLOR : BG_COLOR_GRAY);

  const columns = Array.from({ length: 25 }).map((_v, i) => i + 1);
</script>

<div class="mt-5 mb-5 rounded-lg bg-gray-200 dark:bg-gray-900 dark:text-white">
  <!-- Number Grid -->
  <div class="grid grid-cols-5 gap-1 md:gap-1.5">
    {#each columns as col, n (n)}
      <div class={['grid grid-cols-2 gap-1 md:gap-1.5', getColorClass(col)]}>
        <div class="flex items-center justify-center">{col}</div>
        <div>
          <img
            class="relative scale-80 object-scale-down"
            src={chosenMinesLookup.has(col) ? mineIcon : diamondIcon}
            alt={chosenMinesLookup.has(col) ? 'mine' : 'diamond'}
          />
        </div>
      </div>
    {/each}
  </div>
</div>
