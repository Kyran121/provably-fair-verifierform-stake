<script lang="ts">
  import type { FisherYatesItem } from '$lib/types';

  const {
    stepNumber,
    resultIndex,
    float,
    chosen,
    chosenIndex,
    chosenIndexes
  }: {
    stepNumber: number;
    resultIndex: number;
  } & FisherYatesItem<number> = $props();

  const { previousIndexes, multiplierIndexesMinusPreviousIndexes } = $derived.by(() => {
    const multiplierIndexes = Array.from({ length: 25 }).map((_v, i) => i);
    const previousIndexes = chosenIndexes
      .slice(0, -1)
      .map((i) => multiplierIndexes.splice(i, 1)[0]);
    return { previousIndexes, multiplierIndexesMinusPreviousIndexes: multiplierIndexes };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Use float to get random index</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Pump</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>indexesRemaining = 25</p>
    <p>previousIndexCount = {resultIndex}</p>
    <p>previousIndexes = {`[${previousIndexes.join(', ')}]`}</p>
    <p class="mt-4">
      indexesMinusPreviousIndexes = {`[${multiplierIndexesMinusPreviousIndexes.join(', ')}]`}
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">chosen</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> * (<span
        class="font-bold text-blue-500">&lbrace;multipliers&rbrace;</span
      >
      -
      <span class="font-bold text-blue-500">&lbrace;resultIndex&rbrace;</span>))
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> * (<span
        class="font-bold text-blue-500">25</span
      >
      -
      <span class="font-bold text-blue-500">{resultIndex}</span>))
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">randomIndex</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;indexesMinusPreviousIndexes[</span>
    </p>
    <p class="indent-4 font-bold text-blue-500">chosen</p>
    <p class="font-bold text-blue-500">]&rbrace;</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;indexesMinusPreviousIndexes[</span>
    </p>
    <p class="indent-4 font-bold text-blue-500">{chosenIndex}</p>
    <p class="font-bold text-blue-500">]&rbrace;</p>
    <p>= {chosen}</p>
  </div>
</div>
