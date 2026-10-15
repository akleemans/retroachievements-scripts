Last Action Hero
=================

Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\2459-Notes.json last-action-hero/2459-Notes.json
```
Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\2459-Rich.txt last-action-hero/2459-Rich.txt
```
Run tests:
```bash
npx vitest run last-action-hero
```
Lint:
```bash
npx eslint last-action-hero/last-action-hero.js --fix
```
Format:
```bash
node scripts/align-conditions.js
```
Save to local:
```bash
npx cruncheevos save last-action-hero/last-action-hero.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init last-action-hero
node ../cruncheevos-playtest/bin/cli.js sync last-action-hero
node ../cruncheevos-playtest/bin/cli.js viewer last-action-hero
```