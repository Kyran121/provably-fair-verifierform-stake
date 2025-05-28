<script lang="ts">
  import { RockPaperScissorsOutcome, type Item } from '$lib/types';

  const {
    stepNumber,
    float,
    chosenIndex,
    chosen
  }: { stepNumber: number } & Item<RockPaperScissorsOutcome> = $props();
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform float into result</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    see <span class="font-bold">Rock Paper Scissors</span> section on the
    <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://stake.com/provably-fair/game-events">game events</a
    > page
  </p>

  <div
    class="bg-gray-200 p-5 text-left font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    <p>numberOfOutcomes = 3</p>
    <p>outcomes = [ ROCK, PAPER, SCISSORS ]</p>
    <p>float = {float.toFixed(12)}</p>
    <p class="mt-4">outcomeIndex</p>
    <p>
      = floor(<span class="font-bold text-blue-500">&lbrace;float&rbrace;</span> *
      <span class="font-bold text-blue-500">&lbrace;numberOfOutcomes&rbrace;</span>)
    </p>
    <p>
      = floor(<span class="font-bold text-blue-500">{float.toFixed(12)}</span> *
      <span class="font-bold text-blue-500">3</span>)
    </p>
    <p>= {chosenIndex}</p>
    <p class="mt-4">result</p>
    <p>= <span class="font-bold text-blue-500">&lbrace;outcomes[outcomeIndex]&rbrace;</span></p>
    <p>= <span class="font-bold text-blue-500">&lbrace;outcomes[{chosenIndex}]&rbrace;</span></p>
    <p>= {chosen}</p>
  </div>
</div>
