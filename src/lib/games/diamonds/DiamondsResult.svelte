<script lang="ts">
  import { FloatGenerator } from '$lib/generator/FloatGenerator';
  import { debouncer } from '$lib/debounce.svelte';
  import { Gem, type Seed } from '$lib/types';
  import Loader from '$lib/games/Loader.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();

  const gems = Object.values(Gem);
  const gemToBgColor: Record<Gem, string> = {
    green: 'bg-green-300 dark:bg-green-700',
    blue: 'bg-blue-300 dark:bg-blue-700',
    purple: 'bg-purple-300 dark:bg-purple-700',
    cyan: 'bg-cyan-300 dark:bg-cyan-700',
    pink: 'bg-pink-300 dark:bg-pink-500',
    yellow: 'bg-yellow-300 dark:bg-yellow-600',
    red: 'bg-red-300 dark:bg-red-700'
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
      <div class={['flex h-10 w-full items-center justify-center', gemToBgColor[gem]]}>
        {gem.toUpperCase()}
      </div>
    {/each}
  </div>
{/if}
