// api/odds.js — Proxy The Odds API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { sport, bookmaker } = req.query;
  if (!sport) { res.status(400).json({ error: 'sport requis' }); return; }

  const KEY = process.env.ODDS_API_KEY;
  if (!KEY) { res.status(500).json({ error: 'Clé API manquante sur le serveur' }); return; }

  const bk = bookmaker || '1xbet';
  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${KEY}&regions=eu&markets=h2h,totals&bookmakers=${bk}&oddsFormat=decimal`;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      res.status(r.status).json({ error: `odds-api: ${r.status}`, detail: txt });
      return;
    }
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
