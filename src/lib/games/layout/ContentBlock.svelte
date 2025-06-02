<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import { STEP_CONTAINER_BG_COLOR, STEP_CONTAINER_TEXT_COLOR } from '$lib/constants';

  const { className, children }: { className?: string; children: Snippet } = $props();
</script>

<div class={twMerge(STEP_CONTAINER_BG_COLOR, STEP_CONTAINER_TEXT_COLOR, className)}>
  {@render children()}
</div>
