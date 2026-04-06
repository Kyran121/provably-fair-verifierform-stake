<script lang="ts">
	import { TEXT_HIGHLIGHT_COLOR } from '$lib/config';
	import ContentBlock from '../layout/ContentBlock.svelte';
	import TarotsCard from './TarotsCard.svelte';
	import type { TarotCard, TarotArcanaType } from '$lib/types';

	const {
		float,
		card,
		arcanaType
	}: { float: number; card: TarotCard; arcanaType: TarotArcanaType } = $props();

	const arcanaName = $derived(arcanaType === 'minor' ? 'Minor' : 'Major');
</script>

<div class="mt-4 text-center">
	<p class="mb-2 text-xl">Step 2</p>
	<p class="mb-3 text-base">
		Convert float to card using <b>Float &rarr; Card Correlation Table</b>
	</p>

	<ContentBlock className="p-5 text-center text-sm">
		<p>
			according to the <b>{arcanaName} Arcana Table</b>, the first card where
			<span class="font-mono">{float.toFixed(12)}</span> is greater than the min bound is:
		</p>

		<div class="mt-3 grid grid-cols-3">
			<div class="aspect-[2/3]">
				<TarotsCard {arcanaType} multiplier={card.multiplier} />
			</div>
			<div class="m-auto">
				<p class="text-center font-mono">
					{float.toFixed(12)}
				</p>
			</div>
			<div class="m-auto">
				<p class="text-center font-mono {TEXT_HIGHLIGHT_COLOR}">
					min bound:<br />{card.min}
				</p>
			</div>
		</div>
	</ContentBlock>
</div>
