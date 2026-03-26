<script lang="ts">
	import { FloatGenerator } from '$lib/generator/FloatGenerator';
	import { debouncer } from '$lib/debounce.svelte';
	import type { MolesSeed } from '$lib/types';
	import { fisherYates } from '$lib/util/shuffle-impl/fisherYates';
	import MolesBoard from '$lib/games/moles/MolesBoard.svelte';
	import Loader from '$lib/games/Loader.svelte';
	import ContentBlock from '$lib/games/layout/ContentBlock.svelte';
	import { BG_COLOR } from '$lib/constants';

	const { formValues }: { formValues: Record<string, unknown> } = $props();

	let selectedRound = $state(0);

	const seed = $derived<MolesSeed>({
		clientSeed: formValues.clientseed as string,
		serverSeed: formValues.serverseed as string,
		nonce: formValues.nonce as number,
		molesCount: formValues.molesCount as number
	});

	const molesRoundsDebounced = $derived.by(
		debouncer(
			() => seed,
			(seed) => {
				const maxRounds = seed.molesCount === 1 ? 8 : 9;
				const rounds: number[][] = [];

				for (let round = 0; round < maxRounds; round++) {
					// Each round uses molesCount floats, each float uses 4 bytes
					const cursor = round * seed.molesCount * 4;
					const floatGenerator = FloatGenerator({
						...seed,
						cursor
					});

					const holes = Array.from({ length: 7 }).map((_v, i) => i);
					const molePositions = fisherYates(floatGenerator, holes, seed.molesCount)
						.map((item) => item.chosen)
						.sort((a, b) => a - b);

					rounds.push(molePositions);
				}

				return rounds;
			},
			350
		)
	);

	// Reset selected round when seed changes or rounds change
	$effect(() => {
		if (molesRoundsDebounced.value) {
			selectedRound = 0;
		}
	});
</script>

{#if molesRoundsDebounced.debouncing}
	<Loader />
{:else}
	{@const rounds = molesRoundsDebounced.value!}

	<p data-testid="moles-result" class="hidden">
		{JSON.stringify(rounds)}
	</p>

	<ContentBlock className="p-4">
		<div class="flex flex-col gap-6">
			<!-- Board display -->
			<MolesBoard molePositions={rounds[selectedRound]} />

			<!-- Round navigation buttons -->
			<div class="flex flex-wrap justify-center gap-2">
				{#each rounds as _, roundIndex}
					<button
						type="button"
						class={[
							'rounded px-3 py-2 text-sm font-medium transition-colors md:px-4 md:text-base',
							selectedRound === roundIndex
								? BG_COLOR + ' text-white'
								: 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
						]}
						onclick={() => (selectedRound = roundIndex)}
					>
						{roundIndex + 1}
					</button>
				{/each}
			</div>
		</div>
	</ContentBlock>
{/if}
