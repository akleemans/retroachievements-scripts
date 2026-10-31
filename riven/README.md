Riven
=====

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\5304-Notes.json riven/5304-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\5304-Rich.txt riven/5304-Rich.txt
```
* Run tests:
```bash
npx vitest run riven
```
* Lint:
```bash
npx eslint riven/riven.js --fix
npx eslint riven/riven.test.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save riven/riven.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init riven
node ../cruncheevos-playtest/bin/cli.js sync riven
node ../cruncheevos-playtest/bin/cli.js viewer riven
```