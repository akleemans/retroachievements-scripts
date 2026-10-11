Koneko Monogatari
=================

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\6821-Notes.json koneko/6821-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\6821-Rich.txt koneko/6821-Rich.txt
```
* Sync:
```bash
node ../cruncheevos-playtest/bin/cli.js sync koneko
```
* Run tests:
```bash
npx vitest run koneko
```
* Run viewer:
```bash
node ../cruncheevos-playtest/bin/cli.js viewerkoneko
```
* Lint:
```bash
npx eslint koneko/koneko.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save koneko/koneko.js
```
