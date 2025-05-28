<script lang="ts">
  import type { ScarabSpinsTomeOfLifeIcon } from '$lib/types';

  import one from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/one.svg';
  import two from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/two.svg';
  import three from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/three.svg';
  import four from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/four.svg';
  import five from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/five.svg';
  import nine from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/nine.svg';
  import ten from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/ten.svg';
  import jack from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/jack.svg';
  import queen from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/queen.svg';
  import king from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/king.svg';
  import ace from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/ace.svg';
  import wild from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/wild.svg';
  import scatter from '$lib/assets/scarabspins-tomeoflife/tomeoflife-icons/scatter.svg';

  const iconMap: Record<ScarabSpinsTomeOfLifeIcon, string> = {
    one,
    two,
    three,
    four,
    five,
    nine,
    ten,
    jack,
    queen,
    king,
    ace,
    wild,
    scatter
  };

  const { icon }: { icon: ScarabSpinsTomeOfLifeIcon } = $props();
</script>

<img class={['relative scale-100 object-fill']} src={iconMap[icon]} alt={icon} />
