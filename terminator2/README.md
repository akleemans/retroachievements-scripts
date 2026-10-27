Terminator 2: Judgment Day
==========================

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\2574-Notes.json terminator2/2574-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\2574-Rich.txt terminator2/2574-Rich.txt
```
* Run tests:
```bash
npx vitest run terminator2
```
* Lint:
```bash
npx eslint terminator2/terminator2.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save terminator2/terminator2.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init terminator2
node ../cruncheevos-playtest/bin/cli.js sync terminator2
node ../cruncheevos-playtest/bin/cli.js viewer terminator2
```