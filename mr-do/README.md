Mr. Do
======

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\4746-Notes.json mr-do/4746-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\4746-Rich.txt mr-do/4746-Rich.txt
```
* Sync:
```bash
node ../cruncheevos-playtest/bin/cli.js sync mr-do
```
* Run tests:
```bash
npx vitest run mr-do
```
* Run viewer:
```bash
node ../cruncheevos-playtest/bin/cli.js viewer mr-do
```
* Lint:
```bash
npx eslint mr-do/mr-do.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save mr-do/mr-do.js
```
