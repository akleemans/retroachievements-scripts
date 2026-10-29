import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import {parseTrigger, createPeek} from 'cruncheevos-playtest';
import set from './terminator2.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Level 1', () => {
  const cheevo = achievement('Kill the Hunter Killer');

  test('pops when level 1 is finished', () => {
    const s = scenario('level1-finished-from-boot');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });

  test('does not pop on different level', () => {
    const s = scenario('level2-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Level 1 without mines', () => {
  const cheevo = achievement('Mines and Mines Alone');

  test('pops when level 1 is finished without stepping on mines', () => {
    const s = scenario('level1-finished-from-boot');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('level-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });

  test('does not pop if tripped on mine', () => {
    const s = scenario('level1-tripped-mine');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.stateAt(s.marker('tripped-mine'))).toBe('active');
    expect(result.triggered).toBe(false);
    // Should not prime on different level
    expect(result.stateAt(s.marker('level2-start'))).toBe('active');
  });
});

describe('Level 1 flashing tip', () => {
  const cheevo = achievement('Thanks for the Tip, Mom!');

  test('pops when level 1 is finished without stepping on mines', () => {
    const s = scenario('level1-flashing-tip');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('tip-picked-up'));
  });

  test('does not pop without flashing tip', () => {
    const s = scenario('level1-finished-from-boot');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Progression: Level 2', () => {
  const cheevo = achievement('We Got Skynet by the Balls Now, Don\'t We?');

  test('pops when level 2 is finished', () => {
    const s = scenario('level2-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });
});

describe('Level 2 time + hint', () => {
  const cheevo = achievement('Thanks for the Hustle, Mom!');

  test('pops when level 2 is finished in time, with hint', () => {
    const s = scenario('level2-finished-hint');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('hint-collected'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });

  test('does not pop if hint not picked up', () => {
    const s = scenario('level2-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Level 2 mysterious person', () => {
  const cheevo = achievement('After You, Savior of Humanity');

  test('pops when level 2 is finished after seeing person', () => {
    const s = scenario('level2-finished-person');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });

  test('does not pop if not waited for person', () => {
    const s = scenario('level2-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Level 3', () => {
  const cheevo = achievement('You Reprogrammed Me to Be Your Protector');

  test('pops when level 3 is finished', () => {
    const s = scenario('level3-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });
});

describe('Level 3 without failing', () => {
  const cheevo = achievement('Who Sent You?');

  test('pops when level 3 is finished without failing', () => {
    const s = scenario('level3-finished-without-failing');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });

  test('does not pop if failed before', () => {
    const s = scenario('level3-finished'); // 1 chance left, failed once before
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Level 4', () => {
  const cheevo = achievement( 'My Mission Is to Protect You');

  test('pops when level 4 is finished', () => {
    const s = scenario('level4-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });
});

describe('Level 4 without right part', () => {
  const cheevo = achievement( 'We Have to Get Out of the City Immediately');

  test('pops when level 4 is finished without touching right part', () => {
    const s = scenario('level4-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });

  test('does not pop if too far right', () => {
    const s = scenario('level4-finished-with-driving-right');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.stateAt(s.marker('drove-to-right'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Level 5', () => {
  const cheevo = achievement( 'I Was Wondering if You Know Where It Came From?');

  test('pops when level 5 is finished', () => {
    const s = scenario('level5-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });
});

describe('Level 5 with collecting arm before key', () => {
  const cheevo = achievement( 'It Gave Us Ideas, Took Us in New Directions');

  test('pops when level 5 is finished with collecting arm before key', () => {
    const s = scenario('level5-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('arm-picked-up'));
  });

  test('does not pop if wrong order', () => {
    const s = scenario('level5-finished-arm-last');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Level 6', () => {
  const cheevo = achievement( 'Terminated');

  test('pops when level 6 is finished', () => {
    const s = scenario('level6-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });
});

describe('Level 6: Punches', () => {
  const cheevo = achievement( 'Advanced Prototype');

  test('pops when T-1000 is transformed using punches', () => {
    const s = scenario('level6-punches');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('arm-picked-up'));
  });

  test('does not pop if not transformed', () => {
    const s = scenario('level6-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


// TODO
//  'Hey Bro, I\'m Gonna Get Some Quarters',
// 'Drive Faster'


/* ========= LEADERBOARDS ========= */

// const leaderboard = (title) => Object.values(set.leaderboards).find((l) => l.title === title);
//
// // Use LB start/cancel/submit as conditions like achievement
// const lbTrigger = (lb, part) => ({conditions: lb.conditions[part]});
//
// // Make value expression parseable as a trigger while measuredAt() still reports the value
// const lbValue = (lb) => {
//   const groups = lb.conditions.value;
//   if (groups.length > 1) throw new Error(`leaderboard "${lb.title}": max-of ($) values are not supported`);
//   const conditions = groups[0].map((condition) => `${condition}`);
//   const measured = conditions.pop();
//   conditions.push(/[<>=!]/.test(measured) ? `${measured}.4294967295.` : `${measured}>=4294967295`);
//   return conditions.join('_');
// };
//
// // Run a whole leaderboard like rcheevos does: wait for start to be false once, then
// // start -> (cancel | submit), with the value reset on start and only evaluated while running.
// // Returns the events [{event: 'started' | 'canceled' | 'submitted', frame, value}].
// const runLeaderboard = (lb, s) => {
//   const trigger = (part) => parseTrigger(lb.conditions[part].map((group) => group.join('_')).join('S'));
//   const [start, cancel, submit, value] = [trigger('start'), trigger('cancel'), trigger('submit'), parseTrigger(lbValue(lb))];
//   const events = [];
//   let state = 'waiting';
//   s.frames.forEach((memory, i) => {
//     const peek = createPeek(memory);
//     const [startOk, cancelOk, submitOk] = [start.test(peek), cancel.test(peek), submit.test(peek)];
//     const frame = s.frameNumberAt(i);
//     if (state === 'waiting' || state === 'submitted') {
//       if (!startOk) state = 'active';
//       return;
//     }
//     if (state === 'active') {
//       if (!startOk) return;
//       state = 'started';
//       value.reset();
//       events.push({event: 'started', frame});
//     }
//     value.test(peek);
//     if (cancelOk) {
//       state = 'active';
//       events.push({event: 'canceled', frame});
//     } else if (submitOk) {
//       state = 'submitted';
//       events.push({event: 'submitted', frame, value: value.measuredValue});
//     }
//   });
//   return events;
// };
//
// describe('Leaderboard: High Score', () => {
//   const lb = leaderboard('High Score');
//
//   test('submits the score on game over', () => {
//     const s = scenario('level1-game-over');
//
//     expect(runAchievement(lbTrigger(lb, 'start'), s).triggeredFrame).toBe(s.marker('game-over'));
//     expect(runLeaderboard(lb, s)).toEqual([
//       {event: 'started', frame: s.marker('game-over')},
//       {event: 'submitted', frame: s.marker('game-over'), value: 10},
//     ]);
//   });
//
//   test('submits the score when the game is beaten', () => {
//     const s = scenario('game-completed-forced');
//
//     expect(runLeaderboard(lb, s)).toEqual([
//       {event: 'started', frame: s.marker('game-beaten')},
//       {event: 'submitted', frame: s.marker('game-beaten'), value: 1234},
//     ]);
//   });
//
//   test('does not submit on a soft reset', () => {
//     const s = scenario('level1-soft-reset');
//
//     expect(runLeaderboard(lb, s)).toEqual([]);
//   });
// });
//
// describe('Leaderboard: Speedrun', () => {
//   const lb = leaderboard('Speedrun');
//
//   test('starts on the first gameplay frame of a new game', () => {
//     const s = scenario('game-completed-forced');
//     const result = runAchievement(lbTrigger(lb, 'start'), s);
//
//     expect(result.triggeredFrame).toBe(s.marker('level1-start'));
//   });
//
//   test('submits the frames from level 1 start until the T-1000 is beaten', () => {
//     const s = scenario('game-completed-forced');
//     const result = runAchievement(lbTrigger(lb, 'submit'), s);
//
//     expect(result.triggeredFrame).toBe(s.marker('game-beaten'));
//     expect(runLeaderboard(lb, s)).toEqual([
//       {event: 'started', frame: s.marker('level1-start')},
//       {event: 'submitted', frame: s.marker('game-beaten'), value: s.marker('game-beaten') - s.marker('level1-start') + 1},
//     ]);
//   });
//
//   test('pauses are counted', () => {
//     const s = scenario('level1-game-over');
//     const result = runAchievement(lbValue(lb), s);
//
//     expect(result.measuredAt(s.marker('pause-end')) - result.measuredAt(s.marker('pause-start')))
//       .toBe(s.marker('pause-end') - s.marker('pause-start'));
//   });
//
//   test('cancels on game over', () => {
//     const s = scenario('level1-game-over');
//
//     expect(runLeaderboard(lb, s)).toEqual([
//       {event: 'started', frame: s.marker('level1-start')},
//       {event: 'canceled', frame: s.marker('game-over')},
//     ]);
//   });
//
//   test('cancels on a soft reset and restarts with the new game', () => {
//     const s = scenario('level1-soft-reset');
//
//     expect(runLeaderboard(lb, s)).toEqual([
//       {event: 'started', frame: s.marker('level1-start')},
//       {event: 'canceled', frame: s.marker('level1-reinit')},
//       {event: 'started', frame: s.marker('level1-restart')},
//     ]);
//   });
// });
