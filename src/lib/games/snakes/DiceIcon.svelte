<script lang="ts">
  import rollOneIcon from '$lib/assets/snakes/icons/dice-one-50x50-white.png';
  import rollTwoIcon from '$lib/assets/snakes/icons/dice-two-50x50-white.png';
  import rollThreeIcon from '$lib/assets/snakes/icons/dice-three-50x50-white.png';
  import rollFourIcon from '$lib/assets/snakes/icons/dice-four-50x50-white.png';
  import rollFiveIcon from '$lib/assets/snakes/icons/dice-five-50x50-white.png';
  import rollSixIcon from '$lib/assets/snakes/icons/dice-six-50x50-white.png';

  const { roll }: { roll: number } = $props();

  const rollToIcon: Record<number, string> = {
    1: rollOneIcon,
    2: rollTwoIcon,
    3: rollThreeIcon,
    4: rollFourIcon,
    5: rollFiveIcon,
    6: rollSixIcon
  };
</script>

<img class="relative scale-80 object-scale-down" src={rollToIcon[roll]} alt="roll{roll}" />
