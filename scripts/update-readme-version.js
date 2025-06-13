const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const readmePath = path.join(__dirname, '..', 'README.md');
const today = new Date().toISOString().slice(0, 10);

let readme = fs.readFileSync(readmePath, 'utf8');
const versionLineRegex = /^# v[\d.]+ Published on npm as `music-chords-diagrams` on date `\d{4}-\d{2}-\d{2}`/m;
const newVersionLine = `# v${pkg.version} Published on npm as \`music-chords-diagrams\` on date \`${today}\``;

if (versionLineRegex.test(readme)) {
  readme = readme.replace(versionLineRegex, newVersionLine);
} else {
  readme = newVersionLine + '\n\n' + readme;
}

fs.writeFileSync(readmePath, readme, 'utf8');
console.log('README updated with version', pkg.version);
