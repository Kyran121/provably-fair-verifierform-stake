<script lang="ts">
  import { VerifierForm, type GameDefinition } from 'provably-fair-verifierform-lib';
  import { gameDefinition as baccaratGameDefinition } from '$lib/games/cards/baccarat';
  import { gameDefinition as barsGameDefinition } from '$lib/games/bars';
  import { gameDefinition as blackjackGameDefinition } from '$lib/games/cards/blackjack';
  import { gameDefinition as blueSamuraiGameDefinition } from '$lib/games/bluesamurai';
  import { gameDefinition as casesGameDefinition } from '$lib/games/cases';
  import { gameDefinition as crashGameDefinition } from '$lib/games/multiplayer/crash';
  import { gameDefinition as dartsGameDefinition } from '$lib/games/darts';
  import { gameDefinition as diamondsGameDefinition } from '$lib/games/diamonds';
  import { gameDefinition as diceGameDefinition } from '$lib/games/dice';
  import { gameDefinition as dragonTowerGameDefinition } from '$lib/games/dragontower';
  import { gameDefinition as flipGameDefinition } from '$lib/games/flip';
  import { gameDefinition as hiloGameDefinition } from '$lib/games/cards/hilo';
  import { gameDefinition as kenoGameDefinition } from '$lib/games/keno';
  import { gameDefinition as limboGameDefinition } from '$lib/games/limbo';
  import { gameDefinition as minesGameDefinition } from '$lib/games/mines';
  import { gameDefinition as plinkoGameDefinition } from '$lib/games/plinko';
  import { gameDefinition as pumpGameDefinition } from '$lib/games/pump';
  import { gameDefinition as rockPaperScissorsGameDefinition } from '$lib/games/rockpaperscissors';
  import { gameDefinition as rouletteGameDefinition } from '$lib/games/roulette';
  import { gameDefinition as scarabSpinsGameDefinition } from '$lib/games/scarabspins-tomeoflife/scarabspins';
  import { gameDefinition as slideGameDefinition } from '$lib/games/multiplayer/slide';
  import { gameDefinition as snakesGameDefinition } from '$lib/games/snakes';
  import { gameDefinition as tomeOfLifeGameDefinition } from '$lib/games/scarabspins-tomeoflife/tomeoflife';
  import { gameDefinition as videoPokerGameDefinition } from '$lib/games/cards/videopoker';
  import { gameDefinition as wheelGameDefinition } from '$lib/games/wheel';

  const games: Record<string, GameDefinition> = {
    baccarat: baccaratGameDefinition,
    bars: barsGameDefinition,
    blackjack: blackjackGameDefinition,
    bluesamurai: blueSamuraiGameDefinition,
    cases: casesGameDefinition,
    crash: crashGameDefinition,
    darts: dartsGameDefinition,
    diamonds: diamondsGameDefinition,
    dice: diceGameDefinition,
    dragontower: dragonTowerGameDefinition,
    flip: flipGameDefinition,
    hilo: hiloGameDefinition,
    keno: kenoGameDefinition,
    limbo: limboGameDefinition,
    mines: minesGameDefinition,
    plinko: plinkoGameDefinition,
    pump: pumpGameDefinition,
    rockpaperscissors: rockPaperScissorsGameDefinition,
    roulette: rouletteGameDefinition,
    scarabsspins: scarabSpinsGameDefinition,
    slide: slideGameDefinition,
    snakes: snakesGameDefinition,
    tomeoflife: tomeOfLifeGameDefinition,
    videopoker: videoPokerGameDefinition,
    wheel: wheelGameDefinition
  };
</script>

<VerifierForm {games} />
