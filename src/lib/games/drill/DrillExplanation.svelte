<script lang="ts">
	import type { Seed, DrillResult } from '$lib/types';
	import { FloatGenerator } from '$lib/generator/FloatGenerator';
	import { debouncer } from '$lib/debounce.svelte';
	import Loader from '$lib/games/Loader.svelte';
	import ResultTabs from '../ResultTabs.svelte';
	import { calculateDrillMultiplier } from '$lib/util/drill';
	import ContentBlock from '../layout/ContentBlock.svelte';
	import FloatGenerationStep from '../FloatGenerationStep.svelte';
	import DrillResultStep from './DrillResultStep.svelte';

	const { formValues }: { formValues: Record<string, unknown> } = $props();

	let resultIndex = $state(0);

	let seed = $derived<Seed>({
		clientSeed: formValues.clientseed as string,
		serverSeed: formValues.serverseed as string,
		nonce: formValues.nonce as number
	});

	const resultsDebounced = $derived.by(
		debouncer(
			() => seed,
			(seed) => {
				const floatGenerator = FloatGenerator(seed);
				const results: DrillResult[] = [];

				// Generate 3 drills
				for (let i = 0; i < 3; i++) {
					const float = floatGenerator.next().value;
					const multiplier = calculateDrillMultiplier(float);
					results.push({ float, multiplier, drillIndex: i });
				}

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

			<ContentBlock className="mb-7 p-5 text-center text-base text-gray-900 dark:text-white">
				<p class="mb-3">
					<strong>Drill Game Formula:</strong>
				</p>
				<code class="rounded bg-gray-100 px-3 py-2 dark:bg-gray-800">
					multiplier = u &lt; 0.02 ? 1 : min(0.98 / (1 - u), 2,000,000)
				</code>
				<p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
					If the random float (u) is below 0.02, the drill stops instantly at 1.00x.<br />
					Otherwise, the multiplier is calculated using an inverse formula with house edge of 0.98 (2%).<br
					/>
					Maximum multiplier is capped at 2,000,000x.
				</p>
			</ContentBlock>

			<ContentBlock className="mb-7 p-2 text-center text-base text-gray-900 dark:text-white">
				<p>
					Three drills generated in order. Click a drill to see how its multiplier was calculated
					using stake's provably fair algorithm
				</p>
			</ContentBlock>

			<ResultTabs
				{seed}
				items={results.map((result) => ({ chosen: result.drillIndex + 1 }))}
				bind:resultIndex
				tabNameModifier={(_chosen, n) => `${results[n].multiplier.toFixed(2)}x`}
			/>

			{@const selectedItem = results[resultIndex]}
			{@const float = selectedItem.float}
			{@const multiplier = selectedItem.multiplier}
			{@const drillIndex = selectedItem.drillIndex}

			<FloatGenerationStep stepNumber={1} {resultIndex} {seed} {float} />
			<DrillResultStep {float} {multiplier} {drillIndex} />
		{/if}
	</div>
</div>
