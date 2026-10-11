import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './mr-do.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Beat Level 1', () => {
  const cheevo = achievement('Dirt Digger');

  test('pops when level 1 is finished', () => {
    const s = scenario('level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('pops on EUR-ROM', () => {
    const s = scenario('EUR-ROM-level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop when player dies', () => {
    const s = scenario('level01-died');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop for level 02', () => {
    const s = scenario('level02-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Level 3', () => {
  const cheevo = achievement('Dribbler');

  test('pops when level 3 is finished', () => {
    const s = scenario('level03-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });
});

describe('Progression: Beat Level 6', () => {
  const cheevo = achievement('Dropper');

  test('pops when level 6 is finished', () => {
    const s = scenario('level06-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });
});

describe('Progression: Beat Level 9', () => {
  const cheevo = achievement('Dizzy Dorks');

  test('pops when level 9 is finished', () => {
    const s = scenario('level09-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });
});

describe('Progression: Beat Level 10', () => {
  const cheevo = achievement('Delivery');

  test('pops when level 10 is finished', () => {
    const s = scenario('level10-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });
});

describe('Progression: Beat Level 15', () => {
  const cheevo = achievement('Disciplined');

  test('pops when level 15 is finished', () => {
    const s = scenario('level15-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });
});

describe('Progression: Beat Level 20', () => {
  const cheevo = achievement('Mr. Do!');

  test('pops when level 20 is finished', () => {
    const s = scenario('level20-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });
});

describe('Beat Level 10 on Hard', () => {
  const cheevo = achievement('Dexterity');

  test('pops when level 10 is finished on Hard', () => {
    const s = scenario('level10-hard');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop on default difficulty', () => {
    const s = scenario('level10-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Dovish', () => {
  const cheevo = achievement('Dovish');

  test('pops when level 10 is finished without killing enemies', () => {
    const s = scenario('level10-no-enemies-killed');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop if enemy killed', () => {
    const s = scenario('level09-monster-killed');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('monster-killed'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });
});

describe('Diligent', () => {
  const cheevo = achievement('Diligent');

  test('pops when finished level 1 without falling apples', () => {
    const s = scenario('level01-no-falling-apples');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('menu'))).toBe('paused');
    expect(result.stateAt(s.marker('level-start'))).toBe('reset');
    expect(result.stateAt(s.marker('in-level'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop if apple fallen', () => {
    const s = scenario('level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });
});


describe('Disguised', () => {
  const cheevo = achievement('Disguised');

  test('pops when 120+ seconds in level 1', () => {
    const s = scenario('level01-long-survival');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('120-seconds-reached'));
  });

  test('does not pop if died', () => {
    const s = scenario('level01-died-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('died'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });

  test('does not pop if too fast', () => {
    const s = scenario('level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Score 50k', () => {
  const cheevo = achievement('Decent');

  test('pops when score of 50k was reached', () => {
    const s = scenario('level07-score50k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('score-reached'));
  });
});

describe('Score 100k', () => {
  const cheevo = achievement('Devoted');

  test('pops when score of 100k was reached', () => {
    const s = scenario('level18-score100k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('score-reached'));
  });
});

describe('Score 147k', () => {
  const cheevo = achievement('Deck the Duck');

  test('pops when score of 147k was reached', () => {
    const s = scenario('level22-score147k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('score-reached'));
  });
});

describe('Determined', () => {
  const cheevo = achievement('Determined');

  test('pops when finishing level 10 without dying', () => {
    const s = scenario('level10-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop if died in level before', () => {
    const s = scenario('level09-death-then-finish-level10');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('died'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });
});


describe('Dancing', () => {
  const cheevo = achievement('Dancing');

  test('pops when finished levels 1-3 fast enough', () => {
    const s = scenario('level03-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop if too slow', () => {
    const s = scenario('level03-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Dashing', () => {
  const cheevo = achievement('Dashing');

  test('pops when finished levels 4-6 fast enough', () => {
    const s = scenario('level06-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop if too slow', () => {
    const s = scenario('level06-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Darting', () => {
  const cheevo = achievement('Darting');

  test('pops when finished levels 7-9 fast enough', () => {
    const s = scenario('level09-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop if too slow', () => {
    const s = scenario('level09-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Doing It All', () => {
  const cheevo = achievement('Doing It All');

  test('pops when finished whole loop fast enough', () => {
    const s = scenario('level10-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop if too slow', () => {
    const s = scenario('level10-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Daring', () => {
  const cheevo = achievement('Daring');

  test('pops when killed 30 ghost monsters', () => {
    const s = scenario('kill-30-monsters');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.measuredAt(s.marker('scenario-start'))).toBe(0);
    expect(result.measuredAt(s.marker('first-monster-killed'))).toBe(1);

    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('30-monsters-killed'));
    expect(result.measuredAt(s.marker('30-monsters-killed'))).toBe(30);
  });
});

describe('Do-Boy', () => {
  const cheevo = achievement('Do-Boy');

  test('pops when gameboy is collected', () => {
    const s = scenario('level08-collect-gameboy');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('gameboy-collected'));
  });

  test('pops when gameboy is collected in level 24', () => {
    const s = scenario('level24-gameboy');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('gameboy-collected'));
  });

  test('does not pop if other item is collected', () => {
    const s = scenario('level07-item-collected');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Delicate', () => {
  const cheevo = achievement('Delicate');

  test('pops when 5 treats collected', () => {
    const s = scenario('level16-collect-all-treats');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('5-items-collected'));
  });
});

describe('Delish', () => {
  const cheevo = achievement('Delish');

  test('pops when 10 treats collected', () => {
    const s = scenario('level16-collect-all-treats');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('10-items-collected'));
  });
});

describe('Dinner', () => {
  const cheevo = achievement('Dinner');

  test('pops when 16 different treats collected', () => {
    const s = scenario('level16-collect-all-treats');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('16-different-items-collected'));
  });

  test('does not pop on 15 treats collected', () => {
    const s = scenario('level16-collect-15-treats');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Diamond Delight', () => {
  const cheevo = achievement('Diamond Delight');

  test('pops when level finished by collecting diamond', () => {
    const s = scenario('level01-diamond-collected');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('does not pop for eating all cherries', () => {
    const s = scenario('level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Dangerous Dudes', () => {
  const cheevo = achievement('Dangerous Dudes');

  test('pops when level finished defeating baddies', () => {
    const s = scenario('level04-monsters-killed');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('defeated-last-enemy'));
  });

  test('does not pop for eating all cherries', () => {
    const s = scenario('level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Duplication', () => {
  const cheevo = achievement('Duplication');

  test('pops when all EXTRA letters collected', () => {
    const s = scenario('level08-extra-life');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('last-letter-collected'));
  });

  test('does not pop for eating all cherries', () => {
    const s = scenario('level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Delicious Cherries', () => {
  const cheevo = achievement('Delicious Cherries');

  test('pops when level finished by eating all cherries', () => {
    const s = scenario('level01-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('last-cherry-eaten'));
  });

  test('does not pop diamond', () => {
    const s = scenario('level01-diamond-collected');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
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

describe('Leaderboard: Speedrun', () => {
  const lb = leaderboard('Speedrun');

  test('starts/submits when level 10 finished', () => {
    const s = scenario('level10-finish');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('level-increase'));
  });

  test('submits the level timer in frames', () => {
    const s = scenario('level10-finish');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('level-increase'))).toBe(24578);
  });

  test('submits the level timer in frames for fast finish', () => {
    const s = scenario('level10-finish-fast');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('level-increase'))).toBe(14247);
  });
});

describe('Leaderboard: High Score', () => {
  const lb = leaderboard('High Score');

  test('starts/submits on game over', () => {
    const s = scenario('level17-game-over');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('game-over'));
  });

  test('submits the score', () => {
    const s = scenario('level17-game-over');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('game-over'))).toBe(95750);
  });
});