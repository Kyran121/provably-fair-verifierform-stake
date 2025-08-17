<script lang="ts">
  import type { PacksCard, Seed } from '$lib/types';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import Loader from '$lib/games/Loader.svelte';
  import PacksTable from './PacksTable.svelte';
  import ResultTabs from '../ResultTabs.svelte';
  import { findCard } from '$lib/util/packs';
  import ContentBlock from '../layout/ContentBlock.svelte';
  import FloatGenerationStep from '../FloatGenerationStep.svelte';
  import PacksResultStep from './PacksResultStep.svelte';

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
        const results: { float: number; card: PacksCard }[] = [];
        for (let i = 0; i < 5; i++) {
          const float = floatGenerator.next().value;
          const card = findCard(float)!;
          results.push({ float, card });
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

      <PacksTable />

      <ContentBlock className="mb-7 p-2 text-center text-base text-gray-900 dark:text-white">
        <p>
          Cards selected in the order shown below. Click a card to find out how it was selected
          using stake's provably fair algorithm
        </p>
      </ContentBlock>

      <ResultTabs
        {seed}
        items={results.map((card) => ({ chosen: card.card.cardId }))}
        bind:resultIndex
      />

      {@const selectedItem = results[resultIndex]}
      {@const float = selectedItem.float}
      {@const card = selectedItem.card}

      <FloatGenerationStep stepNumber={1} {resultIndex} {seed} float={selectedItem.float} />
      <PacksResultStep {float} {card} />
    {/if}
  </div>
</div>
