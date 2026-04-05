<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { DartsColor, DartsDifficulty, DartsSeed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';
  import dartboardEasy from '$lib/assets/darts/icons/dartboardEasy.svelte';
  import dartboardMedium from '$lib/assets/darts/icons/dartboardMedium.svelte';
  import dartboardHard from '$lib/assets/darts/icons/dartboardHard.svelte';
  import dartboardExpert from '$lib/assets/darts/icons/dartboardExpert.svelte';
  import paylines from '$lib/assets/darts/darts-paylines.json';
  import type { Component } from 'svelte';
  import { colorForDart, multiForDart } from '$lib/util/darts';

  const colorLabels: Record<string, string> = {
    '#24e700': 'Green',
    '#fb053f': 'Red',
    '#fcc101': 'Yellow',
    '#fb6120': 'Orange',
    '#213843': 'Light Gray',
    '#0e202c': 'Dark Gray'
  };

  interface Result {
    rotation: number;
    distance: number;
    normalisedDistance: number;
    colorHex: DartsColor;
    multi: number;
  }

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const seed = $derived<DartsSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as DartsDifficulty
  });

  const multis = $derived(paylines[seed.difficulty]);

  const colorClasses = [
    'bg-[#0e202c]',
    'bg-[#213843]',
    'bg-[#fcc101]',
    'bg-[#fb6120]',
    'bg-[#fb053f]',
    'bg-[#24e700]'
  ];

  const DIFFICULTY_TO_DARTBOARD: Record<DartsDifficulty, Component> = {
    easy: dartboardEasy,
    medium: dartboardMedium,
    hard: dartboardHard,
    expert: dartboardExpert
  };

  const resultDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const rotation = floatGenerator.next().value;
        const distance = floatGenerator.next().value;
        const normalisedDistance = Math.sqrt(distance) / 2;
        const colorHex = colorForDart(seed.difficulty, rotation, normalisedDistance);
        const multi = multiForDart(seed.difficulty, colorHex);

        return {
          rotation,
          distance,
          normalisedDistance,
          colorHex,
          multi
        } satisfies Result;
      },
      (formValues.delay as number) || 350
    )
  );

  function getCssRotation(originalRotation: number) {
    const angle = originalRotation * 2 * Math.PI;
    const x = Math.sin(angle);
    const y = -Math.cos(angle); // y axis is flipped
    return -(Math.atan2(y, x) / (2 * Math.PI)); // normalize back to [-0.5, 0.5]
  }
</script>

{#if resultDebounced.debouncing}
  <Loader />
{:else}
  {@const result = resultDebounced.value!}
  {@const rotation = getCssRotation(result.rotation)}
  {@const distance = result.normalisedDistance}
  {@const Dartboard = DIFFICULTY_TO_DARTBOARD[seed.difficulty]}
  {@const colorLabel = colorLabels[result.colorHex] ?? result.colorHex}

  <div data-testid="rotation" class="hidden">{result.rotation.toFixed(3)}</div>
  <div data-testid="distance" class="hidden">{result.distance.toFixed(3)}</div>
  <div data-testid="pixelColor" class="hidden">{result.colorHex}</div>
  <div data-testid="multi" class="hidden">{result.multi}</div>

  <ContentBlock className="mb-5 p-5">
    <!-- Stats row -->
    <div class="mb-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
      <span class="text-gray-500 dark:text-gray-400">
        rotation = <span class="font-bold text-purple-600 dark:text-purple-400"
          >{result.rotation.toFixed(6)}</span
        >
      </span>
      <span class="text-gray-500 dark:text-gray-400">
        distance = <span class="font-bold text-purple-600 dark:text-purple-400"
          >{result.distance.toFixed(6)}</span
        >
      </span>
      <span class="text-gray-500 dark:text-gray-400">
        norm. dist = <span class="font-bold text-purple-600 dark:text-purple-400"
          >{result.normalisedDistance.toFixed(6)}</span
        >
      </span>
    </div>

    <!-- Result tile -->
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex items-center gap-2">
        <span
          class="inline-block h-4 w-4 flex-shrink-0 rounded-sm border border-gray-300"
          style="background: {result.colorHex}"
        ></span>
        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{colorLabel}</span>
      </div>
      <span class="text-gray-400">→</span>
      <span
        class="inline-flex items-center justify-center rounded border-2 border-green-500 bg-green-50 px-3 py-1.5 font-bold text-green-700 ring-2 ring-green-400 dark:border-green-400 dark:bg-green-900/20 dark:text-green-400"
      >
        {result.multi}x
      </span>
    </div>
  </ContentBlock>

  <!-- Dartboard preview -->
  <ContentBlock className="p-3">
    <p class="mb-3 text-center text-sm text-gray-500 italic dark:text-gray-400">Preview</p>
    <div class="relative aspect-square" style="--rotation: {rotation}; --distance: {distance}">
      <Dartboard />
      <div
        class="pointer-events-none absolute top-1/2 left-1/2 border-2 border-blue-400"
        style="width: 86.87%; height: 86.87%; transform: translate(-50%, -50%); box-sizing: border-box;"
      >
        <div class="relative h-full w-full">
          <div
            class="pointer-events-none absolute h-6 w-6 rounded-full border-5 border-white shadow-[4px_4px_6px_rgba(0,0,0,0.6)]"
            style="
              top: calc(50% - var(--distance) * 100% * sin(calc(var(--rotation) * 360deg)));
              left: calc(50% + var(--distance) * 100% * cos(calc(var(--rotation) * 360deg)));
              transform: translate(-50%, -50%);
              background: {result.colorHex}
            "
          ></div>
        </div>
      </div>
    </div>

    <!-- Multiplier bar -->
    <div class="mt-4 flex w-full justify-center">
      <div class="flex w-full max-w-xl justify-between gap-2">
        {#each multis as multi, i (i)}
          {@const bgClass = colorClasses[i]}
          {@const bgColor = bgClass.replace('bg-[', '').replace(']', '')}
          {@const isActive = bgColor === result.colorHex}
          <div
            class={[
              'text-md relative flex-1 rounded-md px-3 py-2 text-center font-medium dark:text-white',
              isActive ? `${bgClass} text-white` : ''
            ]}
          >
            {multi}x
            <div class={['absolute bottom-0 left-0 h-[7px] w-full rounded-b-md', bgClass]}></div>
          </div>
        {/each}
      </div>
    </div>
  </ContentBlock>
{/if}
