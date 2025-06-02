<script lang="ts">
  import { debouncer } from '$lib/debounce.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import type { Risk, WheelSeed } from '$lib/types';
  import paylines from '$lib/assets/wheel-paylines.json';
  import Loader from '$lib/games/Loader.svelte';
  import { BG_COLOR, BG_COLOR_GRAY } from '$lib/constants';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<WheelSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    risk: formValues.risk as Risk,
    segments: formValues.segments as number
  });

  const payline = $derived(paylines[seed.segments as unknown as keyof typeof paylines][seed.risk]);
  const distinctPayline = $derived([...new Set(payline.slice(0))].sort((a, b) => a - b));

  const payoutDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return payline[Math.floor(floatGenerator.next().value * seed.segments)];
      },
      350
    )
  );
</script>

{#if payoutDebounced.debouncing}
  <Loader />
{:else}
  <div class="grid auto-cols-auto grid-flow-col gap-2 pb-1">
    {#each distinctPayline as multi, n (n)}
      <div
        class={[
          'col p-2 text-center',
          multi === payoutDebounced.value!
            ? 'font-bold ' + BG_COLOR
            : 'bg-gray-300 dark:bg-gray-600'
        ]}
      >
        {multi}x
      </div>
    {/each}
  </div>
{/if}
