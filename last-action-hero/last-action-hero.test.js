import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './last-action-hero.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Fire Extinguisher', () => {
  const cheevo = achievement('Fire Extinguisher');

  test('pops when the flame is extinguished', () => {
    const s = scenario('scene1-extinguish-fire');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('fire-extinguished'));
  });

  test('does not pop when finishing Scene 1', () => {
    const s = scenario('scene1-finished');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Jack Norris', () => {
  const cheevo = achievement('Jack Norris');

  test('pops when an enemy is defeated with a roundhouse kick', () => {
    const s = scenario('scene1-enemy-roundhouse-kick');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('enemy-defeated'));
  });

  test('pops when an enemy in another slot is defeated with a roundhouse kick', () => {
    const s = scenario('scene1-other-enemy-roundhouse-kick');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('enemy-defeated'));
  });

  test('pops when an enemy is punched first and defeated with a roundhouse kick (5 to 7 hits)', () => {
    const s = scenario('scene1-enemy-punching');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('enemy-defeated'));
  });

  test('does not pop when enemy slots are cleared on scene change', () => {
    const s = scenario('scene1-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 1', () => {
  const cheevo = achievement('Inside the School');

  test('pops when Scene 1 is finished', () => {
    const s = scenario('scene1-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when Scene 2 is finished', () => {
    const s = scenario('scene2-finished-no-damage');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Faster than the Hollywood Police', () => {
  const cheevo = achievement('Faster than the Hollywood Police');

  test('pops when Scene 1 is finished with 50+ seconds left', () => {
    const s = scenario('scene1-finished-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when too slow', () => {
    const s = scenario('scene1-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.stateAt(s.marker('time-below-50'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 2', () => {
  const cheevo = achievement('On the Roof');

  test('pops when Scene 2 is finished', () => {
    const s = scenario('scene2-finished-no-damage');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('pops when Scene 2 is finished after dying', () => {
    const s = scenario('scene2-finished-after-dying-first');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });
});

describe('Rip Swings a Mean Axe', () => {
  const cheevo = achievement('Rip Swings a Mean Axe');

  test('pops when the Ripper is beaten without taking damage', () => {
    const s = scenario('scene2-finished-no-damage');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when damage taken, resets after losing a life', () => {
    const s = scenario('scene2-finished-after-dying-first');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('damage-taken'))).toBe('paused');
    expect(result.stateAt(s.marker('died'))).toBe('reset');
    expect(result.stateAt(s.marker('second-life-before-taking-damage'))).toBe('active');
    expect(result.stateAt(s.marker('second-time-taking-damage'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 3', () => {
  const cheevo = achievement('Bonneville Car Chase');

  test('pops when Scene 3 is finished', () => {
    const s = scenario('scene3-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });
});

describe('Full Throttle, Full Health', () => {
  const cheevo = achievement('Full Throttle, Full Health');

  test('pops when the big heart is picked up', () => {
    const s = scenario('scene3-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('heart-picked-up'));
  });

  test('does not pop when Scene 3 is finished without the heart', () => {
    const s = scenario('scene3-finish-no-heart');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop for the big heart in Scene 4', () => {
    const s = scenario('scene4-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Motion-Picture Style', () => {
  const cheevo = achievement('Motion-Picture Style');

  test('pops when Scene 3 is finished with 20+ seconds left', () => {
    const s = scenario('scene3-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when too slow', () => {
    const s = scenario('scene3-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 4', () => {
  const cheevo = achievement('Outside The Subway');

  test('pops when Scene 4 is finished', () => {
    const s = scenario('scene4-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });
});

describe('Subway Sprint', () => {
  const cheevo = achievement('Subway Sprint');

  test('pops when Scene 4 is finished with 15+ seconds left', () => {
    const s = scenario('scene4-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when too slow', () => {
    const s = scenario('scene4-finish-slow');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Crane Climbing', () => {
  const cheevo = achievement('Crane Climbing');

  test('pops when reaching the crane hook at the far left', () => {
    const s = scenario('scene5-crane-hook');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('crane-hook-reached'));
  });

  test('does not pop when jumping off from the elevator', () => {
    const s = scenario('scene5-elevator-jump');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });

  test('does not pop near the left edge in Scene 6', () => {
    const s = scenario('scene6-finish');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 5', () => {
  const cheevo = achievement('Leo\'s Funeral');

  test('pops when Scene 5 is finished', () => {
    const s = scenario('scene5-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });
});

describe('Elevator Action', () => {
  const cheevo = achievement('Elevator Action');

  test('pops when Scene 5 is finished with 100+ seconds left', () => {
    const s = scenario('scene5-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when too slow', () => {
    const s = scenario('scene5-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 6', () => {
  const cheevo = achievement('The Car Chase');

  test('pops when Scene 6 is finished', () => {
    const s = scenario('scene6-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });
});

describe('Mobster Motorcade', () => {
  const cheevo = achievement('Mobster Motorcade');

  test('pops when all tickets are collected with 40+ seconds left', () => {
    const s = scenario('scene6-tickets-collected-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('tickets-collected'));
  });

  test('does not pop when tickets were collected too slowly', () => {
    const s = scenario('scene6-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 7', () => {
  const cheevo = achievement('Premiere Night');

  test('pops when Scene 7 is finished', () => {
    const s = scenario('scene7-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });
});

describe('Jack Slater IV', () => {
  const cheevo = achievement('Jack Slater IV');

  test('pops when Scene 7 is finished with 15+ seconds left', () => {
    const s = scenario('scene7-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when too slow', () => {
    const s = scenario('scene7-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Finish Scene 8', () => {
  const cheevo = achievement('Déjà-vu Experience');

  test('pops when Scene 8 is finished', () => {
    const s = scenario('scene8-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });
});

describe('Just You, Him and a 40-Story Drop', () => {
  const cheevo = achievement('Just You, Him and a 40-Story Drop');

  test('pops when Scene 8 is finished with 20+ seconds left', () => {
    const s = scenario('scene8-finish-fast');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when too slow', () => {
    const s = scenario('scene8-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Win Condition: Beat Benedict', () => {
  const cheevo = achievement('Last of the Action Heroes');

  test('pops when Scene 9 is finished', () => {
    const s = scenario('scene9-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when Scene 8 is finished', () => {
    const s = scenario('scene8-finish');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('No Jump Cuts', () => {
  const cheevo = achievement('No Jump Cuts');

  test('does not lock when pressing B while crouching or taking damage', () => {
    const s = scenario('scene9-crouch-and-press-b');
    const result = runAchievement(cheevo, s);

    expect(result.wasEver('paused')).toBe(false);
  });

  test('pops when Benedict is beaten without jumping, ignoring the intro jump', () => {
    const s = scenario('scene9-no-jumping2');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when jumped', () => {
    const s = scenario('scene9-finished-with-jumping');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('primed');
    expect(result.stateAt(s.marker('jumped'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });
});

describe('To Be or Not to Be', () => {
  const cheevo = achievement('To Be or Not to Be');

  test('pops when the last heart is collected', () => {
    const s = scenario('scene6-last-heart');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('heart-collected'));
  });

  test('does not pop for a heart below the maximum', () => {
    const s = scenario('scene6-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Exceptionally Well Trained', () => {
  const cheevo = achievement('Exceptionally Well Trained');

  test('pops when the game is beaten without using a continue', () => {
    const s = scenario('scene9-no-jumping');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not pop when a continue was used', () => {
    const s = scenario('scene9-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Big-Screen Bandit', () => {
  const cheevo = achievement('Big-Screen Bandit');

  test('pops when a score of 120,000 is reached', () => {
    const s = scenario('score-reaches-120k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('score-reached'));
  });

  test('does not pop below 120,000', () => {
    const s = scenario('scene9-finish');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Game startup', () => {
  // Uninitialized memory at power-on (0xff) is set to 0 on the title screen, then to the starting values in Scene 1
  test.each(Object.values(set.achievements).map((a) => [a.title, a]))('%s does not pop on a fresh boot', (title, cheevo) => {
    const s = scenario('game-startup');
    const result = runAchievement(cheevo, s);

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
  if (/[<>=!]/.test(measured)) {
    conditions.push(`${measured}.4294967295.`);
  } else {
    // Modified value (e.g. score * 100) can't take a comparison, move it to an AddSource
    conditions.push(measured.replace(/^M:/, 'A:'), 'M:0>=4294967295');
  }
  return conditions.join('_');
};

describe('Leaderboard: High Score', () => {
  const lb = leaderboard('High Score');

  test('starts/submits when the game is beaten', () => {
    const s = scenario('scene9-finish');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('scene-finished'));
  });

  test('does not start when Scene 8 is finished', () => {
    const s = scenario('scene8-finish');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggered).toBe(false);
  });

  test('submits the score', () => {
    const s = scenario('scene9-finish');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('scene-finished'))).toBe(93200);
  });
});
