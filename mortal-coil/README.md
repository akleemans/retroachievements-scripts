Koneko Monogatari
=================

Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\45174-Notes.json mortal-coil/45174-Notes.json
```
Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\45174-Rich.txt mortal-coil/45174-Rich.txt
```
Run tests:
```bash
npx vitest run mortal-coil
```
Lint:
```bash
npx eslint mortal-coil/mortal-coil.js --fix
```
Format:
```bash
node scripts/align-conditions.js
```
Save to local:
```bash
npx cruncheevos save mortal-coil/mortal-coil.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init mortal-coil
node ../cruncheevos-playtest/bin/cli.js sync mortal-coil
node ../cruncheevos-playtest/bin/cli.js viewer mortal-coil
```