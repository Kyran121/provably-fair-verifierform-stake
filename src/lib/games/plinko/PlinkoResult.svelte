<script lang="ts">
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { Risk, PlinkoSeed } from '$lib/types';
  import { getDirections, getPayout } from '$lib/util/plinko';
  import paylines from '$lib/assets/plinko-paylines.json';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<PlinkoSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    risk: formValues.risk as Risk,
    rows: formValues.rows as number
  });

  const payline = $derived([
    ...new Set(paylines[seed.rows as unknown as keyof typeof paylines][seed.risk])
  ]);

  const payoutDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const directions = getDirections(floatGenerator, seed.rows);
        return getPayout(seed.risk, seed.rows, directions);
      },
      350
    )
  );
</script>

{#if payoutDebounced.debouncing}
  <Loader />
{:else}
  <div class="grid auto-cols-auto grid-flow-col gap-2 pb-1">
    {#each payline as multi, n (n)}
      <div
        class={[
          'col p-2 text-center',
          multi === payoutDebounced.value!
            ? 'bg-blue-400 font-bold dark:bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-700'
        ]}
      >
        {multi}x
      </div>
    {/each}
  </div>
{/if}
