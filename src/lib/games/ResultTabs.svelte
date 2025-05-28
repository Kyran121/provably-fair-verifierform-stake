<script lang="ts">
  import { type Card } from '$lib/types';
  import CardSuitIcon from '$lib/games/cards/CardSuitIcon.svelte';

  let {
    seed,
    items,
    resultIndex = $bindable(),
    tabWidthClass = 'w-15',
    tabNameModifier,
    tabSelectedClassModifier,
    tabClassModifier
  }: {
    seed: unknown;
    items: { chosen: unknown }[];
    tabWidthClass?: string;
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

<div class="mb-2 flex gap-1.5 overflow-x-scroll pb-5">
  {#each items as { chosen }, n (n)}
    <div class={['flex-none', tabWidthClass]}>
      <button
        class={[
          'w-full pt-3 pb-3 text-sm font-medium text-white focus:ring-0 focus:outline-none',
          n === resultIndex
            ? tabSelectedClassModifier
              ? tabSelectedClassModifier(n)
              : 'bg-blue-950'
            : tabClassModifier
              ? tabClassModifier(n)
              : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        ]}
        data-resultindex={n}
        onclick={handleResultClick}
        ><span class="text-xs">({n + 1})</span><br />

        {#if isCard(chosen)}
          {chosen.value} <CardSuitIcon suit={chosen.suit} small={true} />
        {:else if tabNameModifier}
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html tabNameModifier(chosen, n)}
        {:else}
          {chosen}
        {/if}
      </button>
    </div>
  {/each}
</div>
