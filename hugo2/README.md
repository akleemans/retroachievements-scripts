Hugo 2
======

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\22119-Notes.json hugo2/22119-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\22119-Rich.txt hugo2/22119-Rich.txt
```
* Run tests:
```bash
npx vitest run hugo2
```
* Lint:
```bash
npx eslint hugo2/hugo2.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save hugo2/hugo2.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init hugo2
node ../cruncheevos-playtest/bin/cli.js sync hugo2
node ../cruncheevos-playtest/bin/cli.js viewer hugo2
```