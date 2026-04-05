<script lang="ts">
  import { DARTS_COLOR_TO_MULTI } from '$lib/constants';
  import { colorForDart } from '$lib/util/darts';
  import type { DartsDifficulty } from '$lib/types';
  import ContentBlock from '$lib/games/layout/ContentBlock.svelte';
  import HighlightLink from '$lib/games/layout/HighlightLink.svelte';
  import HighlightText from '$lib/games/layout/HighlightText.svelte';

  const {
    stepNumber,
    rotation,
    distance,
    normalisedDistance,
    colorHex,
    multi,
    difficulty,
    contentBlockClassName = 'p-4'
  }: {
    stepNumber: number;
    rotation: number;
    distance: number;
    normalisedDistance: number;
    colorHex: string;
    multi: number;
    difficulty: DartsDifficulty;
    contentBlockClassName?: string;
  } = $props();

  const colorLabels: Record<string, string> = {
    '#24e700': 'Green',
    '#fb053f': 'Red',
    '#fcc101': 'Yellow',
    '#fb6120': 'Orange',
    '#213843': 'Light Gray',
    '#0e202c': 'Dark Gray'
  };

  const multisForDifficulty = $derived(DARTS_COLOR_TO_MULTI[difficulty]);

  const r = $derived(normalisedDistance * 1000);
  const deg = $derived((((rotation % 1) + 1) % 1) * 360);
  const wedgeBin = $derived(Math.floor(deg / 20));

  const colorLabel = $derived(colorLabels[colorHex] ?? colorHex);

  const isWedgeZone = $derived(
    colorHex === '#fb6120' || colorHex === '#fb053f' || colorHex === '#fcc101'
  );

  // Per-difficulty wedge bin → color mappings (18 bins, each covers 20°)
  const WEDGE_BIN_COLORS: Record<DartsDifficulty, string[]> = {
    easy: [
      /* 0 */ '#fcc101',
      /* 1 */ '#fb6120',
      /* 2 */ '#fcc101',
      /* 3 */ '#fb053f',
      /* 4 */ '#fcc101',
      /* 5 */ '#fb6120',
      /* 6 */ '#fcc101',
      /* 7 */ '#fb053f',
      /* 8 */ '#fcc101',
      /* 9 */ '#fb6120',
      /* 10 */ '#fcc101',
      /* 11 */ '#fb053f',
      /* 12 */ '#fcc101',
      /* 13 */ '#fb6120',
      /* 14 */ '#fcc101',
      /* 15 */ '#fb6120',
      /* 16 */ '#fcc101',
      /* 17 */ '#fb053f'
    ],
    medium: [
      /* 0 */ '#fcc101',
      /* 1 */ '#fb6120',
      /* 2 */ '#fcc101',
      /* 3 */ '#fb053f',
      /* 4 */ '#fcc101',
      /* 5 */ '#fb6120',
      /* 6 */ '#fcc101',
      /* 7 */ '#fb053f',
      /* 8 */ '#fcc101',
      /* 9 */ '#fb6120',
      /* 10 */ '#fcc101',
      /* 11 */ '#fb053f',
      /* 12 */ '#fcc101',
      /* 13 */ '#fb6120',
      /* 14 */ '#fcc101',
      /* 15 */ '#fb6120',
      /* 16 */ '#fcc101',
      /* 17 */ '#fb053f'
    ],
    hard: [
      /* 0 */ '#fcc101',
      /* 1 */ '#fb6120',
      /* 2 */ '#fcc101',
      /* 3 */ '#fb6120',
      /* 4 */ '#fcc101',
      /* 5 */ '#fb053f',
      /* 6 */ '#fcc101',
      /* 7 */ '#fb6120',
      /* 8 */ '#fcc101',
      /* 9 */ '#fb6120',
      /* 10 */ '#fcc101',
      /* 11 */ '#fb053f',
      /* 12 */ '#fcc101',
      /* 13 */ '#fb6120',
      /* 14 */ '#fcc101',
      /* 15 */ '#fb6120',
      /* 16 */ '#fcc101',
      /* 17 */ '#fb053f'
    ],
    expert: [
      /* 0 */ '#fcc101',
      /* 1 */ '#fb6120',
      /* 2 */ '#fcc101',
      /* 3 */ '#fcc101',
      /* 4 */ '#fb053f',
      /* 5 */ '#fcc101',
      /* 6 */ '#fcc101',
      /* 7 */ '#fb6120',
      /* 8 */ '#fcc101',
      /* 9 */ '#fcc101',
      /* 10 */ '#fb6120',
      /* 11 */ '#fcc101',
      /* 12 */ '#fcc101',
      /* 13 */ '#fb053f',
      /* 14 */ '#fcc101',
      /* 15 */ '#fcc101',
      /* 16 */ '#fb6120',
      /* 17 */ '#fcc101'
    ]
  };

  const wedgeBinColors = $derived(WEDGE_BIN_COLORS[difficulty]);

  // Radial threshold rows per difficulty: { label, condition, color, isWedge }
  type ThresholdRow = { label: string; condition: string; color: string; isWedge?: boolean };

  function getThresholdRows(diff: DartsDifficulty, wedgeColor: string): ThresholdRow[] {
    if (diff === 'easy')
      return [
        { label: 'Green', condition: 'r ≤ 62.5', color: '#24e700' },
        { label: 'Dark Gray', condition: '62.5 < r ≤ 275', color: '#0e202c' },
        { label: 'Light Gray', condition: '275 < r ≤ 375', color: '#213843' },
        { label: 'Wedge', condition: '375 < r < 450', color: wedgeColor, isWedge: true },
        { label: 'Dark Gray', condition: 'r ≥ 450', color: '#0e202c' }
      ];
    if (diff === 'medium')
      return [
        { label: 'Green', condition: 'r ≤ 50', color: '#24e700' },
        { label: 'Dark Gray', condition: '50 < r ≤ 225', color: '#0e202c' },
        { label: 'Light Gray', condition: '225 < r ≤ 350', color: '#213843' },
        { label: 'Wedge', condition: '350 < r < 400', color: wedgeColor, isWedge: true },
        { label: 'Dark Gray', condition: 'r ≥ 400', color: '#0e202c' }
      ];
    if (diff === 'hard')
      return [
        { label: 'Green', condition: 'r ≤ 30', color: '#24e700' },
        { label: 'Dark Gray', condition: '30 < r ≤ 200', color: '#0e202c' },
        { label: 'Light Gray', condition: '200 < r ≤ 330', color: '#213843' },
        { label: 'Wedge', condition: '330 < r < 375', color: wedgeColor, isWedge: true },
        { label: 'Dark Gray', condition: 'r ≥ 375', color: '#0e202c' }
      ];
    // expert
    return [
      { label: 'Green', condition: 'r ≤ 10', color: '#24e700' },
      { label: 'Dark Gray', condition: '10 < r ≤ 250', color: '#0e202c' },
      { label: 'Light Gray', condition: '250 < r ≤ 355', color: '#213843' },
      { label: 'Wedge', condition: '355 < r < 375', color: wedgeColor, isWedge: true },
      { label: 'Dark Gray', condition: 'r ≥ 375', color: '#0e202c' }
    ];
  }

  const thresholdRows = $derived(getThresholdRows(difficulty, colorHex));

  // Find which row index actually matches by evaluating conditions against r
  const matchedRowIndex = $derived.by(() => {
    const rows = thresholdRows;
    const rv = r;
    if (difficulty === 'easy') {
      if (rv <= 62.5) return 0;
      if (rv <= 275) return 1;
      if (rv <= 375) return 2;
      if (rv < 450) return 3; // wedge
      return 4;
    }
    if (difficulty === 'medium') {
      if (rv <= 50) return 0;
      if (rv <= 225) return 1;
      if (rv <= 350) return 2;
      if (rv < 400) return 3; // wedge
      return 4;
    }
    if (difficulty === 'hard') {
      if (rv <= 30) return 0;
      if (rv <= 200) return 1;
      if (rv <= 330) return 2;
      if (rv < 375) return 3; // wedge
      return 4;
    }
    // expert
    if (rv <= 10) return 0;
    if (rv <= 250) return 1;
    if (rv <= 355) return 2;
    if (rv < 375) return 3; // wedge
    return 4;
  });
</script>

<div class="mt-7 text-center">
  <p class="mb-2 text-2xl font-semibold">Step {stepNumber}</p>
  <p class="mb-2 text-lg">Determine dart zone and multiplier</p>
  <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
    See <span class="font-bold">Darts</span> section on the
    <HighlightLink href="https://stake.com/provably-fair/game-events">game events</HighlightLink> page
  </p>

  <ContentBlock className="{contentBlockClassName} text-left font-mono text-sm">
    <!-- Normalise Distance -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
        Normalise Distance
      </p>
      <p class="leading-relaxed">normalisedDistance</p>
      <p class="leading-relaxed">
        = sqrt( <HighlightText>{distance.toFixed(12)}</HighlightText> ) / 2
      </p>
      <p class="leading-relaxed font-bold">
        = <span class="text-green-600 dark:text-green-400">{normalisedDistance.toFixed(12)}</span>
      </p>
    </div>

    <!-- Radial Distance -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
        Radial Distance (r)
      </p>
      <p class="leading-relaxed">r</p>
      <p class="leading-relaxed">= normalisedDistance × 1000</p>
      <p class="leading-relaxed">
        = <HighlightText>{normalisedDistance.toFixed(12)}</HighlightText> × 1000
      </p>
      <p class="leading-relaxed font-bold">
        = <span class="text-blue-600 dark:text-blue-400">{r.toFixed(6)}</span>
      </p>
    </div>

    <!-- Determine Zone -->
    <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
      <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
        Determine Zone
      </p>
      <p class="mb-3 font-sans text-xs text-gray-500 dark:text-gray-400">
        Checking r = <span class="font-bold text-blue-600 dark:text-blue-400">{r.toFixed(4)}</span>
        against radial thresholds for
        <span class="font-semibold text-gray-700 dark:text-gray-300">{difficulty}</span>:
      </p>
      <div class="flex flex-col gap-0.5 font-mono text-xs">
        {#each thresholdRows as row, i (i)}
          {@const isMatch = i === matchedRowIndex}
          {@const keyword = i === 0 ? 'if' : i === thresholdRows.length - 1 ? 'else' : 'else if'}
          <div
            class={[
              'flex items-center gap-2 rounded px-2 py-1',
              isMatch
                ? 'bg-green-50 ring-1 ring-green-400 dark:bg-green-900/20 dark:ring-green-500'
                : 'text-gray-500 dark:text-gray-400'
            ]}
          >
            <span class="w-10 flex-shrink-0 font-sans text-purple-600 dark:text-purple-400"
              >{keyword}</span
            >
            {#if i < thresholdRows.length - 1}
              <span class={isMatch ? 'text-gray-800 dark:text-gray-200' : ''}
                >( {row.condition} )</span
              >
            {:else}
              <span class="font-sans text-gray-400 italic dark:text-gray-500">// outside board</span
              >
            {/if}
            <span class="ml-auto flex flex-shrink-0 items-center gap-1.5">
              {#if row.isWedge}
                <span class="font-sans text-gray-400 italic dark:text-gray-500">wedge band</span>
                {#if isMatch}
                  <span class="font-sans font-bold text-green-600 dark:text-green-400"
                    >✓ see below</span
                  >
                {/if}
              {:else}
                <span
                  class="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-sm border border-gray-300"
                  style="background: {row.color}"
                ></span>
                <span class={isMatch ? 'font-bold text-gray-900 dark:text-white' : ''}>
                  {colorLabels[row.color] ?? row.color}
                </span>
                {#if isMatch}
                  <span class="font-sans font-bold text-green-600 dark:text-green-400">✓</span>
                {/if}
              {/if}
            </span>
          </div>
        {/each}
      </div>
    </div>

    {#if isWedgeZone}
      <!-- Wedge Angle -->
      <div class="mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
        <p class="mb-3 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">Wedge Angle</p>

        <!-- deg calculation -->
        <p class="mb-1 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Calculate angle (deg)
        </p>
        <p class="mb-1 font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Normalise rotation to a clockwise angle in degrees, where 0° = top of board:
        </p>
        <p class="leading-relaxed">deg = (((rotation % 1) + 1) % 1) × 360</p>
        <p class="leading-relaxed">
          = (((<HighlightText>{rotation.toFixed(12)}</HighlightText> % 1) + 1) % 1) × 360
        </p>
        <p class="mb-4 leading-relaxed font-bold">
          = <span class="text-blue-600 dark:text-blue-400">{deg.toFixed(6)}°</span>
        </p>

        <!-- bin calculation -->
        <p class="mb-1 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Calculate bin
        </p>
        <p class="mb-1 font-sans text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          The circle is divided into 18 equal slices of 20° each (bins 0–17):
        </p>
        <p class="leading-relaxed">bin = floor( deg / 20 )</p>
        <p class="leading-relaxed">
          = floor( <HighlightText>{deg.toFixed(6)}</HighlightText> / 20 )
        </p>
        <p class="mb-4 leading-relaxed font-bold">
          = <span class="text-blue-600 dark:text-blue-400">{wedgeBin}</span>
        </p>

        <!-- Bin grid -->
        <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">
          Bin colour map ({difficulty})
        </p>
        <p class="mb-2 font-sans text-xs text-gray-500 dark:text-gray-400">
          Each bin covers a 20° slice. Bin <span class="font-bold text-blue-600 dark:text-blue-400"
            >{wedgeBin}</span
          >
          spans <span class="font-bold">{wedgeBin * 20}°–{wedgeBin * 20 + 20}°</span>:
        </p>
        <div class="mb-3 grid grid-cols-9 gap-1">
          {#each wedgeBinColors as binColor, i (i)}
            {@const isCurrentBin = i === wedgeBin}
            <div
              class={[
                'flex flex-col items-center rounded border-2 px-0.5 py-1 transition-all',
                isCurrentBin
                  ? 'border-blue-500 ring-2 ring-blue-400 dark:border-blue-400 dark:ring-blue-500'
                  : 'border-gray-200 ring-2 ring-transparent dark:border-gray-700'
              ]}
            >
              <span class="mb-0.5 text-[10px] leading-none font-normal opacity-70">{i}</span>
              <span
                class="inline-block h-3 w-3 flex-shrink-0 rounded-sm border border-gray-300"
                style="background: {binColor}"
              ></span>
            </div>
          {/each}
        </div>

        <!-- Result -->
        <p class="leading-relaxed">
          bin <HighlightText>{wedgeBin}</HighlightText>
          ({wedgeBin * 20}°–{wedgeBin * 20 + 20}°) →
          <span class="inline-flex items-center gap-1.5">
            <span
              class="inline-block h-3 w-3 flex-shrink-0 rounded-sm border border-gray-300"
              style="background: {colorHex}"
            ></span>
            <span class="font-bold" style="color: {colorHex}">{colorLabel}</span>
          </span>
        </p>
      </div>
    {/if}

    <!-- Result -->
    <div>
      <p class="mb-2 font-sans text-xs text-gray-500 uppercase dark:text-gray-400">Result</p>
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <span
            class="inline-block h-4 w-4 flex-shrink-0 rounded-sm border border-gray-300"
            style="background: {colorHex}"
          ></span>
          <span class="font-bold text-gray-700 dark:text-gray-300">{colorLabel}</span>
        </div>
        <span class="text-gray-400">→</span>
        <span
          class="inline-flex items-center justify-center rounded border-2 border-green-500 bg-green-50 px-3 py-1.5 font-bold text-green-700 ring-2 ring-green-400 dark:border-green-400 dark:bg-green-900/20 dark:text-green-400"
        >
          {multi}x
        </span>
      </div>
    </div>
  </ContentBlock>
</div>
