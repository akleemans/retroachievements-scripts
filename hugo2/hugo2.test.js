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
    const s = scenario('ice-cave-deathless');
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

describe('Ice cave hard', () => {
  const cheevo = achievement('Cool Under Pressure');

  test('pops when ice cave level is finished', () => {
    const s = scenario('ice-cave-hard');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop on easy', () => {
    const s = scenario('ice-cave-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Ice cave jumps', () => {
  const cheevo = achievement('Jump Scary');

  test('pops when ice cave level is finished with 31 jumps', () => {
    const s = scenario('ice-cave-jumps3');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('first-jump'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if jumped more than 32 times', () => {
    const s = scenario('ice-cave-jumps');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    // Challenge indicator is shown from the level start until the jump limit is exceeded
    expect(result.stateAt(s.marker('first-jump'))).toBe('primed');
    expect(result.stateAt(s.marker('jump-33'))).toBe('active');
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

  test('does not pop on the soft reset after beating the game', () => {
    // The reset zeroes all RAM: last completed stage 5 -> 0 with stage 0 looks like "Forest completed"
    const s = scenario('beat-game-reset');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
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

  test('pops if died in an earlier stage', () => {
    const s = scenario('die-before-forest-then-forest-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('forest-finished'));
  });

  test('does not pop on the soft reset after beating the game', () => {
    const s = scenario('beat-game-reset');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Forest hard', () => {
  const cheevo = achievement('The Forest Doesn\'t Scare Me');

  test('pops when Forest level is finished', () => {
    const s = scenario('forest-hard');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop on easy', () => {
    const s = scenario('forest-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Forest jumps', () => {
  const cheevo = achievement('Energy Saver');

  test('pops when forest level is finished with 40 jumps', () => {
    const s = scenario('forest-jumps-optimal');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('first-jump'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if finished with 43 jumps', () => {
    const s = scenario('forest-jumps-too-much');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    // Challenge indicator is shown from the level start until the jump limit is exceeded
    expect(result.stateAt(s.marker('first-jump'))).toBe('primed');
    expect(result.stateAt(s.marker('jump-41'))).toBe('active');
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

  test('pops when the Snowboard is the first stage after power-on', () => {
    const s = scenario('beat-snowboard-first');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('snowboard-finished'));
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

  test('does not pop if died in the Snowboard after a deathless Forest', () => {
    const s = scenario('die-before-forest-then-forest-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop if died when the Snowboard is the first stage after power-on', () => {
    const s = scenario('beat-snowboard-first');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('pops when the Snowboard is the first stage after power-on', () => {
    const s = scenario('beat-snowboard-first-no-life-loss');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('snowboard-finished'));
  });
});

describe('Snowboard hard', () => {
  const cheevo = achievement('Board to Perfection');

  test('pops when Snowboard level is finished on hard', () => {
    const s = scenario('snowboard-hard');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop on easy', () => {
    const s = scenario('snowboard-with-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Snowman single shot', () => {
  const cheevo = achievement('Cold Shot');

  test('pops when snowman is defeated with the first shot', () => {
    const s = scenario('snowboard-defeat-snowman');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('snowman-hit'));
  });

  test('does not pop if more than one shot was needed', () => {
    const s = scenario('snowboard-defeat-snowman-multiple-shots');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('pops on a single-shot fight after fights with multiple shots', () => {
    // The 3-shot fight must not leave a shot counted for the next fight
    const s = scenario('die-before-forest-then-forest-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('snowman-hit-3'));
  });

  test('does not pop if every fight needed several shots', () => {
    // Fights with 3, 2 and 4 shots
    const s = scenario('beat-snowboard-first');
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

  test('pops on patched ROM', () => {
    const s = scenario('patched-swimmer');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if cheated', () => {
    const s = scenario('cheated-swimmer');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('stage-finished'))).toBe('active');
    expect(result.triggered).toBe(false);
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

describe('Swimmer hard', () => {
  const cheevo = achievement('Just Keep Swimming');

  test('pops when Swimmer level is finished on hard', () => {
    const s = scenario('swimmer-hard');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop on easy', () => {
    const s = scenario('swimmer-deathless');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Swimmer refills', () => {
  const cheevo = achievement('Hold Your Breath');

  test('pops when Swimmer level is finished with 5 surfacings and 1 death', () => {
    const s = scenario('swimmer-surface1');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('first-surfacing'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop if refilled more than 6 times', () => {
    const s = scenario('patched-swimmer');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    // Challenge indicator is shown from the level start until the refill limit is exceeded
    expect(result.stateAt(s.marker('first-surfacing'))).toBe('primed');
    expect(result.stateAt(s.marker('refill-7'))).toBe('active');
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

  test('pops once when the game is beaten, not again on the soft reset', () => {
    const s = scenario('beat-game-reset');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('game-beaten'));
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

describe('3000 points', () => {
  const cheevo = achievement(`Hugo's Point Extravaganza`);

  test('pops 3000 points reached', () => {
    const s = scenario('score-3000-points');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('score-3000-points'));
  });
});

/* ========= LEADERBOARDS ========= */

const leaderboard = (title) => Object.values(set.leaderboards).find((l) => l.title === title);

// Use LB start/cancel/submit as conditions like achievement
const lbTrigger = (lb, part) => ({conditions: lb.conditions[part]});

// Make value expression parseable as a trigger while measuredAt() still reports the value
const lbValue = (lb) => {
  const groups = lb.conditions.value;
  if (groups.length > 1) throw new Error(`leaderboard "${lb.title}": max-of ($) values are not supported`);
  const conditions = groups[0].map((condition) => `${condition}`);
  const measured = conditions.pop();
  conditions.push(/[<>=!]/.test(measured) ? `${measured}.4294967295.` : `${measured}>=4294967295`);
  return conditions.join('_');
};

describe('Leaderboard: High Score', () => {
  const lb = leaderboard('High Score');

  test('starts/submits when the ending converted all lives into points', () => {
    const s = scenario('witch-game');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('score-tally-finished'));
  });

  test('submits the score', () => {
    const s = scenario('witch-game');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('score-tally-finished'))).toBe(2450);
  });

  test('starts/submits when the ending is reached without remaining lives', () => {
    const s = scenario('finish-without-remaining-life');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('ending-reached'));
  });

  test('submits the score without remaining lives', () => {
    const s = scenario('finish-without-remaining-life');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('ending-reached'))).toBe(2150);
  });

  test('starts/submits on game over', () => {
    const s = scenario('test-game-over');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('game-over'));
  });
});
