<script lang="ts">
  import { type Card } from '$lib/types';
  import CardSuitIcon from '$lib/games/cards/CardSuitIcon.svelte';
  import { BTN_BG_COLOR, BTN_BG_COLOR_SELECTED } from '$lib/constants';

  let {
    seed,
    items,
    resultIndex = $bindable(),
    tabWidthClass = 'w-15',
    grayCardIcon = false,
    tabNameModifier,
    tabSelectedClassModifier,
    tabClassModifier
  }: {
    seed: unknown;
    items: { chosen: unknown }[];
    tabWidthClass?: string;
    grayCardIcon?: boolean;
    tabNameModifier?: (chosen: unknown, i: number) => string;
    tabSelectedClassModifier?: (i: number) => string;
    tabClassModifier?: (i: number) => string;
    resultIndex: number;
  } = $props();

  $effect(() => {
    // listen for seed changes
    void seed;

    resultIndex = 0;
  });

  function handleResultClick(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    const clickedResultIndex = parseInt(button.dataset.resultindex!);
    if (resultIndex === clickedResultIndex) {
      return;
    }
    resultIndex = clickedResultIndex;
  }

  function isCard(value: unknown): value is Card {
    return (
      typeof value === 'object' &&
      value !== null &&
      typeof (value as Card).value === 'string' &&
      typeof (value as Card).suit === 'string'
    );
  }
</script>

<div class="mb-2 overflow-x-auto overflow-y-visible" style="padding: 6px 6px 0 4px;">
  <div class="flex gap-2 pb-5" style="min-width: max-content;">
    {#each items as { chosen }, n (n)}
      <div class={['flex-none overflow-visible', tabWidthClass]}>
        <button
          class={[
            'w-full overflow-visible pt-2 pb-2 text-sm font-medium outline-none',
            n === resultIndex
              ? tabSelectedClassModifier
                ? tabSelectedClassModifier(n)
                : BTN_BG_COLOR_SELECTED
              : tabClassModifier
                ? tabClassModifier(n)
                : BTN_BG_COLOR
          ]}
          data-resultindex={n}
          onclick={handleResultClick}
          ><span class="block text-xs">({n + 1})</span>{#if isCard(chosen)}<span class="block"
              >{chosen.value}</span
            ><span class="block"
              ><CardSuitIcon suit={chosen.suit} small={true} dark={grayCardIcon} /></span
            >{:else if tabNameModifier}<!-- eslint-disable-next-line svelte/no-at-html-tags -->{@html tabNameModifier(
              chosen,
              n
            )}{:else}{chosen}{/if}
        </button>
      </div>
    {/each}
  </div>
</div>
