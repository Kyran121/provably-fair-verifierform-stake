<script lang="ts">
  import {
    type BlueSamuraiRound,
    type BlueSamuraiSymbol,
    BlueSamuraiIcon as BlueSamuraiIconT,
    BlueSamuraiRetriggerType,
    IndicatorPosition
  } from '$lib/types';
  import { isLeftOuterReelSamurais, isRightOuterReelSamurais } from '$lib/util/bluesamurai';
  import Indicator from '$lib/games/Indicator.svelte';
  import BlueSamuraiIcon from '$lib/games/bluesamurai/BlueSamuraiIcon.svelte';

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
      'mb-2 text-center italic',
      round.retriggerType === BlueSamuraiRetriggerType.BONUS
        ? 'bg-green-400 dark:bg-green-600'
        : 'bg-red-400 dark:bg-red-600'
    ]}
  >
    +{round.retriggerType === BlueSamuraiRetriggerType.BONUS ? '10 bonus' : '5 special round'} spins
  </p>
{/if}

{#if round.specialRound}
  <p class="mb-2 bg-purple-400 text-center italic dark:bg-purple-600">
    special round ({round.specialSpin}/5)
  </p>
  <p class="mb-2 bg-blue-400 text-center italic dark:bg-blue-600">
    bonus paused ({round.bonusSpin - 1}/{round.totalBonusRounds})
  </p>
{:else if round.bonusSpin! > 0}
  <p class="mb-2 bg-blue-400 text-center italic dark:bg-blue-600">
    bonus round ({round.bonusSpin}/{round.totalBonusRounds})
  </p>
{/if}

<div class="grid grid-cols-5 gap-1">
  {#each reels as reel, nn (nn)}
    <div class="m-auto">
      {#each reel as { index, icon }, n (n)}
        {@const textClass =
          (round.retriggerType === BlueSamuraiRetriggerType.SPECIAL &&
            isSpecialRoundTriggerIcon(index!)) ||
          (round.retriggerType === BlueSamuraiRetriggerType.BONUS &&
            icon === BlueSamuraiIconT.SCATTER)
            ? 'text-white'
            : 'text-gray-700 dark:text-white'}

        <div
          class={[
            'relative mb-1',
            focused !== undefined && focused === index! - 1
              ? 'bg-yellow-500 dark:bg-yellow-700'
              : (round.specialRound && round.stuckSamurais?.has(index! + 2)) ||
                  icon === BlueSamuraiIconT.SAMURAI
                ? 'border-2 border-blue-500 dark:border-blue-700 ' +
                  ((round.retrigger &&
                    round.retriggerType === BlueSamuraiRetriggerType.SPECIAL &&
                    isSpecialRoundTriggerIcon(index!)) ||
                  round.specialRound
                    ? 'bg-blue-600 dark:bg-blue-700'
                    : 'bg-gray-200 dark:bg-gray-700')
                : icon === BlueSamuraiIconT.SCATTER
                  ? 'border-2 border-green-700 dark:border-green-800 ' +
                    (round.retrigger && round.retriggerType === BlueSamuraiRetriggerType.BONUS
                      ? 'bg-green-600 dark:bg-green-700'
                      : 'bg-gray-200 dark:bg-gray-700')
                  : 'bg-gray-200 dark:bg-gray-700'
          ]}
        >
          <BlueSamuraiIcon
            icon={round.specialRound && round.stuckSamurais?.has(index! + 2)
              ? BlueSamuraiIconT.SAMURAI
              : icon}
          />

          <Indicator
            text={round.specialRound &&
            (nn === 0 || nn === 4 || round.stuckSamurais?.has(index! + 2))
              ? BlueSamuraiIconT.SAMURAI + ' &#128274;'
              : icon}
            position={IndicatorPosition.BOTTOM_LEFT}
            textClass={`text-xs text-center italic ${textClass}`}
            bgColorClass=""
            widthClass=""
          />

          {#if index}
            <Indicator text={index} bgColorClass="bg-gray-300 dark:bg-gray-500" />
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
