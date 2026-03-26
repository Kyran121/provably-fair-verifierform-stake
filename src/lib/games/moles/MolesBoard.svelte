<script lang="ts">
	import holeIcon from '$lib/assets/moles/icons/hole-50x50.png';
	import moleIcon from '$lib/assets/moles/icons/mole-50x50.png';
	import { BG_COLOR_GRAY, BG_COLOR } from '$lib/constants';

	const { molePositions }: { molePositions: number[] } = $props();
	const molePositionsLookup = $derived(new Set(molePositions));

	const getColorClass = (n: number) => (molePositionsLookup.has(n) ? BG_COLOR : BG_COLOR_GRAY);

	const rows = [
		[0, 1],
		[2, 3, 4],
		[5, 6]
	];
</script>

<div class="flex flex-col items-center gap-1 md:gap-1.5">
		{#each rows as row}
			<div class="flex gap-1 md:gap-1.5">
				{#each row as hole}
					<div class={['grid grid-cols-2 gap-1 md:gap-1.5', getColorClass(hole)]}>
						<div class="flex items-center justify-center">{hole}</div>
						<div>
							<img
								class="relative scale-80 object-scale-down"
								src={molePositionsLookup.has(hole) ? moleIcon : holeIcon}
								alt={molePositionsLookup.has(hole) ? 'mole' : 'hole'}
							/>
						</div>
					</div>
				{/each}
			</div>
		{/each}
</div>
