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

  const { previousNumbers, minesBoardMinusPreviousMines } = $derived.by(() => {
    const minesBoard = Array.from({ length: 25 }).map((_v, i) => i + 1);
    const previousNumbers = chosenIndexes.slice(0, -1).map((i) => minesBoard.splice(i, 1)[0]);
    return { previousNumbers, minesBoardMinusPreviousMines: minesBoard };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into mine number</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Mines</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>mineSquares = 25</p>
    <p class="mt-4">previousMines = {`[${previousNumbers.join(', ')}]`}</p>
    <p class="mt-4">
      minesBoardWithoutPreviousMines = {`[${minesBoardMinusPreviousMines.join(', ')}]`}
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">mineIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> * (<span
        class="font-bold text-blue-500">&lbrace;mineSquares&rbrace;</span
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
    <p class="mt-4">mineNumber</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;minesBoardWithoutPreviousMines[</span>
    </p>
    <p class="indent-4 font-bold text-blue-500">minesIndex</p>
    <p class="font-bold text-blue-500">]&rbrace;</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;minesBoardWithoutPreviousMines[</span>
    </p>
    <p class="indent-4 font-bold text-blue-500">{chosenIndex}</p>
    <p class="font-bold text-blue-500">]&rbrace;</p>
    <p>= {chosen}</p>
  </div>
</div>
