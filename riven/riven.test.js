import {describe, test, expect} from 'vitest';
import {Scenario} from 'cruncheevos-playtest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './riven.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

// Appends a recording to another one (second.firstFrame lands on first.lastFrame + 1), as if the second had been
// recorded right after the first. Addresses the second recording doesn't watch read 0.
const appendScenario = (first, second) => {
  const offset = first.lastFrame + 1 - second.firstFrame;
  const secondColumn = first.columns.map((c) => second.columns.findIndex((sc) => sc.address === c.address));
  const rows = [
    ...first.rows,
    ...second.rows.map((row) => ({
      frame: row.frame + offset,
      values: secondColumn.map((column) => (column < 0 ? 0 : row.values[column])),
    })),
  ];
  return new Scenario({meta: {}, columns: first.columns, rows});
};

describe('WARNING', () => {
  const cheevo = achievement('WARNING');

  const bootScenarios = [
    'start-game-usa',
    'start-game-europe',
    'start-game-france',
    'start-game-germany',
    'start-game-japan',
    'start-game-usa-disc-2',
  ];

  for (const name of bootScenarios) {
    test(`pops before the title screen: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('flags-initialized'));
      expect(result.triggeredFrame).toBeLessThan(s.marker('title-screen'));
    });
  }
});

describe('Find Cho', () => {
  const cheevo = achievement('Cho?');

  const findChoScenarios = [
    'temple-find-cho',
    'temple-find-cho-france',
    'temple-find-cho-japan',
    'temple-find-cho-europe',
    'temple-find-cho-germany',
  ];

  for (const name of findChoScenarios) {
    test(`pops when cho is found: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('cho-found'));
    });
  }

  test('does not pop if Cho disappeared', () => {
    const s = scenario('temple-cho-disappeared-germany');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('The Chapel', () => {
  const cheevo = achievement('The Chapel');

  const inspectArtScenarios = [
    // 'temple-inspect-all-art-displays',
    'temple-inspect-all-art-displays-germany',
  ];

  for (const name of inspectArtScenarios) {
    test(`pops when all art is inspected: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.measuredAt(s.marker('first-art-inspected'))).toBe(1);
      expect(result.triggered).toBe(true);
      expect(result.measuredAt(s.marker('last-beetle-inspected') - 1)).toBe(4);
      expect(result.triggeredFrame).toBe(s.marker('last-beetle-inspected'));
    });
  }

  test('does not pop on startup', () => {
    const s = scenario('start-game-usa');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Rotating Room', () => {
  const cheevo = achievement('Outsmart the Gate');
  const solveRotatingRoomScenarios = [
    'temple-rotating-room',
    'temple-rotating-room-france',
    'temple-rotating-room-germany',
    'temple-rotating-room-japan',
    'temple-rotating-room-europe',
  ];

  for (const name of solveRotatingRoomScenarios) {
    test(`pops when rotating room is solved: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('rotating-room-solved'));
    });
  }
});


describe('Jungle Island', () => {
  const cheevo = achievement('Jungle Island');

  const maglevToJungleScenarios = [
    'temple-maglev-to-jungle',
    'temple-maglev-to-jungle-france',
    'temple-maglev-to-jungle-germany',
    'temple-maglev-to-jungle-japan',
    'temple-maglev-to-jungle-europe',
  ];

  for (const name of maglevToJungleScenarios) {
    test(`pops when going off for Jungle Island: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('departing-maglev'));
    });
  }
});

describe('Scarab Beetle', () => {
  const cheevo = achievement('Meet the Scarab Beetle');

  const maglevToJungleScenarios = [
    'jungle-scarab-beetle',
    'jungle-scarab-beetle-not-flown-away',
  ];

  for (const name of maglevToJungleScenarios) {
    test(`pops when scarab beetle movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('scarab-close-up'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('scarab-movie-finished'));
    });
  }

  test('does not pop if walking past Beetle', () => {
    const s = scenario('jungle-scarab-beetle-missed');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Sunner', () => {
  const cheevo = achievement('Meet the Sunner');

  const sunnerScenarios = ['jungle-sunner'];

  for (const name of sunnerScenarios) {
    test(`pops when sunner movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('sunner-close-up'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('sunner-movie-finished'));
    });
  }

  test('does not pop if walking past Sunner', () => {
    const s = scenario('jungle-sunner-missed');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Knock, Knock', () => {
  const cheevo = achievement('Knock, Knock');

  const sunnerScenarios = ['jungle-knock-knock'];

  for (const name of sunnerScenarios) {
    test(`pops when villager movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('villager-looks-outside'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('villager-movie-finished'));
    });
  }
});

describe('Eye Spy', () => {
  const cheevo = achievement('Eye Spy');

  const jungleEyeScenarios = ['jungle-eye-spy'];

  for (const name of jungleEyeScenarios) {
    test(`pops when all 4 eye movies finished: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.measuredAt(s.marker('first-eye-movie-finished') - 1)).toBe(0);
      expect(result.measuredAt(s.marker('first-eye-movie-finished'))).toBe(1);
      expect(result.triggered).toBe(true);
      expect(result.stateAt(s.marker('last-eye-inspected'))).toBe('active');
      expect(result.measuredAt(s.marker('last-eye-movie-finished') - 1)).toBe(3);
      expect(result.triggeredFrame).toBe(s.marker('last-eye-movie-finished'));
    });
  }
});

describe('Lake Floor Express', () => {
  const cheevo = achievement('Lake Floor Express');

  const submarineScenarios = ['jungle-enter-submarine'];

  for (const name of submarineScenarios) {
    test(`pops when hatch opening movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('hatch-opens'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('hatch-movie-finished'));
    });
  }
});

describe('Counting on Fear', () => {
  const cheevo = achievement('Counting on Fear');

  const submarineScenarios = ['jungle-school-game'];

  for (const name of submarineScenarios) {
    test(`pops when both players-lost movies finished: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.measuredAt(s.marker('first-player-lost-movie-finished') - 1)).toBe(0);
      expect(result.measuredAt(s.marker('first-player-lost-movie-finished'))).toBe(1);
      expect(result.triggered).toBe(true);
      expect(result.stateAt(s.marker('second-player-lost'))).toBe('active');
      expect(result.triggeredFrame).toBe(s.marker('second-player-lost-movie-finished'));
    });
  }
});

describe('Boiler Island', () => {
  const cheevo = achievement('Boiler Island');

  const lumberCartScenarios = [
    'boiler-island-mine-cart',
    'boiler-island-mine-cart-skipped',
  ];

  for (const name of lumberCartScenarios) {
    test(`pops when lumber cart movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('cart-movie-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('cart-movie-finished'));
    });
  }
});

describe('Paper Pulp', () => {
  const cheevo = achievement('Paper Pulp');

  const boilerPuzzleScenarios = ['boiler-solve-boiler-puzzle'];

  for (const name of boilerPuzzleScenarios) {
    test(`pops when boiler door movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('door-movie-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('door-movie-finished'));
    });
  }
});

describe('Meet the Ytram', () => {
  const cheevo = achievement('Meet the Ytram');

  const ytramScenarios = ['boiler-capture-ytram'];

  for (const name of ytramScenarios) {
    test(`pops when ytram capture movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('ytram-movie-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('ytram-movie-finished'));
    });
  }
});

describe('Gehn\'s Lab', () => {
  const cheevo = achievement('Gehn\'s Lab');

  const gehnsLabScenarios = ['boiler-access-gehns-lab'];

  for (const name of gehnsLabScenarios) {
    test(`pops when vent cover movie finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('crawl-pipe-entered'))).toBe('active');
      expect(result.stateAt(s.marker('vent-movie-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('vent-movie-finished'));
    });
  }
});

describe('Survey Island', () => {
  const cheevo = achievement('Survey Island');

  const maglevToSurveyScenarios = [
    'boiler-maglev-to-survey',
    'jungle-maglev-to-survey',
  ];

  for (const name of maglevToSurveyScenarios) {
    test(`pops when maglev ride to Survey finishes: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('maglev-movie-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('maglev-movie-finished'));
    });
  }
});

describe('Advanced Island Topography', () => {
  const cheevo = achievement('Advanced Island Topography');

  // One recording per chosen island: Survey, Crater, Jungle, Prison
  const mapScenarios = [
    'survey-map-interaction-1',
    'survey-map-interaction-2',
    'survey-map-interaction-3',
    'survey-map-interaction-4',
  ];

  for (const name of mapScenarios) {
    test(`pops when first chunk is selected on the detailed map: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('detailed-map-reached'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('first-chunk-selected'));
    });
  }
});

describe('Deep Into the Earth', () => {
  const cheevo = achievement('Deep into the Earth');

  const goldenLiftScenarios = ['survey-use-golden-lift'];

  for (const name of goldenLiftScenarios) {
    test(`pops when gold elevator arrives underground: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('elevator-ride-down-start'))).toBe('active');
      expect(result.stateAt(s.marker('elevator-drop-movie-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('elevator-drop-movie-finished'));
    });
  }
});

describe('Unwelcome Visitor', () => {
  const cheevo = achievement('Unwelcome Visitor');

  test('pops when the Scribe fleeing movie finishes', () => {
    const s = scenario('survey-follow-scribe');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('scribe-spotted'))).toBe('active');
    expect(result.stateAt(s.marker('scribe-flees-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scribe-flees-movie-finished'));
  });

  test('does not pop when following the Scribe too late', () => {
    const s = scenario('survey-follow-scribe-too-late');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('maglev-platform-reached'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Meet the Wahrk', () => {
  const cheevo = achievement('Meet the Wahrk');

  test('pops when the first wahrk movie finishes', () => {
    const s = scenario('survey-watch-wahrk');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('wahrk-first-call'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('wahrk-first-movie-finished'));
  });
});

describe('Is that glass thick enough?', () => {
  const cheevo = achievement('Is That Glass Thick Enough?');

  test('pops when the wahrk attack movie finishes', () => {
    const s = scenario('survey-watch-wahrk');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('wahrk-first-movie-finished'))).toBe('active');
    expect(result.stateAt(s.marker('wahrk-third-movie-finished'))).toBe('active');
    expect(result.stateAt(s.marker('wahrk-annoyed-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('wahrk-annoyed-movie-finished'));
  });
});

describe('Under Observation', () => {
  const cheevo = achievement('Under Observation');

  test('pops when the Catherine movie finishes', () => {
    const s = scenario('survey-watch-catherine');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('town-feed-on'))).toBe('active');
    expect(result.stateAt(s.marker('catherine-feed-on'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('catherine-movie-finished'));
  });

  test('does not pop when only watching the wahrk', () => {
    const result = runAchievement(cheevo, scenario('survey-watch-wahrk'));

    expect(result.triggered).toBe(false);
  });
});

describe('Gehn Is Watching You', () => {
  const cheevo = achievement('Gehn Is Watching You');

  test('pops when the Gehn movie finishes', () => {
    const s = scenario('temple-gehn-watching');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('gehn-screen-reached'))).toBe('active');
    expect(result.stateAt(s.marker('gehn-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('gehn-movie-finished'));
  });
});

describe('Fire Marbles', () => {
  const cheevo = achievement('Fire Marbles');

  test('pops when the solved movie finishes', () => {
    const s = scenario('temple-marble-puzzle');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('puzzle-solved'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('solved-movie-finished'));
  });

  test('does not pop with a wrong marble placement', () => {
    const s = scenario('temple-marble-puzzle-wrong');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('press-fired-wrong'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Gehn\'s Realm', () => {
  const cheevo = achievement('Gehn\'s Realm');

  test('pops when arriving in Gehns cage', () => {
    const s = scenario('temple-open-dome-to-233');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('book-opened'))).toBe('active');
    expect(result.stateAt(s.marker('panel-active'))).toBe('active');
    expect(result.stateAt(s.marker('link-screen'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('arrived-233'));
    // Option 2 (dome book opening): expect(result.triggeredFrame).toBe(s.marker('book-opened'));
  });
});

describe('The Wahrk Gallows', () => {
  const cheevo = achievement('The Wahrk Gallows');

  test('pops when the winch movie finishes', () => {
    const s = scenario('jungle-gallows-entry');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('winch-screen-reached'))).toBe('active');
    expect(result.stateAt(s.marker('winch-pulled'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('winch-movie-finished'));
    expect(result.triggeredFrame).toBeLessThan(s.marker('ledge-reached'));
  });
});

describe('Rebel Ground', () => {
  const cheevo = achievement('Rebel Ground');

  test('pops when the door switch movie finishes', () => {
    const s = scenario('jungle-moiety-cave-found');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('door-switched'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('door-movie-finished'));
  });
});

describe('Secrets of Stonehenge', () => {
  const cheevo = achievement('Secrets of Stonehenge');

  test('pops when the water movie finishes', () => {
    const s = scenario('jungle-moiety-cave-puzzle-solved');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('first-stone-pressed'))).toBe('active');
    expect(result.stateAt(s.marker('last-stone-pressed'))).toBe('active');
    expect(result.stateAt(s.marker('water-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('water-movie-finished'));
  });

  test('does not pop on a wrong stone order, then pops on the correct one', () => {
    const s = scenario('jungle-moiety-cave-wrong-solution-first');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('wrong-stone-movie-finished'))).toBe('active');
    expect(result.stateAt(s.marker('stones-reset'))).toBe('active');
    expect(result.stateAt(s.marker('last-stone-pressed'))).toBe('active');
    expect(result.triggered).toBe(true);
    // Water movie was skipped here, which still counts
    expect(result.triggeredFrame).toBe(s.marker('water-movie-finished'));
  });
});

describe('The New Great Tree', () => {
  const cheevo = achievement('The New Great Tree');

  test('pops when the boat ride to the tree finishes: tay-enter-tree', () => {
    const s = scenario('tay-enter-tree');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('captors-movie-start'))).toBe('active');
    expect(result.stateAt(s.marker('boat-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('boat-movie-finished'));
    // Option 2 (cell arrival): expect(result.triggeredFrame).toBe(s.marker('cell-reached'));
  });
});

describe('Captive Audience', () => {
  const cheevo = achievement('Captive Audience');

  test('pops when all 4 village scenes were watched: tay-watch-people', () => {
    const s = scenario('tay-watch-people');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.measuredAt(s.marker('right-scene-finished'))).toBe(1);
    expect(result.measuredAt(s.marker('middle-scene-finished'))).toBe(2);
    // Other middle house variants count as the same scene
    expect(result.measuredAt(s.marker('middle-scene-repeated'))).toBe(2);
    expect(result.measuredAt(s.marker('left-scene-finished'))).toBe(3);
    expect(result.stateAt(s.marker('last-scene-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('last-scene-finished'));
  });
});

describe('What Does This Do Again?', () => {
  const cheevo = achievement('What Does This Do Again?');

  test('pops when the Tay trap book ending finishes', () => {
    const s = scenario('ending2-use-trap-book-on-tay');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('trap-book-movie-start'))).toBe('active');
    expect(result.stateAt(s.marker('ending-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('ending-movie-finished'));
  });
});

describe('Second Thoughts', () => {
  const cheevo = achievement('Second Thoughts');

  test('pops when the Gehn trap book ending finishes', () => {
    const s = scenario('ending4-use-trap-book-on-riven-after-gehn');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('trap-book-movie-start'))).toBe('active');
    expect(result.stateAt(s.marker('ending-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('ending-movie-finished'));
  });

  for (const name of ['ending7-release-gehn-in-233', 'ending7-release-gehn-on-prison-island']) {
    test(`does not pop on the E7 ending (same screen, other movie): ${name}`, () => {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.triggered).toBe(false);
    });
  }
});

describe('A One-Man Prison', () => {
  const cheevo = achievement('A One-Man Prison');

  test('pops when Gehn links into the trap book', () => {
    const s = scenario('233-trap-gehn');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('trap-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('trap-movie-finished'));
  });
});

describe('The Once Great Tree', () => {
  const cheevo = achievement('The Once Great Tree');

  test('pops after the link to Prison Island', () => {
    const s = scenario('233-go-to-prison-island');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('link-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('link-movie-finished'));
  });
});

describe('Music to Her Ears', () => {
  const cheevo = achievement('Music to Her Ears');

  test('pops after Catherine is freed: prison-free-catherine', () => {
    const s = scenario('prison-free-catherine');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('cage-opened'))).toBe('active');
    expect(result.stateAt(s.marker('freed-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('freed-movie-finished'));
  });
});

describe('The Ending Can Never Truly Be Written', () => {
  const cheevo = achievement('The Ending Can Never Truly Be Written');

  test('pops at the end of the final scene: temple-best-ending', () => {
    const s = scenario('temple-best-ending');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('ending-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('ending-movie-finished'));
  });
});

describe('Pity for the Old Man', () => {
  const cheevo = achievement('Pity for the Old Man');

  const scenarios = ['ending7-release-gehn-in-233', 'ending7-release-gehn-on-prison-island'];

  for (const name of scenarios) {
    test(`pops after the ending movie: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.stateAt(s.marker('trap-book-movie-start'))).toBe('active');
      expect(result.stateAt(s.marker('ending-movie-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('ending-movie-finished'));
    });
  }

  test('does not pop on the E4 ending (same screen, other movie)', () => {
    const result = runAchievement(cheevo, scenario('ending4-use-trap-book-on-riven-after-gehn'));

    expect(result.triggered).toBe(false);
  });
});

describe('Endings', () => {
  // Each ending achievement with its recordings; every recording is also run against every other ending achievement
  const endings = [
    {title: 'Alone in the Dark', scenarios: ['ending1-open-fissure-without-visiting-gehn-or-tay']},
    {title: 'What Does This Do Again?', scenarios: ['ending2-use-trap-book-on-tay']},
    {title: 'You Have My Sympathy', scenarios: ['ending3-use-trap-book-without-visiting-gehn']},
    {title: 'Second Thoughts', scenarios: ['ending4-use-trap-book-on-riven-after-gehn']},
    {title: 'No Thanks, After You', scenarios: ['ending5-refuse-gehn-three-times']},
    {title: 'Gehn\'s Victory', scenarios: ['ending6-open-star-fissure-without-capturing-gehn']},
    {title: 'Pity for the Old Man', scenarios: ['ending7-release-gehn-in-233', 'ending7-release-gehn-on-prison-island']},
    {title: 'Betraying the Moiety', scenarios: ['ending8-release-gehn-on-tay']},
    {title: 'We Will Never Know Her Fate', scenarios: ['ending9-forget-catherine']},
    {title: 'The Ending Can Never Truly Be Written', scenarios: ['temple-best-ending']},
  ];

  for (const ending of endings) {
    const cheevo = achievement(ending.title);

    for (const name of ending.scenarios) {
      test(`${ending.title} pops after the ending movie: ${name}`, () => {
        const s = scenario(name);
        const result = runAchievement(cheevo, s);

        expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
        expect(result.stateAt(s.marker('ending-movie-start'))).toBe('active');
        expect(result.triggered).toBe(true);
        expect(result.triggeredFrame).toBe(s.marker('ending-movie-finished'));
      });
    }

    for (const other of endings.filter((e) => e !== ending)) {
      for (const name of other.scenarios) {
        test(`${ending.title} does not pop on another ending: ${name}`, () => {
          expect(runAchievement(cheevo, scenario(name)).triggered).toBe(false);
        });
      }
    }
  }
});

describe('Full Coverage', () => {
  const cheevo = achievement('Full Coverage');

  test('counts the Prison Island dome when it opens', () => {
    const s = scenario('233-go-to-prison-island');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(s.marker('prison-dome-opened') - 1)).toBe(0);
    expect(result.measuredAt(s.marker('prison-dome-opened'))).toBe(1);
    expect(result.triggered).toBe(false);
  });

  test('does not count a dome closing', () => {
    const result = runAchievement(cheevo, scenario('temple-open-dome-to-233'));

    expect(result.triggered).toBe(false);
  });

  test('counts the Jungle dome while it stays open across islands', () => {
    // jdome: 0 -> 2 (about to open, frame 321484) -> 1 (open, frame 322500), island 5 -> 2 -> 5 afterwards
    const s = scenario('domes-1-open-jungle-dome');
    const result = runAchievement(cheevo, s);

    expect(result.measuredTarget).toBe(5);
    expect(result.measuredAt(321484)).toBe(0);
    expect(result.measuredAt(322500)).toBe(1);
    expect(result.measuredAt(337591)).toBe(1);
    expect(result.triggered).toBe(false);
  });

  test('counts the Temple dome on arrival from 233, ignores the Prison dome closing', () => {
    // pdome 1 -> 0 when stepping inside (frame 1417066), then via 233 to Temple, tdome 0 -> 1 (frame 1431410)
    const s = scenario('test-prison-dome-opening');
    const result = runAchievement(cheevo, s);

    // the recording starts mid-game with pdome = 1, which counts on the first frame (memory jumps from 0)
    expect(result.measuredAt(1431410) - result.measuredAt(1431410 - 1)).toBe(1);
    expect(result.measuredAt(1431410)).toBe(result.measuredAt(1417066) + 1);
    expect(result.triggered).toBe(false);
  });

  test('pops when the fifth dome opens', () => {
    // Jungle, Survey, Boiler, Prison, Temple; Boiler and Prison close again before the end, which doesn't matter
    const s = scenario('domes-open-all-5');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(1305829)).toBe(1);
    expect(result.measuredAt(1337000)).toBe(2);
    expect(result.measuredAt(1364823)).toBe(3);
    expect(result.measuredAt(1414393)).toBe(4);
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(1425927);
  });

  for (const name of ['start-game-usa', 'start-game-europe', 'start-game-france', 'start-game-germany', 'start-game-japan']) {
    test(`forgets opened domes when the console is rebooted: ${name}`, () => {
      // Synthetic: no recording has a reboot after a dome opening, so a boot recording is appended to a dome recording
      const domes = scenario('domes-1-open-jungle-dome');
      const boot = scenario(name);
      const s = appendScenario(domes, boot);
      const bootSignal = domes.lastFrame + 1 + boot.marker('flags-initialized');
      const result = runAchievement(cheevo, s);

      expect(result.measuredAt(domes.lastFrame)).toBe(1);
      // core is still paused on the boot signal, the hit survives until then
      expect(result.stateAt(bootSignal - 1)).toBe('paused');
      expect(result.measuredAt(bootSignal - 1)).toBe(1);
      // the hits are cleared here, the measured value only follows once the pause lifts (AddHits total, not the Measured condition's own hits)
      expect(result.stateAt(bootSignal)).toBe('reset');
      expect(result.framesInState('reset')).toHaveLength(1);
      expect(result.stateAt(s.lastFrame)).toBe('active');
      expect(result.measuredAt(s.lastFrame)).toBe(0);
      expect(result.triggered).toBe(false);
    });
  }

  const regionLoads = [
    // [scenario, save flags written, first screen]
    ['load-state-europe', 3086, 3837],
    ['load-state-france', 3113, 3269],
    ['load-state-japan', 3153, 3981],
  ];

  for (const [name, loadFrame, screenFrame] of regionLoads) {
    test(`is paused while loading a save: ${name}`, () => {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.stateAt(loadFrame)).toBe('paused');
      expect(result.stateAt(screenFrame - 1)).toBe('paused');
      expect(result.stateAt(screenFrame)).toBe('active');
      expect(result.measuredAt(screenFrame)).toBe(0);
    });
  }

  test('does not count a dome opened by loading a save', () => {
    // all save flags (jdome 0 -> 1) are written at frame 3038, the first screen loads at 3891
    const s = scenario('domes-load-save-file-jungle-dome-open');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(3038)).toBe('paused');
    expect(result.stateAt(3891)).toBe('active');
    expect(result.measuredAt(3891)).toBe(0);
    expect(result.triggered).toBe(false);
  });

  for (const name of ['start-game-usa', 'start-game-japan', 'start-game-usa-disc-2']) {
    test(`does not pop on boot garbage: ${name}`, () => {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.triggered).toBe(false);
    });
  }
});

describe('Commercial Break', () => {
  const cheevo = achievement('Commercial Break');

  for (const name of ['survey-watch-catherine', 'survey-watch-wahrk']) {
    test(`does not pop on the regular feeds: ${name}`, () => {
      expect(runAchievement(cheevo, scenario(name)).triggered).toBe(false);
    });
  }

  test('pops when the ad finishes on the left scope', () => {
    // started by a click on the tiny hotspot 20 (hover index 8) in the bottom right corner of the scope
    const s = scenario('easter-egg-silly-putty');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scope-arrived'))).toBe('active');
    expect(result.stateAt(s.marker('ad-started'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('ad-finished'));
  });
});

describe('The Abyss Will Gaze Back', () => {
  const cheevo = achievement('The Abyss Will Gaze Back');

  test('pops when looking through the eyepiece with the telescope lowered', () => {
    const s = scenario('temple-look-into-abyss');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('abyss-shown'));
  });

  test('does not pop when the telescope is still too high', () => {
    // same walk with the telescope one step higher, but the view is blurry
    const s = scenario('temple-look-into-abyss-not-close-enough');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on startup', () => {
    const result = runAchievement(cheevo, scenario('start-game-usa'));

    expect(result.triggered).toBe(false);
  });
});

describe('Scholar of the Ages', () => {
  const cheevo = achievement('Scholar of the Ages');

  test('counts each journal on its last page and pops on the fourth', () => {
    // Gehn's bedside journal is read from the first page, his lab notes open on the last page (read earlier),
    // Atrus's journal is read from the first page and closed, Catherine's journal opens on the last page
    const s = scenario('read-all-journals');
    const result = runAchievement(cheevo, s);

    const bedsideLastPage = 1358875;
    const labNotesOpened = 1374960;
    const atrusClosed = 1386249;
    const catherineOpened = 1386784;

    expect(result.measuredTarget).toBe(4);
    expect(result.measuredAt(bedsideLastPage - 1)).toBe(0);
    expect(result.measuredAt(bedsideLastPage)).toBe(1);
    expect(result.measuredAt(labNotesOpened - 1)).toBe(1);
    expect(result.measuredAt(labNotesOpened)).toBe(2);
    expect(result.measuredAt(atrusClosed - 1)).toBe(2);
    expect(result.measuredAt(atrusClosed)).toBe(3);
    expect(result.stateAt(catherineOpened - 1)).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(catherineOpened);
  });

  for (const name of ['start-game-usa', 'start-game-europe', 'start-game-france', 'start-game-germany', 'start-game-japan']) {
    test(`counts nothing during boot: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.measuredAt(s.lastFrame)).toBe(0);
      expect(result.triggered).toBe(false);
    });
  }
});

describe('Egg Hunt', () => {
  const cheevo = achievement('Egg Hunt');

  test('shows 4/5 before the last step and pops on it', () => {
    const s = scenario('easter-egg-activate-and-christmas');
    const result = runAchievement(cheevo, s);

    expect(result.measuredTarget).toBe(5);
    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.measuredAt(s.marker('egg-unlocked') - 1)).toBe(4);
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('egg-unlocked'));
  });

  for (const name of ['easter-egg-silly-putty', 'easter-egg-sky-walk', 'easter-egg-wireframe']) {
    test(`does not pop while playing with the eggs already unlocked: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.measuredAt(s.lastFrame)).toBe(5);
      expect(result.triggered).toBe(false);
    });
  }

  const steps = [
    // [scenario, frame of the step, progress after it]
    ['easter-egg-first-step', 574790, 1],
    ['easter-egg-third-step', 1280306, 3],
    ['easter-egg-fourth-step-with-another-click', 1356068, 4],
  ];

  for (const [name, stepFrame, progress] of steps) {
    test(`counts the step without popping: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(stepFrame)).toBe('active');
      expect(result.measuredAt(stepFrame - 1)).toBe(progress - 1);
      expect(result.measuredAt(stepFrame)).toBe(progress);
      expect(result.triggered).toBe(false);
    });
  }

  test('falls back to 0/5 when something else is clicked in between', () => {
    // the click at 1356243 after the fourth step isn't the fifth step, so the game clears the progress
    const s = scenario('easter-egg-fourth-step-with-another-click');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(1356243 - 1)).toBe(4);
    expect(result.measuredAt(1356243)).toBe(0);
    expect(result.measuredAt(s.lastFrame)).toBe(0);
  });

  const bootScenarios = [
    // [scenario, first frame with junk in the progress, first frame after it]
    ['start-game-usa', 468, 777],
    ['start-game-europe', 408, 673],
    ['start-game-france', 408, 673],
    ['start-game-germany', 408, 673],
    ['start-game-japan', 468, 777],
    ['load-state-europe', 408, 673],
    ['load-state-france', 408, 673],
    ['load-state-japan', 468, 777],
  ];

  for (const [name, junkStart, junkEnd] of bootScenarios) {
    test(`is paused while the progress holds junk during boot: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(junkStart)).toBe('paused');
      expect(result.stateAt(junkEnd - 1)).toBe('paused');
      expect(result.measuredAt(s.lastFrame)).toBe(0);
      expect(result.triggered).toBe(false);
    });
  }
});

describe('Deck the Halls', () => {
  const cheevo = achievement('Deck the Halls');

  test('does not pop on the lamp room without the easter egg', () => {
    // gehn-screen-left is the arrival on the lamp room (tTempleNoChr1300)
    const s = scenario('temple-gehn-watching');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('gehn-screen-left'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('pops when the lamp is clicked with the easter egg unlocked, not on arrival', () => {
    // the lights are on screen right after lamp-clicked (screenshots 1400756 without, 1400846 with lights)
    const s = scenario('easter-egg-activate-and-christmas');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('egg-unlocked'))).toBe('active');
    expect(result.stateAt(s.marker('lamp-room-arrived'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('lamp-clicked'));
  });
});

describe('The Wireframe', () => {
  const cheevo = achievement('The Wireframe');

  test('pops when turning right into the wireframe village', () => {
    const s = scenario('easter-egg-wireframe');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('ladder-view-arrived'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('wireframe-arrived'));
  });

  test('does not pop on startup', () => {
    const s = scenario('start-game-usa');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('A Walk in the Sky', () => {
  const cheevo = achievement('A Walk in the Sky');

  test('pops when the lamp on the throne stairs is clicked, not on arrival', () => {
    // the sky is on screen right after lamp-clicked (screenshots 50063 without, 50093 with)
    const s = scenario('easter-egg-sky-walk');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('throne-stairs-arrived'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('lamp-clicked'));
  });

  test('pops on the lamp click on the French version', () => {
    // the sky comes up between screenshots 122689 (without) and 122719 (with)
    const s = scenario('easter-egg-sky-walk-france');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('lamp-clicked') - 1)).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('lamp-clicked'));
  });

  test('does not pop on the Temple lamp click (other screen)', () => {
    const s = scenario('easter-egg-activate-and-christmas');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });

  test('does not pop if easter egg mode not unlocked', () => {
    const s = scenario('easter-egg-sky-walk-clicked-without-eggs-unlocked');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Gehn\'s Secret Paths', () => {
  const cheevo = achievement('Gehn\'s Secret Paths');

  const regionLoads = [
    // [scenario, save flags written, first screen]
    ['load-state-europe', 3086, 3837],
    ['load-state-france', 3113, 3269],
    ['load-state-japan', 3153, 3981],
  ];

  for (const [name, loadFrame, screenFrame] of regionLoads) {
    test(`is paused while loading a save: ${name}`, () => {
      // these saves have only the beetle room inner gate open
      const result = runAchievement(cheevo, scenario(name));

      expect(result.stateAt(loadFrame)).toBe('paused');
      expect(result.stateAt(screenFrame - 1)).toBe('paused');
      expect(result.stateAt(screenFrame)).toBe('active');
      expect(result.measuredAt(screenFrame)).toBe(1);
    });
  }

  test('does not pop when a save is loaded', () => {
    // early save, only the beetle room inner gate open (save flags written at 3038, first screen at 3891)
    const s = scenario('domes-load-save-file-jungle-dome-open');
    const result = runAchievement(cheevo, s);

    expect(result.measuredTarget).toBe(7);
    expect(result.stateAt(3038)).toBe('paused');
    expect(result.stateAt(3891)).toBe('active');
    expect(result.measuredAt(3891)).toBe(1);
    expect(result.triggered).toBe(false);
  });

  test('pops when the last shortcut is opened (Prison Ledge Ladder)', () => {
    // the other six are open, the ladder goes 0 -> 1 at frame 1013951
    const s = scenario('shortcuts-prison-ledge');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(1013951 - 1)).toBe(6);
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(1013951);
  });

  // each recording opens one more shortcut: [scenario, frame, progress before, progress after]
  const progressSteps = [
    ['shortcuts-temple-beetle-inner-gate', 88313, 0, 1],
    ['shortcuts-boiler-hatch', 520789, 1, 2],
    ['shortcuts-boiler-gehns-lab-door', 553273, 2, 3],
    ['shortcuts-boiler-to-temple-dome-bridge', 586087, 3, 4],
    ['shortcuts-temple-dome-inner-bridge', 596715, 4, 5],
    ['shortcuts-temple-dome-to-beetle-outer-door', 616496, 5, 6],
  ];

  for (const [name, frame, before, after] of progressSteps) {
    test(`counts the shortcut and keeps it across islands: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.measuredAt(frame - 1)).toBe(before);
      expect(result.measuredAt(frame)).toBe(after);
      expect(result.measuredAt(s.frameNumberAt(s.length - 1))).toBe(after);
      expect(result.triggered).toBe(false);
    });
  }

  test('pauses when Gehn is trapped', () => {
    // all seven open, Gehn State 1 -> 4 at frame 1312806
    const s = scenario('233-trap-gehn');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(1312806 - 1)).toBe('active');
    expect(result.measuredAt(1312806 - 1)).toBe(7);
    expect(result.stateAt(1312806)).toBe('paused');
    expect(result.triggered).toBe(false);
  });

  test('stays paused when the endgame closes the steam dome paths', () => {
    // Gehn trapped, 0x10080 and 0x10084 go back to 0 at frame 1390852 when Catherine is freed
    const s = scenario('prison-free-catherine');
    const result = runAchievement(cheevo, s);

    expect(result.framesInState('active')).toEqual([]);
    expect(result.triggered).toBe(false);
  });

  for (const name of ['start-game-usa', 'start-game-japan', 'start-game-usa-disc-2']) {
    test(`does not pop on boot garbage: ${name}`, () => {
      expect(runAchievement(cheevo, scenario(name)).triggered).toBe(false);
    });
  }
});
