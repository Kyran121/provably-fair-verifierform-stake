<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { SnakesDifficulty, SnakesSeed } from '$lib/types';
  import paylines from '$lib/assets/snakes/snakes-paylines.json';
  import { SNAKES_MULTIPLIER_SHIFT_MAP } from '$lib/constants';
  import snakeIcon from '$lib/assets/snakes/icons/snake-50x50-white.png';
  import DiceIcon from '$lib/games/snakes/DiceIcon.svelte';
  import Loader from '$lib/games/Loader.svelte';

  type Step = {
    die: number[];
    result: number;
  };

  type Result = {
    best: number;
    steps: Step[];
  };

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<SnakesSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as SnakesDifficulty
  });

  const payline = $derived(paylines[seed.difficulty]);

  const multiShiftMap = $derived(SNAKES_MULTIPLIER_SHIFT_MAP[seed.difficulty]);

  const resultDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const steps = [];
        let best = 1;
        for (let i = 0; i < 5; i++) {
          const die = [];
          let result = 0;
          for (let j = 0; j < 2; j++) {
            const dice = Math.floor(floatGenerator.next().value * 6) + 1;
            die.push(dice);
            result += dice;
          }
          steps.push({ die, result: payline[result - 2] });
        }
        let n = 0;
        for (const step of steps) {
          if (step.result === 0) {
            break;
          }
          best *= n > 0 && multiShiftMap[step.result] ? multiShiftMap[step.result] : step.result;
          n++;
        }
        best = Math.floor(best * 100) / 100;
        return { best, steps } satisfies Result;
      },
      350
    )
  );
</script>

{#if resultDebounced.debouncing}
  <Loader />
{:else}
  {@const result = resultDebounced.value!}
  {@const steps = result.steps}
  {@const best = result.best}
  {@const multiShifts = SNAKES_MULTIPLIER_SHIFT_MAP[seed.difficulty]}

  <p data-testid="snake-result" class="mb-3 text-center text-base">
    best multi is <span class="text-xl text-blue-500">{best.toFixed(2)}x</span>
  </p>

  <div class="grid grid-cols-5 gap-1 sm:gap-1.5">
    {#each steps as { die, result }, n (n)}
      <div>
        <div
          class={[
            'flex h-15 w-full items-center justify-center',
            result === 0 ? 'bg-red-500 dark:bg-red-700' : 'bg-gray-300 dark:bg-gray-500'
          ]}
        >
          {#if result === 0}
            <img class="relative scale-80 object-scale-down" src={snakeIcon} alt="snake" />
          {:else}
            <p class="text-base">
              {n > 0 && result in multiShifts ? multiShifts[result].toFixed(2) : result.toFixed(2)}x
            </p>
          {/if}
        </div>
        <div class="grid grid-cols-2 bg-gray-400 dark:bg-gray-700">
          {#each die as roll, n (n)}
            <div>
              <DiceIcon {roll} />
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}
