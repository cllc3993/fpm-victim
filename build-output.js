const fs = require('fs'), path = require('path');
const dir = '.vercel/output/functions/api/leak.func';
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync('.vercel/output/config.json', JSON.stringify({ version: 3 }));
fs.writeFileSync(path.join(dir, 'index.js'), "module.exports=(req,res)=>res.end('benign');\n");
fs.writeFileSync(path.join(dir, '.vc-config.json'), JSON.stringify({ runtime: 'nodejs24.x', handler: 'index.js', launcherType: 'Nodejs', shouldAddHelpers: true }));
console.log('benign build');
