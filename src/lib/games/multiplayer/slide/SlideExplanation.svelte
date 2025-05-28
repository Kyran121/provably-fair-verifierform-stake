<script lang="ts">
  import { hmac as createHmac } from '@stablelib/hmac';
  import { SHA256 } from '@stablelib/sha256';
  import { encode as toUInt8Array } from '@stablelib/utf8';
  import { encode as toHex } from '@stablelib/hex';
  import type { SlideSeed } from '$lib/types';
  import { debouncer } from '$lib/debounce.svelte';
  import SlideIntGenerationStep from '$lib/games/multiplayer/slide/SlideIntGenerationStep.svelte';
  import SlideResultStep from '$lib/games/multiplayer/slide/SlideResultStep.svelte';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<SlideSeed>({
    slideHash: formValues.slidehash as string,
    blockHash: formValues.blockhash as string
  });

  const hmacDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) =>
        toHex(createHmac(SHA256, toUInt8Array(seed.slideHash), toUInt8Array(seed.blockHash))),
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if hmacDebounced.debouncing}
      <Loader />
    {:else}
      <SlideIntGenerationStep stepNumber={1} {seed} hmac={hmacDebounced.value!} />
      <SlideResultStep stepNumber={2} hmac={hmacDebounced.value!} />
    {/if}
  </div>
</div>
