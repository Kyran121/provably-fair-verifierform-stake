<script lang="ts">
  const { stepNumber, float }: { stepNumber: number; float: number } = $props();
  const chosenNumber = $derived(Math.floor(float * 37));
  const chosenNumberEquation = $derived(`floor(${float.toFixed(12)} * 37) = ${chosenNumber}`);
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into roulette number</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    formula taken from <span class="font-bold">Roulette Roll</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>
  <p
    class="bg-gray-200 p-5 text-center font-mono text-sm whitespace-pre-wrap text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    {chosenNumberEquation}
  </p>
</div>
