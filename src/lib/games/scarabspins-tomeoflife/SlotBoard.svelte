<script lang="ts">
  import type { Component } from 'svelte';
  import { ScarabSpinsTomeOfLifeIcon, type ScarabSpinsTomeOfLifeRound } from '$lib/types';
  import reels from '$lib/assets/scarabspins-tomeoflife/slot-reels.json';
  import Indicator from '$lib/games/Indicator.svelte';

  const {
    round,
    roundIndex,
    IconComponent
  }: {
    round: ScarabSpinsTomeOfLifeRound;
    roundIndex: number;
    IconComponent: Component<{ icon: ScarabSpinsTomeOfLifeIcon }>;
  } = $props();
</script>

{#if round.retrigger}
  <p class="mb-2 bg-green-500 text-center italic dark:bg-green-600">+15 bonus spins</p>
{/if}

{#if roundIndex > 0}
  <p class="mb-2 bg-blue-400 text-center italic dark:bg-blue-600">
    bonus spin ({roundIndex}/{round.totalRounds - 1})
  </p>
{/if}

<div class="grid grid-cols-5 gap-1">
  {#each round.centerPositions as centerPosition, n (n)}
    {@const reelSize = n === 4 ? 41 : 30}
    {@const previousIndex = (centerPosition.index - 1 < 0 ? reelSize : centerPosition.index) - 1}
    {@const icon = reels[n][previousIndex] as ScarabSpinsTomeOfLifeIcon}

    <div
      class={[
        'relative',
        icon === ScarabSpinsTomeOfLifeIcon.SCATTER
          ? 'border-2 border-gray-300 dark:border-gray-500'
          : 'bg-gray-100 dark:bg-gray-700'
      ]}
    >
      <IconComponent {icon} />
      <Indicator
        text={`${previousIndex + 1}/${reelSize}`}
        bgColorClass="bg-gray-300 dark:bg-gray-500"
      />
    </div>
  {/each}

  {#each round.centerPositions as centerPosition, n (n)}
    {@const reelSize = n === 4 ? 41 : 30}
    {@const index = centerPosition.index}
    {@const icon = reels[n][index] as ScarabSpinsTomeOfLifeIcon}

    <div
      class={[
        'relative',
        icon === ScarabSpinsTomeOfLifeIcon.SCATTER
          ? 'border-2 border-gray-300 dark:border-gray-500'
          : 'bg-gray-100 dark:bg-gray-700'
      ]}
    >
      <IconComponent {icon} />
      <Indicator text={`${index + 1}/${reelSize}`} />
    </div>
  {/each}

  {#each round.centerPositions as centerPosition, n (n)}
    {@const reelSize = n === 4 ? 41 : 30}
    {@const nextIndex = centerPosition.index + 1 === reelSize ? 0 : centerPosition.index + 1}
    {@const icon = reels[n][nextIndex] as ScarabSpinsTomeOfLifeIcon}

    <div
      class={[
        'relative',
        icon === ScarabSpinsTomeOfLifeIcon.SCATTER
          ? 'border-2 border-gray-300 dark:border-gray-500'
          : 'bg-gray-100 dark:bg-gray-700'
      ]}
    >
      <IconComponent {icon} />
      <Indicator
        text={`${nextIndex + 1}/${reelSize}`}
        bgColorClass="bg-gray-300 dark:bg-gray-500"
      />
    </div>
  {/each}
</div>
