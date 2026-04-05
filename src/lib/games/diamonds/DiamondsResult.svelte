<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import { Gem, type Seed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const gems = Object.values(Gem);
  const gemToColors: Record<Gem, { bg: string; border: string; text: string }> = {
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-500 dark:border-green-400',
      text: 'text-green-700 dark:text-green-400'
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-500 dark:border-blue-400',
      text: 'text-blue-700 dark:text-blue-400'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-500 dark:border-purple-400',
      text: 'text-purple-700 dark:text-purple-400'
    },
    cyan: {
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      border: 'border-cyan-500 dark:border-cyan-400',
      text: 'text-cyan-700 dark:text-cyan-400'
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      border: 'border-pink-500 dark:border-pink-400',
      text: 'text-pink-700 dark:text-pink-400'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      border: 'border-yellow-500 dark:border-yellow-400',
      text: 'text-yellow-700 dark:text-yellow-400'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-500 dark:border-red-400',
      text: 'text-red-700 dark:text-red-400'
    }
  };

  const seed = $derived<Seed>({
    clientSeed: formValues.clientseed as string,
    serverSeed: formValues.serverseed as string,
    nonce: formValues.nonce as number
  });

  const chosenGemsDebounced = $derived.by(
    debouncer(
      () => seed,
      (seed) => {
        const floatGenerator = FloatGenerator(seed);
        const chosenGems: Gem[] = [];
        for (let i = 0; i < 5; i++) {
          chosenGems.push(gems[Math.floor(floatGenerator.next().value * gems.length)]);
        }
        return chosenGems;
      },
      350
    )
  );
</script>

{#if chosenGemsDebounced.debouncing}
  <Loader />
{:else}
  <p data-testid="diamonds-result" class="hidden text-center text-base">
    {chosenGemsDebounced.value!}
  </p>
  <div class="mb-6 grid grid-cols-5 gap-1 md:gap-1.5">
    {#each chosenGemsDebounced.value! as gem, n (n)}
      <div
        class={[
          'flex h-10 w-full items-center justify-center rounded border-2 font-semibold capitalize',
          gemToColors[gem].bg,
          gemToColors[gem].border,
          gemToColors[gem].text
        ]}
      >
        {gem}
      </div>
    {/each}
  </div>
{/if}
