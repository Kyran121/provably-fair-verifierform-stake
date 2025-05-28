<script lang="ts">
  import { CardSuit } from '$lib/types';
  import clubIcon from '$lib/assets/cards/icons/club-50x50.png';
  import spadeIcon from '$lib/assets/cards/icons/spade-50x50.png';
  import heartIcon from '$lib/assets/cards/icons/heart-50x50.png';
  import diamondIcon from '$lib/assets/cards/icons/diamond-50x50.png';
  import grayClubIcon from '$lib/assets/cards/icons/club-50x50-gray.png';
  import graySpadeIcon from '$lib/assets/cards/icons/spade-50x50-gray.png';
  import grayHeartIcon from '$lib/assets/cards/icons/heart-50x50-gray.png';
  import grayDiamondIcon from '$lib/assets/cards/icons/diamond-50x50-gray.png';

  const { suit, small, dark }: { suit: CardSuit; small?: boolean; dark?: boolean } = $props();

  const suitToIcon: Record<CardSuit, string> = {
    club: dark ? grayClubIcon : clubIcon,
    spade: dark ? graySpadeIcon : spadeIcon,
    diamond: dark ? grayDiamondIcon : diamondIcon,
    heart: dark ? grayHeartIcon : heartIcon
  };
</script>

<img
  class={[small ? 'inline w-5' : 'relative scale-70 object-scale-down']}
  src={suitToIcon[suit]}
  alt={suit}
/>
