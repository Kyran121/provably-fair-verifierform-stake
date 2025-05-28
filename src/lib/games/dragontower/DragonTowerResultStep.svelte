<script lang="ts">
  import type { DragonTowerDifficultyConfig, FisherYatesItem } from '$lib/types';

  const {
    stepNumber,
    resultIndex,
    config,
    float,
    chosen,
    chosenIndex,
    chosenIndexes
  }: {
    stepNumber: number;
    resultIndex: number;
    config: DragonTowerDifficultyConfig;
  } & FisherYatesItem<number> = $props();

  const { previousEggIndexes, eggsMinusPreviousIndexes } = $derived.by(() => {
    const eggIndexes = Array.from({ length: config.size }).map((v, i) => i);
    const previousEggIndexes = chosenIndexes.slice(0, -1).map((i) => eggIndexes.splice(i, 1)[0]);
    return { previousEggIndexes, eggsMinusPreviousIndexes: eggIndexes };
  });
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into egg index</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Dragon Tower</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>rowSize = {config.size}</p>
    <p>eggsToChoose = {config.count}</p>
    <p class="mt-4">previousEggIndexes = {`[${previousEggIndexes.join(', ')}]`}</p>
    <p>
      eggsWithoutPreviousIndexes = {`[${eggsMinusPreviousIndexes.join(', ')}]`}
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">eggIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> * (<span
        class="font-bold text-blue-500">&lbrace;rowSize&rbrace;</span
      >
      - (<span class="font-bold text-blue-500">&lbrace;resultIndex&rbrace;</span> %
      <span class="font-bold text-blue-500">&lbrace;eggsToChoose&rbrace;</span>)))
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> * (<span
        class="font-bold text-blue-500">{config.size}</span
      >
      - (<span class="font-bold text-blue-500">{resultIndex}</span> %
      <span class="font-bold text-blue-500">{config.count}</span>)))
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> * (<span
        class="font-bold text-blue-500">{config.size}</span
      >
      - {resultIndex % config.count}))
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">egg</p>
    <p>
      = <span class="font-bold text-blue-500"
        >&lbrace;eggsWithoutPreviousIndexes[eggIndex]&rbrace;</span
      >
    </p>
    <p>
      = <span class="font-bold text-blue-500"
        >&lbrace;eggsWithoutPreviousIndexes[{chosenIndex}]&rbrace;</span
      >
    </p>
    <p>= {chosen}</p>
  </div>
</div>
