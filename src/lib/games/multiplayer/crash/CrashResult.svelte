<script lang="ts">
  import type { CrashSeed } from '$lib/types';
  import { debouncer } from '$lib/debounce.svelte';
  import { hmac as createHmac } from '@stablelib/hmac';
  import { encode as toUInt8Array } from '@stablelib/utf8';
  import { encode as toHex } from '@stablelib/hex';
  import { SHA256 } from '@stablelib/sha256';
  import { CRASH_SEED } from '$lib/constants';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<CrashSeed>({
    gameHash: formValues.gamehash as string
  });

  const crashPointDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const hmac = toHex(
          createHmac(SHA256, toUInt8Array(seed.gameHash), toUInt8Array(CRASH_SEED))
        );
        const int = parseInt(hmac.substring(0, 8), 16);
        return Math.floor(Math.max(1, (2 ** 32 / (int + 1)) * (1 - 0.01)) * 100) / 100;
      },
      350
    )
  );
</script>

{#if crashPointDebounced.debouncing}
  <Loader />
{:else}
  <div data-testid="crash-result" class="text-center text-base">
    <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">Crash point</p>
    <div
      class="inline-flex min-w-[100px] flex-col items-center justify-center rounded border-2 border-green-500 bg-green-50 px-6 py-4 shadow-lg dark:border-green-400 dark:bg-green-900/20"
    >
      <span class="text-3xl font-bold text-gray-800 dark:text-gray-100"
        >{crashPointDebounced.value!.toFixed(2)}x</span
      >
    </div>
  </div>
{/if}
