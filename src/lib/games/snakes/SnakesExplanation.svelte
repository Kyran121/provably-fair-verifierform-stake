<script lang="ts">
  import {
    BG_COLOR,
    BG_COLOR_GRAY,
    BTN_BG_COLOR,
    BTN_BG_COLOR_GRAY,
    BTN_BG_COLOR_GRAY_SELECTED,
    BTN_BG_COLOR_SELECTED,
    SNAKES_MULTIPLIER_SHIFT_MAP
  } from '$lib/config';
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { SnakesDifficulty, SnakesSeed } from '$lib/types';
  import { shuffle } from '$lib/util/shuffle-impl/shuffle';
  import FloatGenerationStep from '$lib/games/FloatGenerationStep.svelte';
  import ResultTabs from '$lib/games/ResultTabs.svelte';
  import SnakesDiceRollStep from '$lib/games/snakes/SnakesDiceRollStep.svelte';
  import paylines from '$lib/assets/snakes/snakes-paylines.json';
  import { chunk } from '$lib/util/array/chunk';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '../layout/ContentBlock.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  const seed = $derived<SnakesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as SnakesDifficulty
  });

  const payline = $derived(paylines[seed.difficulty]);

  const rollsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const rollOptions = Array.from({ length: 6 }).map((_v, i) => i + 1);
        return shuffle(floatGenerator, rollOptions, 10);
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if rollsDebounced.debouncing}
      <Loader />
    {:else}
      {@const rolls = rollsDebounced.value!}
      {@const selectedRoll = rolls[resultIndex]}
      {@const multiShiftMap = SNAKES_MULTIPLIER_SHIFT_MAP[seed.difficulty]}

      <ContentBlock className="mb-7 p-2 text-center text-base text-black dark:text-white">
        <p class="text-lg">How it works</p>
        <p class="mb-4 text-sm">
          The Snakes game consists of two dice, a payline of 11 slots (each slot being either a
          multiplier or a snake), and a pawn. The configuration of the payline varies depending on
          the selected difficulty. You start with a total multiplier of 1x. You are given up to five
          rolls of the dice. On each turn, the pawn starts on the play button, and the number of
          spots it moves through the payline is equal to the sum of the dice rolls minus one. If the
          pawn lands on a snake, the total multiplier is forfeited. However, if it lands on a
          multiplier, that multiplier is applied to the total multiplier.
        </p>
        <p class="bold mb-2 border-t-1 border-gray-400 pt-3 text-base">Example #1 - not busted</p>
        <p class="text-sm">Total multiplier = 1x</p>
        <p class="text-sm">Roll #1 = Pawn lands on 1.30x, total multiplier is 1.30x</p>
        <p class="text-sm">Roll #2 = Pawn lands on 1.10x, total multiplier is 1.43x</p>
        <p class="text-sm">Roll #3 = Pawn lands on 1.08x, total multiplier is 1.54x</p>
        <p class="text-sm">Roll #4 = Pawn lands on 1.20x, total multiplier is 1.85x</p>
        <p class="pb-5 text-sm">Roll #5 = Pawn lands on 1.20x, total multiplier is 2.22x</p>

        <p class="bold mb-2 border-t-1 border-gray-400 pt-3 text-base">Example #2 - busted</p>
        <p class="text-sm">Total multiplier = 1x</p>
        <p class="text-sm">Roll #1 = Pawn lands on 1.30x, total multiplier is 1.30x</p>
        <p class="pb-2 text-sm">Roll #2 = Pawn lands on snake, total multiplier forfeited</p>
      </ContentBlock>

      <div class="mt-5 mb-2 text-center">
        <p class="mb-2 text-xl">Step 1</p>
        <p class="text-base">Compute the dice rolls for all 5 turns</p>
      </div>

      <div class="mt-3 border-1 border-gray-400 p-5">
        <p class="mb-7 bg-gray-200 p-2 text-center text-base dark:bg-gray-700">
          Roll results drawn in the order shown below. Click a roll result to find out how it was
          generated using stake's provably fair algorithm
        </p>

        <ResultTabs
          {seed}
          items={rolls}
          bind:resultIndex
          tabNameModifier={(chosen, n) => `turn ${Math.floor(n / 2) + 1}<br>${chosen}`}
          tabSelectedClassModifier={(n) =>
            Math.floor(n / 2) % 2 === 0 ? BTN_BG_COLOR_SELECTED : BTN_BG_COLOR_GRAY_SELECTED}
          tabClassModifier={(n) => (Math.floor(n / 2) % 2 === 0 ? BTN_BG_COLOR : BTN_BG_COLOR_GRAY)}
        />

        <FloatGenerationStep stepNumber={1.1} {resultIndex} {seed} float={selectedRoll.float} />
        <SnakesDiceRollStep stepNumber={1.2} {...selectedRoll} />
      </div>

      <div class="mt-5 mb-2 text-center">
        <p class="mb-2 text-xl">Step 2</p>
        <p class="text-base">
          Calculate the outcome of each turn using the sum of that turn's dice rolls
        </p>
        <p class="text-sm text-gray-500 italic dark:text-gray-400">
          NOTE: Given the pawn lands on a multiplier after the first turn, the lowest multiplier in
          the payline will increase slightly for the remaining turns:
        </p>
        <div class="mt-5 grid grid-cols-5 text-gray-500 italic dark:text-gray-400">
          {#each Object.entries(SNAKES_MULTIPLIER_SHIFT_MAP) as [difficulty, config], n (n)}
            {#each Object.entries(config) as [fromMulti, toMulti], n (n)}
              <div class={[difficulty === seed.difficulty ? 'font-bold ' + BG_COLOR : '']}>
                {difficulty}<br />{parseFloat(fromMulti).toFixed(2)}x &rarr; {toMulti.toFixed(2)}x
              </div>
            {/each}
          {/each}
        </div>
        <ContentBlock className="mt-5 p-5 text-left font-mono text-xs">
          <p class="mb-4">
            payline = [
            {#each payline as multi, n (n)}
              <span
                class="mr-1 mb-1 inline-block border-1 border-gray-400 p-1 dark:border-none {BG_COLOR_GRAY} text-white dark:text-gray-300"
              >
                ({n + 1}) {multi.toFixed(2)}x
              </span>
            {/each} ]
          </p>

          {#each chunk(rolls, 2) as [roll1, roll2], n (n)}
            {#if n === 1}
              <p class="mb-4">
                payline = [
                {#each payline as multi, nn (nn)}
                  <span
                    class={[
                      'mr-1 mb-1 inline-block border-1 p-1 dark:border-none',
                      multi in multiShiftMap
                        ? 'border-purple-400 ' + BG_COLOR
                        : 'border-gray-400 ' + BG_COLOR_GRAY + ' text-white dark:text-gray-300'
                    ]}
                  >
                    ({nn + 1}) {(multiShiftMap[multi] || multi).toFixed(2)}x
                  </span>
                {/each} ]
              </p>
            {/if}

            <p>
              turn{n + 1} = payline[{roll1.chosen} + {roll2.chosen} - 1]
            </p>
            <p>turn{n + 1} = payline[{roll1.chosen + roll2.chosen - 1}]</p>
            <p class="mb-4">
              turn{n + 1} = {(
                multiShiftMap[payline[roll1.chosen + roll2.chosen - 2]] ||
                payline[roll1.chosen + roll2.chosen - 2]
              ).toFixed(2)}x
            </p>
          {/each}
        </ContentBlock>
      </div>
    {/if}
  </div>
</div>
