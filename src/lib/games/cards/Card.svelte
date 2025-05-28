<script lang="ts">
  import CardSuitIcon from '$lib/games/cards/CardSuitIcon.svelte';
  import { CardSuit } from '$lib/types';

  const { value, suit }: { value: string; suit: CardSuit } = $props();
</script>

<div class="mt-2 grid grid-cols-2 gap-1 bg-gray-200 md:gap-1.5 dark:bg-gray-700">
  <div class="flex items-center justify-center">{value}</div>
  <div class="hidden dark:block">
    <CardSuitIcon {suit} />
  </div>
  <div class="block dark:hidden">
    <CardSuitIcon {suit} dark={true} />
  </div>
</div>
