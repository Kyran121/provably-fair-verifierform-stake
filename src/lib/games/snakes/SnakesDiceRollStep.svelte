<script lang="ts">
  import type { Item } from '$lib/types';

  const {
    stepNumber,
    float,
    chosen,
    chosenIndex
  }: {
    stepNumber: number;
  } & Item<number> = $props();

  const rollOptions = Array.from({ length: 6 }).map((_v, i) => i + 1);
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into dice roll</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Snakes</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>rollOptions = [ {rollOptions.join(', ')} ]</p>
    <p>numberOfRollOptions = {rollOptions.length}</p>

    <p class="mt-4">float = {float.toFixed(12)}</p>

    <p class="mt-4">chosenIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> *
      <span class="font-bold text-blue-500">&lbrace;numberOfRollOptions&rbrace;</span>)
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> *
      <span class="font-bold text-blue-500">{rollOptions.length}</span>)
    </p>
    <p>= {chosenIndex}</p>

    <p class="mt-4">rollNumber</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;rollOptions[directionIndex]&rbrace;</span>
    </p>
    <p>= <span class="font-bold text-blue-500">&lbrace;rollOptions[{chosenIndex}]&rbrace;</span></p>
    <p>= {chosen}</p>
  </div>
</div>
