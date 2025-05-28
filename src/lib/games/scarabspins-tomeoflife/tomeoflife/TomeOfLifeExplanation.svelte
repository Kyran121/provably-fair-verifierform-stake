<script lang="ts">
  import IconComponent from '$lib/games/scarabspins-tomeoflife/tomeoflife/TomeOfLifeIcon.svelte';
  import SlotExplanation from '$lib/games/scarabspins-tomeoflife/SlotExplanation.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();
</script>

<SlotExplanation {formValues} {IconComponent} />
