<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import type { DartsDifficulty, DartsSeed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';
  import { TEXT_HIGHLIGHT_COLOR } from '$lib/constants';
  import dartboardEasy from '$lib/assets/darts/icons/dartboardEasy.svelte';
  import dartboardMedium from '$lib/assets/darts/icons/dartboardMedium.svelte';
  import dartboardHard from '$lib/assets/darts/icons/dartboardHard.svelte';
  import dartboardExpert from '$lib/assets/darts/icons/dartboardExpert.svelte';
  import { getClosestColor, hexToRgb, rgbToHex } from '$lib/util/color';
  import paylines from '$lib/assets/darts/darts-paylines.json';
  import type { Component } from 'svelte';

  interface Result {
    rotation: number;
    distance: number;
    normalisedDistance: number;
  }

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  let svgEl: SVGSVGElement | undefined = $state();
  let colorHex: string | undefined = $state();
  let colorRgb = $derived(colorHex !== undefined ? hexToRgb(colorHex) : undefined);

  const seed = $derived<DartsSeed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number,
    difficulty: formValues.difficulty as DartsDifficulty
  });

  const multis = $derived(paylines[seed.difficulty]);

  const colorHexList = ['#0e202c', '#213843', '#fcc101', '#fb6120', '#fb053f', '#24e700'];
  const colorClasses = [
    'bg-[#0e202c]',
    'bg-[#213843]',
    'bg-[#fcc101]',
    'bg-[#fb6120]',
    'bg-[#fb053f]',
    'bg-[#24e700]'
  ];

  const DIFFICULTY_TO_DARTBOARD: Record<DartsDifficulty, Component<{ ref?: SVGElement }>> = {
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

        return {
          rotation,
          distance,
          normalisedDistance
        } satisfies Result;
      },
      350
    )
  );

  function getCssRotation(originalRotation: number) {
    const angle = originalRotation * 2 * Math.PI;
    const x = Math.sin(angle);
    const y = -Math.cos(angle); // y axis is flipped
    return -(Math.atan2(y, x) / (2 * Math.PI)); // normalize back to [-0.5, 0.5]
  }

  // Effect to update colorHex based on the dart pointer position
  $effect(() => {
    if (!svgEl) return; // Exit if SVG element is not available
    if (resultDebounced.debouncing) return; // Exit if still debouncing

    // Get the result and calculate rotation/distance
    const result = resultDebounced.value!;
    const rotation = getCssRotation(result.rotation);
    const distance = result.normalisedDistance;

    // Get the bounding box of the SVG dartboard
    const bbox = svgEl.getBoundingClientRect();
    const width = bbox.width;
    const height = bbox.height;

    // Calculate the angle in radians for pointer position
    const angleRad = rotation * 2 * Math.PI;

    // Calculate the pointer's x/y position on the dartboard
    const x = width * (0.5 + distance * Math.cos(angleRad));
    const y = height * (0.5 - distance * Math.sin(angleRad));

    // Find the element at the pointer's position
    const elem = document.elementFromPoint(bbox.left + x, bbox.top + y);

    // Get the fill color of the element under the pointer
    const style = getComputedStyle(elem!);
    // Extract RGB values from the fill property
    const [_, rr, gg, bb] = style.fill.match(/(\d+), (\d+), (\d+)/)!.map(Number);

    // Find the closest color from the predefined list and update colorHex
    colorHex = getClosestColor(rgbToHex([rr, gg, bb]), colorHexList);
  });
</script>

{#if resultDebounced.debouncing}
  <Loader />
{:else}
  {@const result = resultDebounced.value!}
  {@const rotation = getCssRotation(result.rotation)}
  {@const distance = result.normalisedDistance}
  {@const Dartboard = DIFFICULTY_TO_DARTBOARD[seed.difficulty]}

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

  <div class="mt-5 border-1 border-gray-400 p-3 text-gray-500">
    <p class="mb-3 text-center italic">Preview</p>
    <div class="relative aspect-square" style="--rotation: {rotation}; --distance: {distance}">
      <!-- Dartboard -->
      <Dartboard bind:ref={svgEl} />

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
          background-color: rgb({colorRgb?.[0]}, {colorRgb?.[1]}, {colorRgb?.[2]})
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
              colorClasses[i].replace('bg-[', '').replace(']', '') === colorHex
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
