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

  const { previousNumbers, kenoBoardMinusPreviousNumbers } = $derived.by(() => {
    const kenoBoard = Array.from({ length: 40 }).map((_v, i) => i + 1);
    const previousNumbers = chosenIndexes.slice(0, -1).map((i) => kenoBoard.splice(i, 1)[0]);
    return { previousNumbers, kenoBoardMinusPreviousNumbers: kenoBoard };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into keno number</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Keno</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>kenoSquares = 40</p>
    <p>previousNumbers = {`[${previousNumbers.join(', ')}]`}</p>
    <p class="mt-4">
      kenoBoardWithoutPreviousNumbers = {`[${kenoBoardMinusPreviousNumbers.join(', ')}]`}
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">kenoNumberIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> * (<span
        class="font-bold text-blue-500">&lbrace;kenoSquares&rbrace;</span
      >
      -
      <span class="font-bold text-blue-500">&lbrace;resultIndex&rbrace;</span>))
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> * (<span
        class="font-bold text-blue-500">40</span
      >
      -
      <span class="font-bold text-blue-500">{resultIndex}</span>))
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">kenoNumber</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;kenoBoardWithoutPreviousNumbers[</span>
    </p>
    <p class="indent-4 font-bold text-blue-500">kenoNumberIndex</p>
    <p class="font-bold text-blue-500">]&rbrace;</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;kenoBoardWithoutPreviousNumbers[</span>
    </p>
    <p class="indent-4 font-bold text-blue-500">{chosenIndex}</p>
    <p class="font-bold text-blue-500">]&rbrace;</p>
    <p>= {chosen}</p>
  </div>
</div>
