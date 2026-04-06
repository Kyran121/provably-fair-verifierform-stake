<script lang="ts">
  import {
    type BlueSamuraiRound,
    type BlueSamuraiSymbol,
    BlueSamuraiIcon as BlueSamuraiIconT,
    BlueSamuraiRetriggerType
  } from '$lib/types';
  import { isLeftOuterReelSamurais, isRightOuterReelSamurais } from '$lib/util/bluesamurai';
  import BlueSamuraiIcon from '$lib/games/bluesamurai/BlueSamuraiIcon.svelte';
  import { BTN_BG_COLOR, BTN_BG_COLOR_BLUE } from '$lib/config';

  const { round, focused }: { round: BlueSamuraiRound; focused?: number } = $props();

  const outerReel1 = $derived.by(() => {
    const outerReel1 = round.symbols.slice(0, 3);
    return round.specialRound ? noindex(outerReel1) : index(outerReel1, 1);
  });
  const innerReel1 = $derived(index(round.symbols.slice(3, 7), round.specialRound ? 1 : 4));
  const innerReel2 = $derived(index(round.symbols.slice(7, 11), round.specialRound ? 5 : 8));
  const innerReel3 = $derived(index(round.symbols.slice(11, 15), round.specialRound ? 9 : 12));
  const outerReel2 = $derived.by(() => {
    const outerReel2 = round.symbols.slice(15);
    return round.specialRound ? noindex(outerReel2) : index(outerReel2, 16);
  });

  const reels = $derived([outerReel1, innerReel1, innerReel2, innerReel3, outerReel2]);

  function noindex(values: BlueSamuraiSymbol[]) {
    return values.map(({ icon }) => ({
      index: undefined,
      icon
    }));
  }

  function index(values: BlueSamuraiSymbol[], start: number) {
    return values.map(({ icon }, i) => ({ index: start + i, icon }));
  }

  function isSpecialRoundTriggerIcon(index: number) {
    return (
      (index < 4 && isLeftOuterReelSamurais(round)) ||
      (index > 15 && isRightOuterReelSamurais(round))
    );
  }
</script>

{#if round.retrigger}
  <p
    class={[
      'mb-2 rounded border-2 px-3 py-1 text-center text-xs font-semibold',
      round.retriggerType === BlueSamuraiRetriggerType.BONUS
        ? 'border-green-500 bg-green-100 text-green-700 dark:border-green-400 dark:bg-green-900/30 dark:text-green-400'
        : 'border-red-500 bg-red-100 text-red-700 dark:border-red-400 dark:bg-red-900/30 dark:text-red-400'
    ]}
  >
    +{round.retriggerType === BlueSamuraiRetriggerType.BONUS ? '10 bonus' : '5 special round'} spins
  </p>
{/if}

{#if round.specialRound}
  <p
    class="mb-2 rounded border-2 border-blue-500 bg-blue-100 px-3 py-1 text-center text-xs font-semibold text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400"
  >
    special round ({round.specialSpin}/5)
  </p>
  <p
    class="mb-2 rounded border-2 border-purple-500 bg-purple-100 px-3 py-1 text-center text-xs font-semibold text-purple-700 dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-400"
  >
    bonus paused ({round.bonusSpin - 1}/{round.totalBonusRounds})
  </p>
{:else if round.bonusSpin! > 0}
  <p
    class="mb-2 rounded border-2 border-purple-500 bg-purple-100 px-3 py-1 text-center text-xs font-semibold text-purple-700 dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-400"
  >
    bonus round ({round.bonusSpin}/{round.totalBonusRounds})
  </p>
{/if}

<div class="mt-3 grid grid-cols-5 gap-1">
  {#each reels as reel, nn (nn)}
    <div class="m-auto">
      {#each reel as { index, icon }, n (n)}
        {@const textClass =
          round.retriggerType === BlueSamuraiRetriggerType.SPECIAL &&
          isSpecialRoundTriggerIcon(index!)
            ? 'text-blue-700 dark:text-blue-300'
            : round.retriggerType === BlueSamuraiRetriggerType.BONUS &&
                icon === BlueSamuraiIconT.SCATTER
              ? 'text-green-700 dark:text-green-300'
              : 'text-gray-700 dark:text-gray-300'}

        <div
          class={[
            'relative mb-1 rounded border-2',
            focused !== undefined && focused === index! - 1
              ? 'border-purple-400 bg-purple-100 dark:border-purple-500 dark:bg-purple-900/30'
              : (round.specialRound && round.stuckSamurais?.has(index! + 2)) ||
                  icon === BlueSamuraiIconT.SAMURAI
                ? (round.retrigger &&
                    round.retriggerType === BlueSamuraiRetriggerType.SPECIAL &&
                    isSpecialRoundTriggerIcon(index!)) ||
                  round.specialRound
                  ? 'border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-900/30'
                  : 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'
                : icon === BlueSamuraiIconT.SCATTER
                  ? round.retrigger && round.retriggerType === BlueSamuraiRetriggerType.BONUS
                    ? 'border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-900/30'
                    : 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
          ]}
        >
          <BlueSamuraiIcon
            icon={round.specialRound && round.stuckSamurais?.has(index! + 2)
              ? BlueSamuraiIconT.SAMURAI
              : icon}
          />

          {#if index}
            <span
              class="mt-0.5 mb-2 block text-center text-[11px] leading-none text-gray-400 dark:text-gray-300"
            >
              {index}
            </span>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
