<script lang="ts">
  const {
    stepNumber,
    resultIndex,
    float
  }: {
    stepNumber: number;
    resultIndex: number;
    float: number;
  } = $props();

  const reelSize = $derived(resultIndex % 5 === 4 ? 41 : 30);
  const reelPosition = $derived(Math.floor(float * reelSize));
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into reel position</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Scarab Spin / Tome of Life</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>reelSize = {reelSize}</p>
    <p>float = {float.toFixed(12)}</p>

    <p class="mt-4">reelPosition</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> *
      <span class="font-bold text-blue-500">&lbrace;reelSize&rbrace;</span>) + 1
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> *
      <span class="font-bold text-blue-500">{reelSize}</span>) + 1
    </p>
    <p>= {reelPosition + 1}</p>
  </div>
</div>
