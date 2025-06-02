<script lang="ts">
  import { BG_COLOR, BG_COLOR_GRAY, BG_COLOR_GREEN, BG_COLOR_RED } from '$lib/constants';

  const { chosenNumber }: { chosenNumber: number } = $props();

  const redNumbers = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 28, 30, 32, 34, 36]);

  const getColorClass = (n: number) =>
    n === chosenNumber ? BG_COLOR : redNumbers.has(n) ? BG_COLOR_GRAY : BG_COLOR_RED;

  const columns: number[] = [];
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j < 12; j++) {
      columns.push(3 * (j + 1) - i);
    }
  }
</script>

<div class="mt-3 flex gap-1 text-xs sm:text-sm md:gap-1.5 dark:text-white">
  <!-- Zero Tile -->
  <div class="flex flex-col">
    <div
      class={[
        'flex h-[calc(3*2.5rem+2*0.25rem)] w-[1.5rem] items-center justify-center md:w-[2.5rem]',
        chosenNumber === 0 ? BG_COLOR : BG_COLOR_GREEN
      ]}
    >
      0
    </div>
  </div>

  <!-- Number Grid -->
  <div class="grid flex-1 grid-cols-12 gap-1 md:gap-1.5">
    {#each columns as col, n (n)}
      <div
        class={['flex aspect-square h-full w-full items-center justify-center', getColorClass(col)]}
      >
        {col}
      </div>
    {/each}
  </div>
</div>
