<script lang="ts">
  import type { CoinFlip, Item } from '$lib/types';

  const {
    stepNumber,
    float,
    chosen
  }: {
    stepNumber: number;
  } & Item<CoinFlip> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into flip</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Flip</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>flipSides = [ TAILS, HEADS ]</p>

    <p class="mt-4">float = {float.toFixed(12)}</p>

    <p class="mt-4">flip</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;flipSlides[float &lt;= 0.5 ? 0 : 1]</span>
    </p>
    <p>= <span class="font-bold text-blue-500">&lbrace;flipSlides[{float <= 0.5 ? 0 : 1}]</span></p>
    <p>= {chosen.toUpperCase()}</p>
  </div>
</div>
