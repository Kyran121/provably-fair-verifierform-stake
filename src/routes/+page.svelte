<script lang="ts">
  import { VerifierForm, type GameDefinition } from 'provably-fair-verifierform-lib';
  import { gameDefinition as baccaratGameDefinition } from '$lib/games/cards/baccarat';
  import { gameDefinition as barsGameDefinition } from '$lib/games/bars';
  import { gameDefinition as blackjackGameDefinition } from '$lib/games/cards/blackjack';
  import { gameDefinition as blueSamuraiGameDefinition } from '$lib/games/bluesamurai';
  import { gameDefinition as casesGameDefinition } from '$lib/games/cases';
  import { gameDefinition as chickenGameDefinition } from '$lib/games/chicken';
  import { gameDefinition as crashGameDefinition } from '$lib/games/multiplayer/crash';
  import { gameDefinition as dartsGameDefinition } from '$lib/games/darts';
  import { gameDefinition as diamondsGameDefinition } from '$lib/games/diamonds';
  import { gameDefinition as diceGameDefinition } from '$lib/games/dice';
  import { gameDefinition as dragonTowerGameDefinition } from '$lib/games/dragontower';
  import { gameDefinition as drillGameDefinition } from '$lib/games/drill';
  import { gameDefinition as flipGameDefinition } from '$lib/games/flip';
  import { gameDefinition as hiloGameDefinition } from '$lib/games/cards/hilo';
  import { gameDefinition as kenoGameDefinition } from '$lib/games/keno';
  import { gameDefinition as limboGameDefinition } from '$lib/games/limbo';
  import { gameDefinition as minesGameDefinition } from '$lib/games/mines';
  import { gameDefinition as molesGameDefinition } from '$lib/games/moles';
  import { gameDefinition as packsGameDefinition } from '$lib/games/packs';
  import { gameDefinition as plinkoGameDefinition } from '$lib/games/plinko';
  import { gameDefinition as primediceGameDefinition } from '$lib/games/primedice';
  import { gameDefinition as pumpGameDefinition } from '$lib/games/pump';
  import { gameDefinition as rockPaperScissorsGameDefinition } from '$lib/games/rockpaperscissors';
  import { gameDefinition as rouletteGameDefinition } from '$lib/games/roulette';
  import { gameDefinition as scarabSpinsGameDefinition } from '$lib/games/scarabspins-tomeoflife/scarabspins';
  import { gameDefinition as slideGameDefinition } from '$lib/games/multiplayer/slide';
  import { gameDefinition as snakesGameDefinition } from '$lib/games/snakes';
  import { gameDefinition as tarotGameDefinition } from '$lib/games/tarot';
  import { gameDefinition as tomeOfLifeGameDefinition } from '$lib/games/scarabspins-tomeoflife/tomeoflife';
  import { gameDefinition as videoPokerGameDefinition } from '$lib/games/cards/videopoker';
  import { gameDefinition as wheelGameDefinition } from '$lib/games/wheel';

  const games: Record<string, GameDefinition> = {
    baccarat: baccaratGameDefinition,
    bars: barsGameDefinition,
    blackjack: blackjackGameDefinition,
    bluesamurai: blueSamuraiGameDefinition,
    cases: casesGameDefinition,
    chicken: chickenGameDefinition,
    crash: crashGameDefinition,
    darts: dartsGameDefinition,
    diamonds: diamondsGameDefinition,
    dice: diceGameDefinition,
    dragontower: dragonTowerGameDefinition,
    drill: drillGameDefinition,
    flip: flipGameDefinition,
    hilo: hiloGameDefinition,
    keno: kenoGameDefinition,
    limbo: limboGameDefinition,
    mines: minesGameDefinition,
    moles: molesGameDefinition,
    packs: packsGameDefinition,
    plinko: plinkoGameDefinition,
    primedice: primediceGameDefinition,
    pump: pumpGameDefinition,
    rockpaperscissors: rockPaperScissorsGameDefinition,
    roulette: rouletteGameDefinition,
    scarabspins: scarabSpinsGameDefinition,
    slide: slideGameDefinition,
    snakes: snakesGameDefinition,
    tarot: tarotGameDefinition,
    tomeoflife: tomeOfLifeGameDefinition,
    videopoker: videoPokerGameDefinition,
    wheel: wheelGameDefinition
  };
</script>

<VerifierForm {games} />
