<script lang="ts">
	import type { FisherYatesItem } from '$lib/types';
	import ContentBlock from '../layout/ContentBlock.svelte';
	import HighlightLink from '../layout/HighlightLink.svelte';
	import HighlightText from '../layout/HighlightText.svelte';

	const {
		stepNumber,
		resultIndex,
		float,
		chosen,
		chosenIndex,
		chosenIndexes
	}: {
		stepNumber: number;
		resultIndex: number;
	} & FisherYatesItem<number> = $props();

	const { previousHoles, holesMinusPreviousMoles } = $derived.by(() => {
		const holes = Array.from({ length: 7 }).map((_v, i) => i);
		const previousHoles = chosenIndexes.slice(0, -1).map((i) => holes.splice(i, 1)[0]);
		return { previousHoles, holesMinusPreviousMoles: holes };
	});
</script>

<div class="mt-5 text-center">
	<p class="mb-2 text-xl">Step {stepNumber}</p>
	<p class="text-base">Transform float into mole position</p>
	<p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
		see <span class="font-bold">Moles</span> section on the
		<HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
	</p>

	<ContentBlock className="p-5 text-left font-mono text-xs">
		<p>holes = 7</p>
		<p class="mt-4">previousMoles = {`[${previousHoles.join(', ')}]`}</p>
		<p class="mt-4">holesWithoutPreviousMoles = {`[${holesMinusPreviousMoles.join(', ')}]`}</p>
		<p class="mt-4">float = {float.toFixed(12)}</p>
		<p class="mt-4">moleIndex</p>
		<p>
			= floor(<HighlightText>&lbrace;float&rbrace;</HighlightText> * (<HighlightText
				>&lbrace;holes&rbrace;</HighlightText
			>
			-
			<HighlightText>&lbrace;resultIndex&rbrace;</HighlightText>))
		</p>
		<p>
			= floor(<HighlightText>{float.toFixed(12)}</HighlightText> * (<HighlightText>7</HighlightText>
			-
			<HighlightText>{resultIndex}</HighlightText>))
		</p>
		<p>= {chosenIndex}</p>
		<p class="mt-4">molePosition</p>
		<p>
			= <HighlightText>&lbrace;holesWithoutPreviousMoles[</HighlightText>
		</p>
		<p class="indent-4"><HighlightText>moleIndex</HighlightText></p>
		<p><HighlightText>]&rbrace;</HighlightText></p>
		<p>
			= <HighlightText>&lbrace;holesWithoutPreviousMoles[</HighlightText>
		</p>
		<p class="indent-4"><HighlightText>{chosenIndex}</HighlightText></p>
		<p><HighlightText>]&rbrace;</HighlightText></p>
		<p>= {chosen}</p>
	</ContentBlock>
</div>
