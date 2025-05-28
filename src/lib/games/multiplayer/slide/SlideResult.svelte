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
  <p data-testid="slide-result" class="text-center text-base">
    slide stopped at <span class="text-xl text-blue-500"
      >{slideStopPointDebounced.value!.toFixed(2)}x</span
    >
  </p>
{/if}
