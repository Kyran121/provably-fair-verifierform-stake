<script lang="ts">
  import { IndicatorPosition } from '$lib/types';

  let {
    text,
    textClass,
    widthClass,
    bgColorClass,
    position = IndicatorPosition.BOTTOM_RIGHT
  }: {
    text: string | number;
    textClass?: string;
    widthClass?: string;
    bgColorClass?: string;
    position?: IndicatorPosition;
  } = $props();
</script>

<div
  class={[
    'absolute right-0 flex h-5 items-center justify-center',
    position === IndicatorPosition.BOTTOM_RIGHT ? 'right-0 bottom-0' : 'top-0 left-0',
    textClass ?? 'text-center text-sm',
    bgColorClass ?? 'bg-green-400 dark:bg-green-700',
    widthClass ?? 'w-10'
  ]}
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html text}
</div>
