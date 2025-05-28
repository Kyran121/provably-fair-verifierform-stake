<script lang="ts">
  import { Gem, type Item } from '$lib/types';

  const gems = Object.values(Gem);

  const {
    stepNumber,
    float,
    chosen,
    chosenIndex
  }: {
    stepNumber: number;
  } & Item<Gem> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into gem</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Diamonds</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>numberOfGems = {gems.length}</p>
    <p class="mt-4">
      gems = [
      {#each gems as gem, n (n)}
        <span
          class={[
            'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
            n === chosenIndex
              ? 'border-gray-400 bg-blue-300 dark:bg-blue-500'
              : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
          ]}>({n}) {gem}</span
        >
      {/each}
      ]
    </p>
    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p class="mt-4">gemIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> *
      <span class="font-bold text-blue-500">&lbrace;numberOfGems&rbrace;</span>)
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> *
      <span class="font-bold text-blue-500">{gems.length}</span>)
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">card</p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;gems[gemIndex]&rbrace;</span>
    </p>
    <p>
      = <span class="font-bold text-blue-500">&lbrace;gems[{chosenIndex}]&rbrace;</span>
    </p>
    <p>
      = {chosen}
    </p>
  </div>
</div>
