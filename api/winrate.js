const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { summonerName, region } = req.query;
    const key = process.env.RIOT_API_KEY;

    const response = await axios.get(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodeURIComponent(summonerName)}`, {
      headers: { "X-Riot-Token": key }
    });

    console.log("RIOT RESPONSE:", response.data);
    res.status(200).json({ success: true, summoner: response.data });

  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error("RIOT API FEIL:", msg);
    res.status(500).json({ error: msg });
  }
};
