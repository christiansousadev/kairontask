const fs = require('fs');

const commitMsgFile = process.argv[2];
if (!commitMsgFile || !fs.existsSync(commitMsgFile)) {
  process.exit(0);
}

const content = fs.readFileSync(commitMsgFile, 'utf8');

// Strip any Co-authored-by lines (including Claude, AI bots, or external emails)
const cleaned = content
  .split('\n')
  .filter((line) => !line.trim().toLowerCase().startsWith('co-authored-by:'))
  .join('\n');

if (cleaned !== content) {
  fs.writeFileSync(commitMsgFile, cleaned, 'utf8');
}
