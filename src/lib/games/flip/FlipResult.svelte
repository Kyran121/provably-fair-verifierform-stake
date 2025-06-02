<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import { CoinFlip, type Seed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import { BG_COLOR, BG_COLOR_GRAY } from '$lib/constants';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const flipsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const coinFlips: CoinFlip[] = [];
        for (let i = 0; i < 20; i++) {
          coinFlips.push(floatGenerator.next().value <= 0.5 ? CoinFlip.TAIL : CoinFlip.HEAD);
        }
        return coinFlips;
      },
      350
    )
  );
</script>

{#if flipsDebounced.debouncing}
  <Loader />
{:else}
  {@const flips = flipsDebounced.value!}

  <p data-testid="flip-result" class="hidden text-center text-base">
    {flips}
  </p>

  <p class="pb-3 text-center">History</p>

  <div class="mb-1 grid grid-cols-5 gap-1 sm:grid-cols-10 md:gap-1.5 dark:text-white">
    {#each flips as flip, i (i)}
      <div class={['text-center', flip === CoinFlip.TAIL ? BG_COLOR : BG_COLOR_GRAY]}>
        ({i + 1})<br />{flip}
      </div>
    {/each}
  </div>
{/if}
