<script lang="ts">
	import { TarotArcanaType } from '$lib/types';

	const { arcanaType, multiplier }: { arcanaType: TarotArcanaType; multiplier: number } = $props();

	const isMinor = $derived(arcanaType === TarotArcanaType.MINOR);
	const bgColor = $derived(isMinor ? 'bg-gray-400 dark:bg-gray-600' : 'bg-yellow-500');
</script>

<div
	class="flex h-full w-full items-center justify-center rounded-lg {bgColor} text-white font-semibold text-2xl"
>
	{multiplier}x
</div>
