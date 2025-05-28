<script lang="ts">
  const { stepNumber, hmac }: { stepNumber: number; hmac: string } = $props();
  const hex = $derived(hmac.substring(0, 8));
  const int = $derived(parseInt(hex, 16));
  const crashPoint = $derived(
    Math.floor(Math.max(1, (2 ** 32 / (int + 1)) * (1 - 0.01)) * 100) / 100
  );
  const crashPointEquation = $derived(
    `floor(max(1, (2 ** 32 / (${int} + 1)) * (1 - 0.01)) * 100) / 100 = ${crashPoint.toFixed(2)}x`
  );
</script>

<div class="mt-5 text-center">
  <p class="mb-2 text-xl">Step {stepNumber}</p>
  <p class="text-base">Transform number into crash point multiplier</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    See <a
      class="text-blue-500 hover:underline"
      target="_blank"
      href="https://bitcointalk.org/index.php?topic=5162888.0">bitcointalk post</a
    > for game result formula
  </p>
  <p
    class="bg-gray-200 p-5 text-center font-mono text-xs whitespace-pre-wrap text-gray-500 dark:bg-gray-800 dark:text-gray-400"
  >
    {crashPointEquation}
  </p>
</div>
