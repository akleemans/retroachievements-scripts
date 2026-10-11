Mr. Do
======

* Copy Code notes (format afterwards): `cp C:\RA\Emus\BizHawk-2.11.1-win-x64\RACache\Data\4746-Notes.json mr-do/4746-Notes.json`
* Sync: `node ../cruncheevos-playtest/bin/cli.js sync mr-do`
* Run tests: `npx vitest run mr-do`
* Check coverage: `node scripts/test-coverage.js`
* Run viewer: `node ../cruncheevos-playtest/bin/cli.js viewer mr-do`
* Lint: `npx eslint mr-do/mr-do.js --fix`
* Format: `node scripts/align-conditions.js`
* Save to local: `npx cruncheevos save mr-do/mr-do.js`
