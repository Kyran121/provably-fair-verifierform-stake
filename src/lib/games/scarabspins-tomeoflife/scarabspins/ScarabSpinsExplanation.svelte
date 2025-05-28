<script lang="ts">
  import IconComponent from '$lib/games/scarabspins-tomeoflife/scarabspins/ScarabSpinsIcon.svelte';
  import SlotExplanation from '$lib/games/scarabspins-tomeoflife/SlotExplanation.svelte';

  const { formValues }: { formValues: Record<string, unknown> } = $props();
</script>

<SlotExplanation {formValues} {IconComponent} />
