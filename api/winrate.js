const axios = require('axios');

module.exports = async (req, res) => {
  const { summonerName, region } = req.query;
  const RIOT_API_KEY = process.env.RIOT_API_KEY;

  try {
    const summonerRes = await axios.get(
      `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodeURIComponent(summonerName)}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    const puuid = summonerRes.data.puuid;

    const matchIdsRes = await axios.get(
      `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=20`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    const matchIds = matchIdsRes.data;

    let wins = 0;
    for (const matchId of matchIds) {
      const matchRes = await axios.get(
        `https://europe.api.riotgames.com/tft/match/v1/matches/${matchId}`,
        { headers: { "X-Riot-Token": RIOT_API_KEY } }
      );
      const player = matchRes.data.info.participants.find(p => p.puuid === puuid);
      if (player.placement === 1) wins++;
    }

    const winrate = ((wins / matchIds.length) * 100).toFixed(1);
    res.status(200).json({ winrate: `${winrate}%` });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Noe gikk galt i serveren.' });
  }
};
