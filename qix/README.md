Qix
===

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\4967-Notes.json qix/4967-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\4967-Rich.txt qix/4967-Rich.txt
```
* Run tests:
```bash
npx vitest run qix
```
* Lint:
```bash
npx eslint qix/qix.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save qix/qix.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init qix
node ../cruncheevos-playtest/bin/cli.js sync qix
node ../cruncheevos-playtest/bin/cli.js viewer qix
```