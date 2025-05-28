<script lang="ts">
  const {
    stepNumber,
    blockHash,
    gameHash,
    gameHashLabel = 'gamehash',
    hmac
  }: {
    stepNumber: number;
    blockHash: string;
    gameHash: string;
    gameHashLabel?: string;
    hmac: string;
  } = $props();

  const hex = $derived(hmac.substring(0, 8));
  const int = $derived(parseInt(hex, 16));
</script>

<div>
  <div class="text-center">
    <p class="mb-2 text-xl">Step {stepNumber}</p>
    <p class="text-base">Extract hex and int from hmac</p>
    <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
      See <a
        class="text-blue-500 hover:underline"
        target="_blank"
        href="https://bitcointalk.org/index.php?topic=5249741.0">bitcointalk post</a
      > for game result formula
    </p>
  </div>

  <div class="bg-gray-200 p-5 font-mono text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
    <p>hmac</p>
    <p>= hmac_sha256(</p>
    <p class="indent-8">
      key &nbsp;= <span class="font-bold text-blue-500">&lbrace;{gameHashLabel}&rbrace;</span>
    </p>
    <p class="indent-8">
      data = <span class="font-bold text-blue-500">&lbrace;blockhash&rbrace;</span>
    </p>
    <p class="indent-4">)</p>
    <p>= hmac_sha256(</p>
    <p class="truncate indent-8">
      key &nbsp;= <span class="font-bold text-blue-500">{gameHash}</span>
    </p>
    <p class="truncate indent-8">
      data = <span class="font-bold text-blue-500">{blockHash}</span>
    </p>
    <p class="indent-4">)</p>
    <p class="break-all">= <span class="text-xs">{hmac}</span></p>

    <p class="mt-4">hex</p>
    <p>= substring(</p>
    <p class="indent-8">
      value = <span class="font-bold text-blue-500">&lbrace;hmac&rbrace;</span>
    </p>
    <p class="indent-8">start = 0</p>
    <p class="indent-8">take &nbsp;= 8</p>
    <p class="indent-4">)</p>
    <p>= substring(</p>
    <p class="truncate indent-8">
      value = <span class="font-bold text-blue-500">{hmac}</span>
    </p>
    <p class="indent-8">start = 0</p>
    <p class="indent-8">take &nbsp;= 8</p>
    <p class="indent-4">)</p>
    <p class="break-all">
      = <span class="text-base font-bold text-blue-500">{hmac.substring(0, 8)}</span><span
        class="text-xs text-gray-400">{hmac.substring(8)}</span
      >
    </p>
    <p class="mt-4">int</p>
    <p>= parseInt(<span class="font-bold text-blue-500">&lbrace;hex&rbrace;</span>, 16)</p>
    <p>= parseInt(<span class="font-bold text-blue-500">{hex}</span>, 16)</p>
    <p>= {int}</p>
  </div>
</div>
