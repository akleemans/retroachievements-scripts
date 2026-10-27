Bubble Ghost
============

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\6127-Notes.json bubble-ghost/6127-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\6127-Rich.txt bubble-ghost/6127-Rich.txt
```
* Run tests:
```bash
npx vitest run bubble-ghost
```
* Lint:
```bash
npx eslint bubble-ghost/bubble-ghost.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save bubble-ghost/bubble-ghost.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init bubble-ghost
node ../cruncheevos-playtest/bin/cli.js sync bubble-ghost
node ../cruncheevos-playtest/bin/cli.js viewer bubble-ghost
```