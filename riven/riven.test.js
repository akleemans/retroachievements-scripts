import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './riven.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

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

describe('Submarine', () => {
  const cheevo = achievement('Submarine');

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

describe('Dni Scholar', () => {
  const cheevo = achievement('D\'ni Scholar');

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

describe('Boiler Puzzle', () => {
  const cheevo = achievement('Boiler Puzzle');

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

describe('Gehn\'s Map', () => {
  const cheevo = achievement('Gehn\'s Map');

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
  const cheevo = achievement('Deep Into the Earth');

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

  test('pops when the Scribe fleeing movie finishes: survey-follow-scribe', () => {
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

  test('pops when the first wahrk movie finishes: survey-watch-wahrk', () => {
    const s = scenario('survey-watch-wahrk');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('wahrk-first-call'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('wahrk-first-movie-finished'));
  });
});

describe('Is that glass thick enough?', () => {
  const cheevo = achievement('Is that glass thick enough?');

  test('pops when the wahrk attack movie finishes: survey-watch-wahrk', () => {
    const s = scenario('survey-watch-wahrk');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('wahrk-first-movie-finished'))).toBe('active');
    expect(result.stateAt(s.marker('wahrk-third-movie-finished'))).toBe('active');
    expect(result.stateAt(s.marker('wahrk-annoyed-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('wahrk-annoyed-movie-finished'));
  });
});

describe('Is that Catherine?', () => {
  const cheevo = achievement('Is that Catherine?');

  test('pops when the Catherine movie finishes: survey-watch-catherine', () => {
    const s = scenario('survey-watch-catherine');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('town-feed-on'))).toBe('active');
    expect(result.stateAt(s.marker('catherine-feed-on'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('catherine-movie-finished'));
  });

  test('does not pop when only watching the wahrk: survey-watch-wahrk', () => {
    const result = runAchievement(cheevo, scenario('survey-watch-wahrk'));

    expect(result.triggered).toBe(false);
  });
});

describe('Gehn Is Watching You', () => {
  const cheevo = achievement('Gehn Is Watching You');

  test('pops when the Gehn movie finishes: temple-gehn-watching', () => {
    const s = scenario('temple-gehn-watching');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('gehn-screen-reached'))).toBe('active');
    expect(result.stateAt(s.marker('gehn-movie-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('gehn-movie-finished'));
  });
});
