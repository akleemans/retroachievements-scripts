RoboCop 2
=========

* Copy Code notes (format afterward):
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\3669-Notes.json robocop2/3669-Notes.json
```
* Copy Rich Presence:
```bash
cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\3669-Rich.txt robocop2/3669-Rich.txt
```
* Run tests:
```bash
npx vitest run robocop2
```
* Lint:
```bash
npx eslint robocop2/robocop2.js --fix
```
* Format:
```bash
node scripts/align-conditions.js
```
* Save to local:
```bash
npx cruncheevos save robocop2/robocop2.js
```

Testing
```
node ../cruncheevos-playtest/bin/cli.js init robocop2
node ../cruncheevos-playtest/bin/cli.js sync robocop2
node ../cruncheevos-playtest/bin/cli.js viewer robocop2
```