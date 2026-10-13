retroachievements-scripts
=========================

My Achievement Sets for [RetroAchievements](https://retroachievements.org/), implemented
using [cruncheevos](https://github.com/suXinjke/cruncheevos).

Sets:

* [The Rugrats Movie (GB)](/rugrats) | [RA](https://retroachievements.org/game/2563) - My first set!
* [Turok: Battle of the Bionosaurs (GB)](/turok) | [RA](https://retroachievements.org/game/13955)
* [Monster Force (GBA)](/monster-force) | [RA](https://retroachievements.org/game/5260) - My graduation set for the [RA junior program](https://docs.retroachievements.org/developer-docs/jr-dev-rules.html)
* [Mr. Do! (GB)](/mr-do) | [RA](https://retroachievements.org/game/4746)
* [Mortal Coil (GB)](/mortal-coil) | [RA](https://retroachievements.org/game/45174) - Homebrew game which I made myself, see [itch.io](https://adrianusk.itch.io/mortal-coil)

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file with `RACACHE=C:\path\to\RALibretro`

## Usage

See [@cruncheevos/cli](https://github.com/suXinjke/cruncheevos/tree/master/packages/cli) for details.

* Import set: `npx cruncheevos generate 5260 monster-force/monster-force.js` (possibly with `--include-unofficial`)
* Diff set: `npx cruncheevos diff monster-force/monster-force.js`
* Save to local: `npx cruncheevos save monster-force/monster-force.js`
* Lint: `npx eslint monster-force/monster-force.js --fix`
* Format: `npm run format`
* Run tests: `npm run test`
* Check test coverage: `npm run check-coverage`
* Open viewer: `npm run viewer`
* Sync code notes to scenarios: `npm run sync`

## Tests

Tests are written in [cruncheevos-playtest](https://www.npmjs.com/package/cruncheevos-playtest), which allows for
recording scenarios (memory recordings of all Code notes while playing manually in an emulator) and then writing test
expectations against those.

See for example the Monster Force set, which has extensive tests and scenario recordings.
