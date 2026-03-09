<script lang="ts">
  const { drillIndex, multiplier }: { drillIndex: number; multiplier: number } = $props();

  // Three different gem colors based on drill index (0, 1, 2)
  const colors = [
    'bg-blue-500', // Blue gem (index 0)
    'bg-yellow-500', // Yellow/Orange gem (index 1)
    'bg-green-500' // Green gem (index 2)
  ];

  const bgColor = $derived(colors[drillIndex % 3]);
  const flooredMultiplier = $derived((Math.floor(multiplier * 100) / 100).toFixed(2));
</script>

<div
  class="flex h-full w-full flex-col items-center justify-center rounded-lg {bgColor} text-white"
>
  <!-- Gem placeholder (circle for simplicity) -->
  <div class="mb-2 h-12 w-12 rounded-full bg-white/30"></div>
  <!-- Multiplier -->
  <div class="text-xl font-semibold">{flooredMultiplier}x</div>
</div>
