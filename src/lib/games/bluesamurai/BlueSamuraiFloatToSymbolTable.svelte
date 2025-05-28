<script lang="ts">
  import { fade } from 'svelte/transition';
  import { BlueSamuraiIcon as BlueSamuraiIconT } from '$lib/types';
  import BlueSamuraiIcon from '$lib/games/bluesamurai/BlueSamuraiIcon.svelte';
  import probabilities from '$lib/assets/bluesamurai/bluesamurai-probabilities.json';
  import { innerTileProbabilitySummed, outerTileProbabilitySummed } from '$lib/util/bluesamurai';

  let showProbabilityTableExplanation = $state(false);
</script>

<p class="mt-5 mb-2 text-center text-base sm:text-lg">
  Float &rarr; Symbol Correlation Table<span
    class="block text-sm text-gray-600 italic dark:text-white">(reference point)</span
  >
</p>

<div class="bg-gray-200 p-5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
  <button
    onclick={() => (showProbabilityTableExplanation = !showProbabilityTableExplanation)}
    class={[
      'm-auto mb-3 block px-5 py-1.5 text-sm font-medium text-white focus:ring-0 focus:outline-none',
      'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
    ]}>Click to find out more</button
  >
  {#if showProbabilityTableExplanation}
    <div
      in:fade={{ duration: 500 }}
      class=" bg-gray-300 p-5 text-center text-xs text-black dark:bg-gray-900 dark:text-gray-400"
    >
      <p class="mb-2 text-sm">
        Each symbol has its own probability of appearing in a tile. These probabilities are listed
        in the table below. There are 2 different probabilities assigned to each symbol, one for
        appearing in a tile in the inner 3 reels, and one for appearing in a tile in the outer 2
        reels.
      </p>
      <p class="mb-5 text-sm">
        There is commonality between a generated float and the probability aspect. If we were to sum
        all the probabilities in the inner / outer row we will get <b>1</b>. Also according to the
        conversions page a generated float can only be between <b>0</b> and <b>1</b> (max float value
        = sum of all probabilites).
      </p>
      <p class="mb-2 text-lg">How to correlate a float with a symbol?</p>
      <p class="mb-2 text-sm">
        We first need to create a summed version of the inner and outer rows, where the current
        probability is summed with the previous probabilities already visited (refer to the <span
          style="text-blue-500 dark:text-blue-400">summed</span
        >
        rows in the table below); symbol order is important. Once we have done this, we can correlate
        a float with a symbol by selecting the <b>FIRST</b> symbol where the float is
        <b>less than or equal to</b> the summed value.
      </p>
      <p class="mb-2 text-sm">
        e.g. if the generated float is <b>0.17</b> and its for an inner reel position, the chosen symbol
        would be:
      </p>
      <div class="flex justify-center">
        <div class="w-10 bg-gray-400 dark:bg-gray-700">
          <BlueSamuraiIcon icon={BlueSamuraiIconT.S2} />
        </div>
      </div>
    </div>
  {/if}

  <div class="relative mt-5 text-xs sm:text-sm">
    <div class="overflow-x-auto pb-3">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              class="sticky left-0 z-10 min-w-[100px] bg-gray-300 p-2 text-left opacity-85 sm:min-w-[115px] dark:bg-gray-700"
              >symbol</th
            >
            {#each probabilities as { symbol }, n (n)}
              <td class="p-2">
                <div class="w-15 bg-gray-300 dark:bg-gray-700">
                  <BlueSamuraiIcon icon={symbol as BlueSamuraiIconT} />
                </div>
              </td>
            {/each}
          </tr>
        </thead>
        <tbody class="text-center">
          <tr>
            <th class="sticky left-0 z-10 bg-gray-300 p-2 text-left opacity-85 dark:bg-gray-700"
              >symbol name</th
            >
            {#each probabilities as { symbol }, n (n)}
              <td class="p-2">
                {symbol}
              </td>
            {/each}
          </tr>
          <tr>
            <th class="sticky left-0 z-10 bg-gray-300 p-2 text-left opacity-85 dark:bg-gray-700"
              >inner reel tile probability</th
            >
            {#each probabilities as { inner }, n (n)}
              <td class="p-2">
                {inner}
              </td>
            {/each}
          </tr>
          <tr class="text-blue-500">
            <th class="sticky left-0 z-10 bg-gray-300 p-2 text-left opacity-85 dark:bg-gray-700"
              >inner reel tile probability (summed)</th
            >
            {#each innerTileProbabilitySummed as { max }, n (n)}
              <td class="p-2">
                {max.getValue()}
              </td>
            {/each}
          </tr>
          <tr>
            <th class="sticky left-0 z-10 bg-gray-300 p-2 text-left opacity-85 dark:bg-gray-700"
              >outer reel tile probability</th
            >
            {#each probabilities as { outer }, n (n)}
              <td class="p-2">
                {outer}
              </td>
            {/each}
          </tr>
          <tr class="text-blue-500">
            <th class="sticky left-0 z-10 bg-gray-300 p-2 text-left opacity-85 dark:bg-gray-700"
              >outer reel tile probability (summed)</th
            >
            {#each outerTileProbabilitySummed as { max }, n (n)}
              {#if n === outerTileProbabilitySummed.length - 1}
                <td class="p-2 text-red-500">excluded</td>
              {/if}
              <td class="p-2">
                {max.getValue()}
              </td>
            {/each}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
