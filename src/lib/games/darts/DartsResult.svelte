<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { DartsColor, DartsDifficulty, DartsSeed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';
  import dartboardEasy from '$lib/assets/darts/icons/dartboardEasy.svelte';
  import dartboardMedium from '$lib/assets/darts/icons/dartboardMedium.svelte';
  import dartboardHard from '$lib/assets/darts/icons/dartboardHard.svelte';
  import dartboardExpert from '$lib/assets/darts/icons/dartboardExpert.svelte';
  import paylines from '$lib/assets/darts/darts-paylines.json';
  import type { Component } from 'svelte';
  import { colorForDart, multiForDart } from '$lib/util/darts';

  interface Result {
    rotation: number;
    distance: number;
    normalisedDistance: number;
    colorHex: DartsColor;
    multi: number;
  }

  const { formValues }: { formValues: Record<string, unknown>; delay?: number } = $props();

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
      0
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

  <div data-testid="rotation" class="hidden">{result.rotation.toFixed(3)}</div>
  <div data-testid="distance" class="hidden">{result.distance.toFixed(3)}</div>
  <div data-testid="pixelColor" class="hidden">{result.colorHex}</div>
  <div data-testid="multi" class="hidden">{result.multi}</div>

  <p class="text-center text-base">
    rotation: <span class="text-xl {TEXT_HIGHLIGHT_COLOR}">{result.rotation.toFixed(3)}</span>
  </p>
  <p class="text-center text-base">
    distance: <span class="text-xl {TEXT_HIGHLIGHT_COLOR}">{result.distance.toFixed(3)}</span>
  </p>
  <p class="text-center text-base">
    normalised distance: <span class="text-xl {TEXT_HIGHLIGHT_COLOR}"
      >sqrt( {result.distance.toFixed(3)} ) / 2 = {result.normalisedDistance.toFixed(3)}</span
    >
  </p>

  <div data-testid="dartboard-cand" class="mt-5 border-1 border-gray-400 p-3 text-gray-500">
    <p class="mb-3 text-center italic">Preview</p>
    <div class="relative aspect-square" style="--rotation: {rotation}; --distance: {distance}">
      <!-- Dartboard -->
      <Dartboard />

      <!-- Overlay: 13.13% smaller square -->
      <div
        class="pointer-events-none absolute top-1/2 left-1/2 border-2 border-blue-400"
        style="
        width: 86.87%;
        height: 86.87%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
      "
      >
        <div class="relative h-full w-full">
          <!-- Pointer -->
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

    <!-- #213743 , #324f5e , #fcc002 , #fc7709 ,  #e9103c , #24e800 -->

    <div class="flex w-full justify-center p-4">
      <div class="flex w-full max-w-xl justify-between gap-2">
        {#each multis as multi, i (i)}
          <div
            class={[
              'text-md relative flex-1 rounded-md px-3 py-2 text-center font-medium dark:text-white',
              colorClasses[i].replace('bg-[', '').replace(']', '') === result.colorHex
                ? `${colorClasses[i]} text-white`
                : ''
            ]}
          >
            {multi}x
            <div class={['absolute bottom-0 left-0 h-[7px] w-full', colorClasses[i]]}></div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
