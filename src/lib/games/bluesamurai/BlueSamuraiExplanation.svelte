<script lang="ts">
  import { debouncer } from '$lib/debounce.svelte';
  import { BlueSamuraiRetriggerType, type Seed } from '$lib/types';
  import BlueSamuraiFloatToSymbolTable from '$lib/games/bluesamurai/BlueSamuraiFloatToSymbolTable.svelte';
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { simulateRounds } from '$lib/util/bluesamurai';
  import Loader from '$lib/games/Loader.svelte';
  import ResultTabs from '../ResultTabs.svelte';
  import BlueSamuraiBoard from './BlueSamuraiBoard.svelte';
  import FloatGenerationStep from '../FloatGenerationStep.svelte';
  import BlueSamuraiIcon from './BlueSamuraiIcon.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let resultIndex = $state(0);

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const roundsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        return simulateRounds(floatGenerator);
      },
      350
    )
  );
</script>

<div class="mt-5 border-0 text-center dark:text-white">
  <div id="step-content" class="pb-4 text-left text-sm dark:bg-gray-900 dark:text-white">
    {#if roundsDebounced.debouncing}
      <Loader />
    {:else}
      {@const allRounds = roundsDebounced.value!}
      {@const items = allRounds.flatMap((round) =>
        round.symbols.filter((symbol) => symbol.float).map((symbol) => ({ ...round, symbol }))
      )}
      {@const round = allRounds[items[resultIndex].round - 1]}
      {@const symbol = items[resultIndex].symbol}
      {@const symbolIndex = symbol.index}
      {@const float = symbol.float!}

      <BlueSamuraiFloatToSymbolTable />

      <div class="mt-4 text-center">
        <p class="mb-2 text-xl">Need To Know</p>
        <ul class="list-disc text-left text-sm text-gray-600 dark:text-white">
          <li class="mb-2">
            A bonus game is triggered when 3 or more scatter symbols appear on the inner three
            reels.
          </li>
          <li class="mb-2">
            A special game is triggered when either the left or right outer reel contains only
            samurai symbols.
          </li>
          <li class="mb-2">
            A special game can trigger during a bonus game. It is handled separately and awards 5
            additional spins. Once the special game ends, the remaining bonus spins resume.
          </li>
          <li>
            Every symbol requires a float, except during the 5 special rounds where samurai symbols
            are stuck on the outer reels. Since each outer reel has 3 positions, this results in 30
            fewer floats (3 × 2 × 5).
          </li>
        </ul>
      </div>

      <div class="mt-4 mb-7 text-center">
        <p class="mb-2 text-xl">Step 1</p>
        <p class="mb-3 text-base">
          Extract 12 floats for special rounds and 18 floats for other rounds
        </p>

        <ResultTabs
          {seed}
          items={items.map((item) => ({ chosen: item.symbol.icon }))}
          bind:resultIndex
          tabNameModifier={(chosen, n) =>
            `spin<br>${items[n].round}<br>position<br>${items[n].symbol.index + (items[n].specialRound ? -2 : 1)}<br>symbol<br>${chosen}`}
          tabSelectedClassModifier={(n) =>
            items[n].retrigger && items[n].retriggerType === BlueSamuraiRetriggerType.SPECIAL
              ? 'bg-red-900'
              : !items[n].retrigger && !items[n].retriggerType && items[n].specialRound
                ? 'bg-purple-950'
                : items[n].retrigger && items[n].retriggerType === BlueSamuraiRetriggerType.BONUS
                  ? 'bg-green-900'
                  : 'bg-blue-950'}
          tabClassModifier={(n) =>
            items[n].retrigger && items[n].retriggerType === BlueSamuraiRetriggerType.SPECIAL
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-800'
              : !items[n].retrigger && !items[n].retriggerType && items[n].specialRound
                ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 ' +
                  (items[n].stuckSamurais?.has(items[n].symbol.index!) ? 'opacity-50' : '')
                : items[n].retrigger && items[n].retriggerType === BlueSamuraiRetriggerType.BONUS
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                  : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}
        />

        <BlueSamuraiBoard {round} focused={symbolIndex + (round.specialRound ? -3 : 0)} />
      </div>

      <div class="mt-3 border-1 border-gray-400 p-5">
        <FloatGenerationStep stepNumber={1.1} {resultIndex} {seed} {float} />
      </div>

      <div class="mt-4 text-center">
        <p class="mb-2 text-xl">Step 2</p>
        <p class="mb-3 text-base">
          Convert float to symbol using <b>Float &rarr; Symbol Correlation Table</b>
        </p>

        <div
          class="bg-gray-200 p-5 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        >
          <p>
            according to the <b>Float &rarr; Symbol Correlation Table</b>, the first symbol where
            <span class="font-mono">{float.toFixed(12)}</span> is less than or equal to the summed probability
            is:
          </p>

          <div class="grid grid-cols-3">
            <div>
              <BlueSamuraiIcon icon={symbol.icon} />
            </div>
            <div class="m-auto">
              <p class="text-center font-mono">
                <span class="mt-1 block text-blue-500"
                  >previous summed probability:<br />{symbol.min?.getValue()}</span
                >
                <span class="mt-1 block">{float.toFixed(12)}</span>
                <span class="mt-1 block text-blue-500"
                  >summed probability:<br />{symbol.max?.getValue()}</span
                >
              </p>
            </div>
            <div class="m-auto">
              <p class="font-mono">
                reel type:<br /><span class="text-blue-500">{symbol.reelType}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
