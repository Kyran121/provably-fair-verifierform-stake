<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { BarsDifficulty, BarsSeed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import { BG_COLOR_GOLD, BG_COLOR_GREEN } from '$lib/constants';
  import paylines from '$lib/assets/bars-paylines.json';
  import { getPayout } from '$lib/util/payout';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<BarsSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as BarsDifficulty,
    barCount: formValues.barcount as number
  });

  const getColorClass = (n: number) =>
    n > 5 ? BG_COLOR_GOLD : n > 1 ? BG_COLOR_GREEN : 'dark:bg-gray-500 bg-gray-300';

  const resultDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const multis = [];
        for (let i = 0; i < 30; i++) {
          const float = floatGenerator.next().value;
          const payline = paylines[seed.difficulty];
          const multiNotDivided = getPayout(payline, float);
          const multi = multiNotDivided / seed.barCount;
          multis.push({ multi, multiNotDivided });
        }
        return multis;
      },
      350
    )
  );
</script>

{#if resultDebounced.debouncing}
  <Loader />
{:else}
  {@const result = resultDebounced.value!}

  <div class="mt-5 mb-5 rounded-lg dark:bg-gray-900 dark:text-white">
    <!-- Number Grid -->
    <div class="grid grid-cols-5 gap-1 md:gap-1.5">
      {#each result as { multi, multiNotDivided }, n (n)}
        <div
          class={[
            'flex aspect-square h-10 w-full items-center justify-center',
            getColorClass(multiNotDivided)
          ]}
        >
          {multi.toFixed(2)}x
        </div>
      {/each}
    </div>
  </div>
{/if}
