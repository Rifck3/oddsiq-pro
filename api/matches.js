// api/matches.js — Proxy football-data.org
export default async function handler(req, res) {
  // Allow CORS from anywhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { date } = req.query;
  if (!date) { res.status(400).json({ error: 'date requis (YYYY-MM-DD)' }); return; }

  const KEY = process.env.FOOTBALL_DATA_KEY;
  if (!KEY) { res.status(500).json({ error: 'Clé API manquante sur le serveur' }); return; }

  const COMPS = 'CL,EL,PL,PD,SA,BL1,FL1,PPL,DED,BSA,MLS';
  const url = `https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}&competitions=${COMPS}`;

  try {
    const r = await fetch(url, { headers: { 'X-Auth-Token': KEY } });
    if (!r.ok) {
      const txt = await r.text();
      res.status(r.status).json({ error: `football-data.org: ${r.status}`, detail: txt });
      return;
    }
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
