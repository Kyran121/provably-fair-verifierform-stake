import http from 'http';
import { parse } from 'url';
import { read, readFileSync } from 'fs';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const { pathname, query } = parse(req.url, true);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': 86400
    });
    return res.end();
  }

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

  if (pathname === '/bet' && req.method === 'GET') {
    let betId = query.id;
    if (!betId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing id query parameter' }));
      return;
    }

    //remove prefixes
    betId = betId.replace(/^casino:/, '');
    betId = betId.replace(/^house:/, '');

    const userAgent = '';
    const cloudflareClearanceCookie = '';

    try {
      const query = readFileSync('./lookup.gql').toString();
      const response = await fetch('https://stake.com/_api/graphql', {
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Content-Type': 'application/json',
          Cookie: 'cf_clearance=' + cloudflareClearanceCookie
        },
        body: JSON.stringify({
          operationName: 'BetLookup',
          query,
          variables: { iid: `house:${betId}` }
        })
      });

      const json = await response.json();

      let error = '';

      if (json?.data?.bet === null) {
        error = 'Bet ID is not valid';
      } else if (json?.data?.bet?.bet?.serverSeed?.seed === null) {
        error = 'Server seed not revealed';
      }

      if (error.length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error }));
        return;
      }

      const bet = json?.data?.bet?.bet;

      let game = bet?.game.toLowerCase();
      if (game === 'slots') {
        game = 'scarabspins';
      } else if (game === 'slotsSamurai') {
        game = 'bluesamurai';
      }

      let state = {};
      if (game === 'crash') {
        const seed = bet?.crashGame?.seed?.seed;
        const hash = bet?.crashGame?.hash?.seed;

        state = { game, seed, hash };
      } else if (game === 'slide') {
        const seed = bet?.slideGame?.seed?.seed;
        const hash = bet?.slideGame?.hash?.seed;

        state = { game, seed, hash };
      } else {
        const clientseed = bet?.clientSeed?.seed;
        const serverseed = bet?.serverSeed?.seed;
        const nonce = bet?.nonce;

        state = { game, clientseed, serverseed, nonce };
      }

      if (game === 'cases') {
        state.difficulty = bet?.state?.casesDifficulty;
      } else if (game === 'pump') {
        state.difficulty = bet?.state?.pumpDifficulty;
      } else if (game === 'mines') {
        state.mines = bet?.state?.minesCount;
      } else if (game === 'dragontower') {
        state.difficulty = bet?.state?.dragonTowerDifficulty;
      } else if (game === 'darts') {
        state.difficulty = bet?.state?.dartsDifficulty;
      } else if (game === 'bars') {
        state.difficulty = bet?.state?.barsDifficulty;
        state.barcount = bet?.state?.barsTiles?.length;
      } else if (game === 'plinko') {
        state.risk = bet?.state.plinkoRisk;
        state.rows = bet?.state.plinkoRows;
      } else if (game === 'snakes') {
        state.difficulty = bet?.state.snakesDifficulty;
      } else if (game === 'wheel') {
        state.risk = bet?.state.wheelRisk;
        state.segments = bet?.state.wheelSegments;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(state));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
