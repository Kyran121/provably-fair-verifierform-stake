<script lang="ts">
	import { FloatGenerator } from '$lib/generator/FloatGenerator';
	import { debouncer } from '$lib/debounce.svelte';
	import type { TarotSeed, TarotCard, TarotDifficulty, TarotArcanaType } from '$lib/types';
	import { TarotArcanaType as ArcanaType } from '$lib/types';
	import Loader from '$lib/games/Loader.svelte';
	import TarotsCard from './TarotsCard.svelte';
	import { TEXT_HIGHLIGHT_COLOR } from '$lib/config';
	import { findCard } from '$lib/util/tarot';

	const { formValues }: { formValues: Record<string, unknown> } = $props();

	const seed = $derived<TarotSeed>({
		clientSeed: formValues.clientseed as string,
		serverSeed: formValues.serverseed as string,
		nonce: formValues.nonce as number,
		difficulty: formValues.difficulty as TarotDifficulty
	});

	interface CardResult {
		card: TarotCard;
		arcanaType: TarotArcanaType;
		float: number;
	}

	const cardsDebounced = $derived.by(
		debouncer(
			() => seed,
			(seed) => {
				const floatGenerator = FloatGenerator(seed);
				const cards: CardResult[] = [];

				// Card 1: Minor Arcana
				const float1 = floatGenerator.next().value;
				const card1 = findCard(float1, seed.difficulty, ArcanaType.MINOR);
				if (card1) cards.push({ card: card1, arcanaType: ArcanaType.MINOR, float: float1 });

				// Card 2: Major Arcana
				const float2 = floatGenerator.next().value;
				const card2 = findCard(float2, seed.difficulty, ArcanaType.MAJOR);
				if (card2) cards.push({ card: card2, arcanaType: ArcanaType.MAJOR, float: float2 });

				// Card 3: Minor Arcana
				const float3 = floatGenerator.next().value;
				const card3 = findCard(float3, seed.difficulty, ArcanaType.MINOR);
				if (card3) cards.push({ card: card3, arcanaType: ArcanaType.MINOR, float: float3 });

				return cards;
			},
			350
		)
	);
</script>

{#if cardsDebounced.debouncing}
	<Loader />
{:else}
	{@const cards = cardsDebounced.value!}
	{@const totalMulti = cards.reduce((a, b) => a * b.card.multiplier, 1)}

	<p data-testid="tarot-result" class="mb-5 text-center text-base">
		won <span class="text-xl {TEXT_HIGHLIGHT_COLOR}">{totalMulti.toFixed(2)}x</span>
	</p>

	<div class="grid grid-cols-3 gap-3">
		{#each cards as { card, arcanaType }, i (i)}
			<div>
				<div class="mb-2 text-center text-sm font-semibold">
					{arcanaType === ArcanaType.MINOR ? 'Minor' : 'Major'} Arcana
				</div>
				<div class="aspect-[2/3]">
					<TarotsCard {arcanaType} multiplier={card.multiplier} />
				</div>
			</div>
		{/each}
	</div>
{/if}
