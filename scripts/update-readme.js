const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pkg = require('../package.json');
const readmePath = path.join(__dirname, '..', 'README.md');
const today = new Date().toISOString().slice(0, 10);

let readme = fs.readFileSync(readmePath, 'utf8');

// Remove any existing '## Update' section
readme = readme.replace(/## Update[\s\S]*?(?=(^#|^##|\n#|\n##|$))/m, '');

// Get last 5 commits on main branch
let commits = '';
try {
  commits = execSync('git log main -n 5 --pretty=format:"- %s (%ad)" --date=short', {encoding: 'utf8'});
} catch (e) {
  commits = 'Impossibile recuperare la lista delle modifiche.';
}

// Compose the new update section
const updateSection = `## Update\n\n- Ultima versione pubblicata (**${pkg.version}**, package.json)\n- Data dell’ultimo aggiornamento: **${today}**\n\n**Modifiche effettuate (ultimi 5 commit su main):**\n${commits}\n\n`;

// Insert the update section after the badges (after the last badge line)
const badgeEndIdx = readme.search(/\[!\[npm downloads\]/);
let insertIdx = badgeEndIdx;
if (insertIdx === -1) {
  // fallback: after first heading
  insertIdx = readme.indexOf('\n') + 1;
}
const before = readme.slice(0, insertIdx);
const after = readme.slice(insertIdx);
const newReadme = before + updateSection + after;

fs.writeFileSync(readmePath, newReadme, 'utf8');
console.log('README updated with version', pkg.version);
