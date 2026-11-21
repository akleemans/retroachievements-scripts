Spider-Man 3: Invasion of the Spider-Slayers
============================================

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\2570-Notes.json spiderman3/2570-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\2570-Rich.txt spiderman3/2570-Rich.txt
```
* Run tests:
```bash
npx vitest run spiderman3
```
* Lint:
```bash
npx eslint spiderman3/spiderman3.js --fix
npx eslint spiderman3/spiderman3.test.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save spiderman3/spiderman3.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init spiderman3
node ../cruncheevos-playtest/bin/cli.js sync spiderman3
node ../cruncheevos-playtest/bin/cli.js viewer spiderman3
```