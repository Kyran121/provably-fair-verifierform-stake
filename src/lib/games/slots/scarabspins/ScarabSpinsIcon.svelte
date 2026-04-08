<script lang="ts">
  import type { ScarabSpinsTomeOfLifeIcon } from '$lib/types';

  import one from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/one.svg';
  import two from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/two.svg';
  import three from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/three.svg';
  import four from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/four.svg';
  import five from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/five.svg';
  import nine from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/nine.svg';
  import ten from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/ten.svg';
  import jack from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/jack.svg';
  import queen from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/queen.svg';
  import king from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/king.svg';
  import ace from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/ace.svg';
  import wild from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/wild.svg';
  import scatter from '$lib/assets/scarabspins-tomeoflife/scarabspins-icons/scatter.svg';

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
