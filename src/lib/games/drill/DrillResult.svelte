<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { Seed, DrillResult as DrillResultType } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import DrillCard from './DrillCard.svelte';
  import { calculateDrillMultiplier } from '$lib/util/drill';

  const { formValues = $bindable() }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const drillsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const drills: DrillResultType[] = [];

        // Generate 3 drills
        for (let i = 0; i < 3; i++) {
          const float = floatGenerator.next().value;
          const multiplier = calculateDrillMultiplier(float);
          drills.push({ float, multiplier, drillIndex: i });
        }

        return drills;
      },
      350
    )
  );
</script>

{#if drillsDebounced.debouncing}
  <Loader />
{:else}
  {@const drills = drillsDebounced.value!}

  <div class="grid grid-cols-3 gap-3">
    {#each drills as drill, i (i)}
      <div class="aspect-[3/4]">
        <DrillCard drillIndex={drill.drillIndex} multiplier={drill.multiplier} />
      </div>
    {/each}
  </div>
{/if}
