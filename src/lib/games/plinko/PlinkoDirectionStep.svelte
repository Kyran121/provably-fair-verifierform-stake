<script lang="ts">
  import type { Direction, Item } from '$lib/types';

  const {
    stepNumber,
    float,
    chosen,
    chosenIndex
  }: {
    stepNumber: number;
  } & Item<Direction> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into direction</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Plinko</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>directions = [ L, R ]</p>
    <p>numberOfDirections = 2</p>

    <p class="mt-4">float = {float.toFixed(12)}</p>

    <p class="mt-4">directionIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> *
      <span class="font-bold text-blue-500">&lbrace;numberOfDirections&rbrace;</span>)
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float}</span> *
      <span class="font-bold text-blue-500">2</span>)
    </p>
    <p>= {chosenIndex}</p>

    <p class="mt-4">direction</p>
    <p>= <span class="font-bold text-blue-500">&lbrace;directions[directionIndex]&rbrace;</span></p>
    <p>= <span class="font-bold text-blue-500">&lbrace;directions[{chosenIndex}]&rbrace;</span></p>
    <p>= {chosen}</p>
  </div>
</div>
