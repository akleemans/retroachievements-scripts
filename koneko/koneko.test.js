import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './koneko.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Beat Scene 3', () => {
  const cheevo = achievement('Sunny Start');

  test('pops when scene 3 is finished', () => {
    const s = scenario('scene3-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 1', () => {
    const s = scenario('scene1-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does pause if 99 lives cheat was entered, even after death', () => {
    const s = scenario('enter-lives-cheat');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
    expect(result.stateAt(s.marker('cheat-entered'))).toBe('paused');
    expect(result.stateAt(s.marker('died-on-enemy'))).toBe('paused');
  });

  test('does pause if continue cheat was entered', () => {
    const s = scenario('scene3-continue-cheat');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
    expect(result.stateAt(s.marker('cheat-entered'))).toBe('paused');
  });

  test('does reset on game start', () => {
    const s = scenario('game-startup');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
    expect(result.stateAt(s.marker('first-scene-init'))).toBe('reset');
  });
});

describe('Progression: Beat Scene 6', () => {
  const cheevo = achievement('Summer Is Over');

  test('pops when scene 6 is finished', () => {
    const s = scenario('scene6-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 3', () => {
    const s = scenario('scene3-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Scene 9', () => {
  const cheevo = achievement('Falling Leaves');

  test('pops when scene 9 is finished', () => {
    const s = scenario('scene9-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 6', () => {
    const s = scenario('scene6-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Scene 12', () => {
  const cheevo = achievement('Autumn Is Over');

  test('pops when scene 12 is finished', () => {
    const s = scenario('scene12-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 6', () => {
    const s = scenario('scene6-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop for scene 9', () => {
    const s = scenario('scene9-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Scene 15', () => {
  const cheevo = achievement('First Snow');

  test('pops when scene 15 is finished', () => {
    const s = scenario('scene15-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 12', () => {
    const s = scenario('scene12-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Scene 18', () => {
  const cheevo = achievement('Winter Is Over');

  test('pops when scene 18 is finished', () => {
    const s = scenario('scene18-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 15', () => {
    const s = scenario('scene15-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Scene 21', () => {
  const cheevo = achievement('Spring Kitten');

  test('pops when scene 21 is finished', () => {
    const s = scenario('scene21-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 18', () => {
    const s = scenario('scene18-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Win: Beat Scene 24', () => {
  const cheevo = achievement('Reunited with Shiro');

  test('pops when scene 24 is finished and the ending starts', () => {
    const s = scenario('scene24-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not pop for scene 21', () => {
    const s = scenario('scene21-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Pest Control', () => {
  const cheevo = achievement('Pest Control');

  test('pops after defeating 10 enemies in one scene', () => {
    const s = scenario('pest-control-10-kills');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.measuredAt(s.marker('scenario-start'))).toBe(0);
    expect(result.triggered).toBe(true);

    expect(result.measuredAt(s.marker('2-enemies-killed'))).toBe(2);
    expect(result.triggeredFrame).toBe(s.marker('tenth-kill'));
  });

  test('does not pop if dying in between', () => {
    const s = scenario('pest-control-death');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.measuredAt(s.marker('scenario-start'))).toBe(0);
    expect(result.triggered).toBe(false);

    expect(result.measuredAt(s.marker('killed-enemy'))).toBe(1);
    expect(result.measuredAt(s.marker('after-death'))).toBe(0);
  });

  test('does not increment measured if no enemies killed', () => {
    const s = scenario('pest-control-no-killing');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.measuredAt(s.marker('scenario-start'))).toBe(0);
    expect(result.triggered).toBe(false);

    expect(result.measuredAt(s.marker('scenario-end'))).toBe(0);
  });
});

describe('Good Boy', () => {
  const cheevo = achievement('Good Boy');

  test('pops when Poo-suke is alive for 10 seconds', () => {
    const s = scenario('poosuke-long-run');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('twenty-seconds'));
  });

  test('does not pop when Poo-suke despawns early', () => {
    const s = scenario('poosuke-short-run');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);

    expect(result.measuredAt(s.marker('5-seconds'))).toBe(300);
  });
});

describe('Bear Trouble', () => {
  const cheevo = achievement('Bear Trouble');

  test('pops when getting past Blacky', () => {
    const s = scenario('bear-passed');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('goal-reached'));
  });

  test('does not pop when Blacky is defeated', () => {
    const s = scenario('bear-completely-defeated');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Nine Lives, Plus One', () => {
  const cheevo = achievement('Nine Lives, Plus One');

  test('pops when 50 apples give an extra life', () => {
    const s = scenario('apples-extra-life');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('extra-life'));
  });

  test('does not pop for 99 lives cheat', () => {
    const s = scenario('enter-lives-cheat');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('H-E-L-P!', () => {
  const cheevo = achievement('H-E-L-P!');

  test('pops when Poo-suke is summoned with all four letters', () => {
    const s = scenario('help-letters-summon');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('poosuke-summoned'));
  });
});


describe('Source of Power', () => {
  const cheevo = achievement('Source of Power');

  test('pops when drinking milk', () => {
    const s = scenario('milk-collected');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('milk-collected'));
  });

  test('does not pop when summoning Poo-suke', () => {
    const s = scenario('help-letters-summon');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Ooh, It\'s Shiny!', () => {
  const cheevo = achievement('Ooh, It\'s Shiny!');

  test('pops when collecting a golden egg', () => {
    const s = scenario('golden-egg-collected');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('golden-egg-collected'));
  });

  test('does not pop when collecting a white egg', () => {
    const s = scenario('white-egg-collected');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});


describe('Egg Drop', () => {
  const cheevo = achievement('Egg Drop');

  test('pops when defeating an enemy with a white egg', () => {
    const s = scenario('white-egg-kill');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('enemy-defeated'));
  });

  test('does not pop when the egg misses', () => {
    const s = scenario('white-egg-miss');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Purr-fect Score', () => {
  const cheevo = achievement('Purr-fect Score');

  test('pops when score reaches 50,000', () => {
    const s = scenario('kill-fish-reach50k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('50k-score-reached'));
  });
});


describe('Milk Run', () => {
  const cheevo = achievement('Milk Run');

  test('pops when defeating 5 enemies with milk', () => {
    const s = scenario('milk-5-kills');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('fifth-kill'));
  });

  test('does not pop when defeating only 4 enemies with milk', () => {
    const s = scenario('milk-3-kills');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);

    expect(result.measuredAt(s.marker('third-kill'))).toBe(3);
  });
});


describe('Gentle Paws', () => {
  const cheevo = achievement('Gentle Paws');

  test('pops when clearing a scene without defeating an enemy', () => {
    const s = scenario('gentle-paws-finish-scene');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('add-checkpoint-hit'))).toBe('primed');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('goal-reached'));
  });

  test('does not pop when an enemy was defeated', () => {
    const s = scenario('gentle-paws-start-level');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('add-checkpoint-hit'))).toBe('primed');
    expect(result.triggered).toBe(false);

    expect(result.stateAt(s.marker('enemy-kill'))).toBe('reset');
  });

  test('pauses on lives cheat', () => {
    const s = scenario('enter-lives-cheat');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
    expect(result.stateAt(s.marker('cheat-entered'))).toBe('paused');
  });

  test('primes also on first level', () => {
    const s = scenario('gentle-paws-start-of-game');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('add-checkpoint-hit'))).toBe('primed');
    expect(result.triggered).toBe(false);
  });

  test('does not prime on mid-level-checkpoint', () => {
    const s = scenario('gentle-paws-start-from-checkpoint');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('start-from-checkpoint'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Catch of the Day', () => {
  const cheevo = achievement('Catch of the Day');

  test('pops when defeating a red fish', () => {
    const s = scenario('kill-fish-reach50k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('fish-defeated'));
  });

  test('pops when defeating a green fish', () => {
    const s = scenario('kill-green-fish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('fish-defeated'));
  });

  test('does not pop when defeating another enemy', () => {
    const s = scenario('pest-control-10-kills');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Eggcellently Prepared', () => {
  const cheevo = achievement('Eggcellently Prepared');

  test('pops when having 20 eggs', () => {
    const s = scenario('eggs-20');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('20-eggs'));
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

  test('starts/submits on game over', () => {
    const s = scenario('scene3-continue-cheat');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('game-over'));
  });

  test('starts/submits when the game is finished', () => {
    const s = scenario('scene24-finish');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggeredFrame).toBe(s.marker('scene-increase'));
  });

  test('does not start when a scene is finished before the end', () => {
    const s = scenario('scene21-finish');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.triggered).toBe(false);
  });

  test('is paused after infinite lives cheat, even after death', () => {
    const s = scenario('enter-lives-cheat');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('cheat-entered'))).toBe('paused');
    expect(result.stateAt(s.marker('died-on-enemy'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });

  test('is paused after continue cheat', () => {
    // Scenario has a legit game over right before the cheat, so leave out the game over alt
    const [core, , gameFinished] = lb.conditions.start.map((group) => group.map((c) => `${c}`).join('_'));
    const s = scenario('scene3-continue-cheat');
    const result = runAchievement(`${core}S${gameFinished}`, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('cheat-entered'))).toBe('paused');
  });

  test('resets cheat protection on new game', () => {
    const s = scenario('game-startup');
    const result = runAchievement(lbTrigger(lb, 'start'), s);

    expect(result.stateAt(s.marker('first-scene-init'))).toBe('reset');
    expect(result.triggered).toBe(false);
  });

  test('submits the score on game over', () => {
    const s = scenario('scene3-continue-cheat');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('game-over'))).toBe(11960);
  });

  test('submits the score when the game is finished', () => {
    const s = scenario('scene24-finish');
    const result = runAchievement(lbValue(lb), s);

    expect(result.measuredAt(s.marker('scene-increase'))).toBe(115510);
  });
});
