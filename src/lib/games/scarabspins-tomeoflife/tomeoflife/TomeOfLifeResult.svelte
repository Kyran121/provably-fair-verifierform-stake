<script lang="ts">
  import SlotResult from '$lib/games/scarabspins-tomeoflife/SlotResult.svelte';
  import IconComponent from '$lib/games/scarabspins-tomeoflife/tomeoflife/TomeOfLifeIcon.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();
</script>

<SlotResult {formValues} {IconComponent} />
