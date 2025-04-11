const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { summonerName, region } = req.query;
    const key = process.env.RIOT_API_KEY;

    console.log("👉 INPUT:", summonerName, region);
    console.log("👉 Nøkkel:", key ? "Eksisterer ✅" : "Mangler ❌");

    const url = `https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodeURIComponent(summonerName)}`;
    console.log("🔗 URL:", url);

    const response = await axios.get(url, {
      headers: { "X-Riot-Token": key }
    });

    console.log("✅ Riot response:", response.data);

    res.status(200).json({ summoner: response.data });

  } catch (error) {
    const msg = error.response?.data || error.message || "Ukjent feil";
    console.error("❌ FEIL I KALL:", msg);
    res.status(500).json({ error: msg });
  }
};
