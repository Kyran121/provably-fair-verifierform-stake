<script lang="ts">
  import { DICE_ROLL_ICON } from '$lib/util/snakes';

  const { roll }: { roll: number } = $props();
</script>

<img class="relative scale-80 object-scale-down" src={DICE_ROLL_ICON[roll]} alt="roll{roll}" />
