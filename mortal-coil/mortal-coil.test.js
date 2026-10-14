import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './mortal-coil.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Beat Level 6', () => {
  const cheevo = achievement('Getting the Hang of It');

  test('pops when level 6 is finished', () => {
    const s = scenario('finish-level-6');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });

  test('does not pop when player is stuck', () => {
    const s = scenario('level-6-stuck');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop for level 7', () => {
    const s = scenario('level-7-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Clockwise', () => {
  const cheevo = achievement('Like a Clock');

  test('pops when level solved clockwise', () => {
    const s = scenario('level-5-clockwise');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });

  test('does not pop if not solved clockwise', () => {
    const s = scenario('level-5-not-clockwise');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('primed');
    expect(result.triggered).toBe(false);
  });
});

describe('Cornerstone', () => {
  const cheevo = achievement('Cornerstone');

  test('pops when started in corner', () => {
    const s = scenario('level-4-corner');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });

  test('does not pop if not solved clockwise', () => {
    const s = scenario('level-4-not-corner');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Turning Back Time', () => {
  const cheevo = achievement('Turning Back Time');

  test('pops when solved counter-clockwise', () => {
    const s = scenario('level-7-counter-clockwise');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('The Right Way', () => {
  const cheevo = achievement('The Right Way');

  test('pops when solved with only going right once', () => {
    const s = scenario('level-10-right-once');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.stateAt(s.marker('right-once'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('Progression: Beat Level 12', () => {
  const cheevo = achievement('Still Easy');

  test('pops when level 12 is finished', () => {
    const s = scenario('finish-level-12');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('17x17', () => {
  const cheevo = achievement('17 for 17');

  test('pops when level 17 is solved in 17 moves', () => {
    const s = scenario('finish-level-17-in-17-moves');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });

  test('does not pop if not solved in more moves', () => {
    const s = scenario('finish-level-17-in-18-moves');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('primed');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Level 18', () => {
  const cheevo = achievement('A Few More Tries');

  test('pops when level 18 is finished', () => {
    const s = scenario('finish-level-18');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('Progression: Beat Level 24', () => {
  const cheevo = achievement('Zooming Out');

  test('pops when level 24 is finished', () => {
    const s = scenario('finish-level-24');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('Progression: Beat Level 30', () => {
  const cheevo = achievement('Finding the Right Start');

  test('pops when level 30 is finished', () => {
    const s = scenario('finish-level-30');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('Hello RA', () => {
  const cheevo = achievement('Hello RA!');

  test('pops when secret level is discovered', () => {
    const s = scenario('hello-ra');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('secret-level-found'));
  });
});

describe('Tail Biter', () => {
  const cheevo = achievement('Tail Biter');

  test('pops when finished near start', () => {
    const s = scenario('level-26-tail-biter');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('Progression: Beat Level 36', () => {
  const cheevo = achievement('There Must Be a Pattern');

  test('pops when level 36 is finished', () => {
    const s = scenario('finish-level-36');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});

describe('Progression: Beat Level 42', () => {
  const cheevo = achievement('Maybe I Should Write a Solver');

  test('pops when level 42 is finished', () => {
    const s = scenario('level-42-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });
});