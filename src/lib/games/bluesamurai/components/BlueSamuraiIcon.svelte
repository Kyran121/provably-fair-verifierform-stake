<script lang="ts">
  import type { BlueSamuraiIcon } from '$lib/types';

  import s1 from '$lib/assets/bluesamurai/icons/s1.png';
  import s2 from '$lib/assets/bluesamurai/icons/s2.png';
  import s3 from '$lib/assets/bluesamurai/icons/s3.png';
  import s4 from '$lib/assets/bluesamurai/icons/s4.png';
  import s5 from '$lib/assets/bluesamurai/icons/s5.png';
  import s6 from '$lib/assets/bluesamurai/icons/s6.png';
  import s7 from '$lib/assets/bluesamurai/icons/s7.png';
  import s8 from '$lib/assets/bluesamurai/icons/s8.png';
  import s9 from '$lib/assets/bluesamurai/icons/s9.png';
  import scatter from '$lib/assets/bluesamurai/icons/scatter.png';
  import wild from '$lib/assets/bluesamurai/icons/wild.png';
  import samurai from '$lib/assets/bluesamurai/icons/samurai.png';

  const iconMap: Record<BlueSamuraiIcon, string> = {
    s1,
    s2,
    s3,
    s4,
    s5,
    s6,
    s7,
    s8,
    s9,
    scatter,
    wild,
    samurai
  };

  const { icon }: { icon: BlueSamuraiIcon } = $props();
</script>

<img class={['relative scale-100 object-fill']} src={iconMap[icon]} alt={icon} />
