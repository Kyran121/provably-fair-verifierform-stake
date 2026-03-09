<script lang="ts">
	import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';
	import ContentBlock from '../layout/ContentBlock.svelte';
	import DrillCard from './DrillCard.svelte';

	const {
		float,
		multiplier,
		drillIndex
	}: { float: number; multiplier: number; drillIndex: number } = $props();

	const formattedMultiplier = $derived((Math.floor(multiplier * 100) / 100).toFixed(2));
</script>

<div class="mt-4 text-center">
	<p class="mb-2 text-xl">Step 2</p>
	<p class="mb-3 text-base">
		Convert float to multiplier using <b>Drill Formula</b>
	</p>

	<ContentBlock className="p-5 text-center text-sm">
		<p class="mb-3">
			<code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
				multiplier = u &lt; 0.02 ? 1 : min(0.98 / (1 - u), 2,000,000)
			</code>
		</p>

		<div class="mt-3 grid grid-cols-3">
			<div class="aspect-[3/4]">
				<DrillCard {drillIndex} {multiplier} />
			</div>
			<div class="m-auto">
				<p class="text-center font-mono">
					u = {float.toFixed(12)}
				</p>
			</div>
			<div class="m-auto">
				<p class="text-center font-mono {TEXT_HIGHLIGHT_COLOR}">
					{#if float < 0.02}
						u &lt; 0.02<br />
						multiplier = 1.00x
					{:else}
						0.98 / (1 - {float.toFixed(12)})<br />
						= {formattedMultiplier}x
					{/if}
				</p>
			</div>
		</div>
	</ContentBlock>
</div>
