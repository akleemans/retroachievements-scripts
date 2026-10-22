import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './hugo2.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Ice cave', () => {
  const cheevo = achievement('Now, What Were Those Symbols Again?');

  test('pops when ice cave level is finished', () => {
    const s = scenario('ice-cave-from-start-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  // TODO
  // test('pops on patched ROM', () => {
  //   const s = scenario('EUR-ROM-level01-finish');
  //   const result = runAchievement(cheevo, s);
  //
  //   expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
  //   expect(result.triggered).toBe(true);
  //   expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  // });

  // TODO
  // test('does not pop if cheated', () => {
  //   const s = scenario('level02-finish');
  //   const result = runAchievement(cheevo, s);
  //
  //   expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
  //   expect(result.triggered).toBe(false);
  // });

  test('does not pop on different level', () => {
    const s = scenario('swimmer-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Ice cave deathless', () => {
  const cheevo = achievement('Walking on Thin Ice');

  test('pops when ice cave level is finished', () => {
    const s = scenario('ice-cave-no-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if died', () => {
    const s = scenario('ice-cave-from-start-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Forest', () => {
  const cheevo = achievement('I Think I\'ll Hang Around!');

  test('pops when Forest level is finished', () => {
    const s = scenario('forest-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('pops also on deathless', () => {
    const s = scenario('forest-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });
});


describe('Forest deathless', () => {
  const cheevo = achievement('Out of the Woods');

  test('pops when forest level is finished', () => {
    const s = scenario('forest-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if died', () => {
    const s = scenario('forest-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Snowboard', () => {
  const cheevo = achievement('I\'m Gonna Be the Coolest Troll in the World, All Thanks to You!');

  test('pops when Snowboard level is finished', () => {
    const s = scenario('snowboard-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('pops also on deathless', () => {
    const s = scenario('snowboard-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });
});

describe('Snowboard deathless', () => {
  const cheevo = achievement('Smooth Riding');

  test('pops when Snowboard level is finished', () => {
    const s = scenario('snowboard-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if died', () => {
    const s = scenario('snowboard-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Swimmer', () => {
  const cheevo = achievement('Do You Think I\'m A Sand Worm?!');

  test('pops when Swimmer level is finished', () => {
    const s = scenario('swimmer-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('pops also on deathless', () => {
    const s = scenario('swimmer-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });
});

describe('Swimmer deathless', () => {
  const cheevo = achievement('Swimming with the Fishes');

  test('pops when Swimmer level is finished', () => {
    const s = scenario('swimmer-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if died', () => {
    const s = scenario('swimmer-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Witch Endgame', () => {
  const cheevo = achievement('Trollerit, Trollerat, Trollerut, This Game Is Kaput!');

  test('pops when Witch Endgame level is finished', () => {
    const s = scenario('witch-game');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('game-finished'));
  });
});

describe('1000 points', () => {
  const cheevo = achievement(`Hugo's Point Cruise`);

  test('pops 1000 points reached', () => {
    const s = scenario('forest-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('1000-points-reached'));
  });
});

describe('2000 points', () => {
  const cheevo = achievement(`Hugo's Point Adventure`);

  test('pops 2000 points reached', () => {
    const s = scenario('swimmer-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('2000-points-reached'));
  });
});

// describe('3000 points', () => {
//   const cheevo = achievement(`Hugo's Point Extravaganza`);
//
//   test('pops 3000 points reached', () => {
//     const s = scenario('TODO');
//     const result = runAchievement(cheevo, s);
//
//     expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
//     expect(result.triggered).toBe(true);
//     expect(result.triggeredFrame).toBe(s.marker('3000-points-reached'));
//   });
// });