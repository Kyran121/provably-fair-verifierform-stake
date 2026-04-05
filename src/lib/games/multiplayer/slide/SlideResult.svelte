<script lang="ts">
  import type { SlideSeed } from '$lib/types';
  import { debouncer } from '$lib/debounce.svelte';
  import { hmac as createHmac } from '@stablelib/hmac';
  import { encode as toUInt8Array } from '@stablelib/utf8';
  import { encode as toHex } from '@stablelib/hex';
  import { SHA256 } from '@stablelib/sha256';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<SlideSeed>({
    slideHash: formValues.slidehash as string,
    blockHash: formValues.blockhash as string
  });

  const slideStopPointDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const hmac = toHex(
          createHmac(SHA256, toUInt8Array(seed.slideHash), toUInt8Array(seed.blockHash))
        );
        const int = parseInt(hmac.substring(0, 8), 16);
        return Math.floor(Math.max(1, (2 ** 32 / (int + 1)) * (1 - 0.02)) * 100) / 100;
      },
      350
    )
  );
</script>

{#if slideStopPointDebounced.debouncing}
  <Loader />
{:else}
  <div data-testid="slide-result" class="text-center text-base">
    <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">Stop point</p>
    <div
      class="inline-flex min-w-[100px] flex-col items-center justify-center rounded border-2 border-green-500 bg-green-50 px-6 py-4 shadow-lg dark:border-green-400 dark:bg-green-900/20"
    >
      <span class="text-3xl font-bold text-gray-800 dark:text-gray-100"
        >{slideStopPointDebounced.value!.toFixed(2)}x</span
      >
    </div>
  </div>
{/if}
