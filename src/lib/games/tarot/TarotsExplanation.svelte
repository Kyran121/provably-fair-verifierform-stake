<script lang="ts">
	import type { TarotCard, TarotSeed, TarotArcanaType, TarotDifficulty } from '$lib/types';
	import { TarotArcanaType as ArcanaType } from '$lib/types';
	import { FloatGenerator } from '$lib/generator/FloatGenerator';
	import { debouncer } from '$lib/debounce.svelte';
	import Loader from '$lib/games/Loader.svelte';
	import TarotsTable from './TarotsTable.svelte';
	import ResultTabs from '../ResultTabs.svelte';
	import { findCard } from '$lib/util/tarot';
	import ContentBlock from '../layout/ContentBlock.svelte';
	import FloatGenerationStep from '../FloatGenerationStep.svelte';
	import TarotsResultStep from './TarotsResultStep.svelte';

	const { formValues }: { formValues: Record<string, unknown> } = $props();

	let resultIndex = $state(0);

	let seed = $derived<TarotSeed>({
		clientSeed: formValues.clientseed as string,
		serverSeed: formValues.serverseed as string,
		nonce: formValues.nonce as number,
		difficulty: formValues.difficulty as TarotDifficulty
	});

	interface CardResult {
		float: number;
		card: TarotCard;
		arcanaType: TarotArcanaType;
		cardNumber: number;
	}

	const resultsDebounced = $derived.by(
		debouncer(
			() => seed,
			(seed) => {
				const floatGenerator = FloatGenerator(seed);
				const results: CardResult[] = [];

				// Card 1: Minor Arcana
				const float1 = floatGenerator.next().value;
				const card1 = findCard(float1, seed.difficulty, ArcanaType.MINOR);
				if (card1)
					results.push({ float: float1, card: card1, arcanaType: ArcanaType.MINOR, cardNumber: 1 });

				// Card 2: Major Arcana
				const float2 = floatGenerator.next().value;
				const card2 = findCard(float2, seed.difficulty, ArcanaType.MAJOR);
				if (card2)
					results.push({ float: float2, card: card2, arcanaType: ArcanaType.MAJOR, cardNumber: 2 });

				// Card 3: Minor Arcana
				const float3 = floatGenerator.next().value;
				const card3 = findCard(float3, seed.difficulty, ArcanaType.MINOR);
				if (card3)
					results.push({ float: float3, card: card3, arcanaType: ArcanaType.MINOR, cardNumber: 3 });

				return results;
			},
			350
		)
	);
</script>

<div class="mt-5 border-0 text-center dark:text-white">
	<div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
		{#if resultsDebounced.debouncing}
			<Loader />
		{:else}
			{@const results = resultsDebounced.value!}

			<TarotsTable difficulty={seed.difficulty} />

			<ContentBlock className="mb-7 p-2 text-center text-base text-gray-900 dark:text-white">
				<p>
					Cards selected in the order shown below. Click a card to find out how it was selected
					using stake's provably fair algorithm
				</p>
			</ContentBlock>

			<ResultTabs
				{seed}
				items={results.map((result) => ({ chosen: result.cardNumber }))}
				bind:resultIndex
				tabNameModifier={(_chosen, n) => `${results[n].card.multiplier}x`}
			/>

			{@const selectedItem = results[resultIndex]}
			{@const float = selectedItem.float}
			{@const card = selectedItem.card}
			{@const arcanaType = selectedItem.arcanaType}

			<FloatGenerationStep stepNumber={1} {resultIndex} {seed} {float} />
			<TarotsResultStep {float} {card} {arcanaType} />
		{/if}
	</div>
</div>
