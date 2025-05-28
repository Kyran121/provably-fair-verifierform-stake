<script lang="ts">
  import paylines from '$lib/assets/wheel-paylines.json';
  import type { WheelSeed } from '$lib/types';

  const { stepNumber, seed, float }: { stepNumber: number; seed: WheelSeed; float: number } =
    $props();

  const payline = $derived(paylines[seed.segments as unknown as keyof typeof paylines][seed.risk]);
  const chosenIndex = $derived(Math.floor(float * seed.segments));
  const chosen = $derived(payline[chosenIndex]);
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into payout</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Wheel</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="mt-5 bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>
      payline = [
      {#each payline as multi, n (n)}
        <span
          class={[
            'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
            n === chosenIndex
              ? 'border-gray-400 bg-blue-300 dark:bg-blue-500'
              : 'border-gray-400 bg-gray-300 dark:bg-gray-700'
          ]}
        >
          ({n}) {multi}x
        </span>
      {/each}
      ]
    </p>

    <p class="mt-4">float = {float.toFixed(12)}</p>
    <p>segments = {seed.segments}</p>

    <p class="mt-4">chosenIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> *
      <span class="font-bold text-blue-500">&lbrace;segments&rbrace;</span>)
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float}</span> *
      <span class="font-bold text-blue-500">{seed.segments}</span>)
    </p>
    <p>= {chosenIndex}</p>

    <p class="mt-4">payout</p>
    <p>= <span class="font-bold text-blue-500">&lbrace;payline[chosenIndex]&rbrace;</span></p>
    <p>= <span class="font-bold text-blue-500">&lbrace;payline[{chosenIndex}]&rbrace;</span></p>
    <p>= {chosen}x</p>
  </div>
</div>
