import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './spiderman3.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Ride a skateboard for 5 seconds', () => {
  const cheevo = achievement('Way Before THPS2');

  test('pops after 300 riding frames', () => {
    const s = scenario('stage1_1-ride-skateboard');
    const result = runAchievement(cheevo, s);

    // first ride: score ticks +1 every frame from 'ride-start' to 4882 (one board, no gap)
    const rideStart = s.marker('ride-start');

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.measuredAt(rideStart - 1)).toBe(0);
    expect(result.measuredAt(rideStart + 75)).toBe(76);
    expect(result.triggeredFrame).toBe(rideStart + (5 * 60) - 1);
  });

  test('does not pop on the 1-3 time bonus', () => {
    const s = scenario('stage1_3-finished');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('No innocents hit', () => {
  const cheevo = achievement('Friendly Neighborhood Spider-Man');

  // 'primed' (trigger icon) while in 1-1 and not locked
  test('pause lock after hitting an innocent, survives death and respawn', () => {
    const s = scenario('stage1_1-harm-innocent-civilians');
    const result = runAchievement(cheevo, s);

    // innocent-hit: score 1027 -> 1012; respawned: stage reloaded after death (stageId 1 -> 0 -> 1)
    expect(result.stateAt(s.marker('innocent-hit') - 1)).toBe('primed');
    expect(result.stateAt(s.marker('innocent-hit'))).toBe('paused');
    expect(result.stateAt(s.marker('died'))).toBe('paused');
    expect(result.stateAt(s.marker('respawned'))).toBe('paused');
    expect(result.stateAt(s.lastFrame)).toBe('paused');
  });

  test('score reset on game over does not lock', () => {
    const s = scenario('stage1_3-game-over');
    const result = runAchievement(cheevo, s);

    // in 1-3 / game over screen: no trigger icon, but not locked either
    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(s.marker('score-reset'))).toBe('reset');
    expect(result.stateAt(s.marker('score-reset') + 1)).toBe('active');
    expect(result.stateAt(s.marker('new-game'))).toBe('primed');
  });

  test('trigger icon only shows once 1-1 starts, not on start-up', () => {
    const s = scenario('game-start-up');
    const result = runAchievement(cheevo, s);

    // stage1_1-start: stageId 0 -> 1
    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.stateAt(s.marker('stage1_1-start') - 1)).toBe('active');
    expect(result.stateAt(s.marker('stage1_1-start'))).toBe('primed');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on the 1-3 clear', () => {
    const s = scenario('stage1_3-finished');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });

  test('pause lock is released on game over', () => {
    const s = scenario('stage1_1-harm-innocent-and-game-over');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('innocent-hit') - 1)).toBe('primed');
    expect(result.stateAt(s.marker('innocent-hit'))).toBe('paused');
    expect(result.stateAt(s.marker('score-reset') - 1)).toBe('paused');
    // new game: stageId 0, lives 3, score 0 -> ResetIf in alt1 clears the lock, no trigger icon on the title
    expect(result.stateAt(s.marker('score-reset'))).toBe('reset');
    expect(result.stateAt(s.marker('score-reset') + 1)).toBe('active');
    expect(result.stateAt(s.marker('new-game'))).toBe('primed');
    expect(result.triggered).toBe(false);
  });

  test('pops on the 1-1 time bonus screen without innocents hit', () => {
    const s = scenario('stage1_1-harm-no-innocent');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('primed');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });
});

describe('Progression: Beat Stage 1-3', () => {
  const cheevo = achievement('Marked for Death');

  test('pops on the time bonus screen after beating the boss', () => {
    const s = scenario('stage1_3-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('pops when jumping down after beating the boss', () => {
    const s = scenario('stage1_3-boss-defeated-then-jumped-down');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('does not pop on death', () => {
    const s = scenario('stage1_3-died');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on game over', () => {
    const s = scenario('stage1_3-game-over');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop when the timer runs out', () => {
    const s = scenario('stage1_3-timer-ended');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on the 2-2 clear', () => {
    const s = scenario('stage2_2-finished');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Beat Stage 2-2', () => {
  const cheevo = achievement('Enter Electro');

  test('pops on the time bonus screen after leaving the stage', () => {
    const s = scenario('stage2_2-finished');
    const result = runAchievement(cheevo, s);

    // stage-left: stageId 6 -> 0, score-screen: score starts going up
    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.stateAt(s.marker('stage-left'))).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('does not pop on the 1-3 clear', () => {
    const s = scenario('stage1_3-finished');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('Secret exit in 3-4', () => {
  const cheevo = achievement('Ain\'t Got Time for Autoscrollers');

  test('pops on the time bonus screen after taking the shortcut', () => {
    const s = scenario('stage3_4-shortcut');
    const result = runAchievement(cheevo, s);

    // stage-left: stageId 0x0a -> 0 at map X 28, score-screen: score starts going up
    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.stateAt(s.marker('stage-left'))).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('does not pop on the regular exit', () => {
    const s = scenario('stage3_4-regular-finish');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });

  test('does not pop on death', () => {
    // death in 3-4 reloads the stage via stageId 0x0a -> 0x08 -> 0x0a
    for (const name of ['stage3_4-death', 'stage3_4-death-by-wall']) {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('respawned'))).toBe('active');
      expect(result.triggered).toBe(false);
    }
  });

  test('does not pop on other stage clears', () => {
    for (const name of ['stage1_3-finished', 'stage2_2-finished', 'stage3_5-finished']) {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.triggered).toBe(false);
    }
  });
});

describe('Progression: Beat Stage 3-5', () => {
  const cheevo = achievement('The Scorpion\'s Tale');

  test('pops on the time bonus screen after leaving the stage', () => {
    const s = scenario('stage3_5-finished');
    const result = runAchievement(cheevo, s);

    // boss-knocked-off: +50 score while still in 3-5, stage-left: stageId 0x0b -> 0, score-screen: score starts going up
    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.stateAt(s.marker('boss-knocked-off'))).toBe('active');
    expect(result.stateAt(s.marker('stage-left'))).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('does not pop on other stage clears', () => {
    for (const name of ['stage1_3-finished', 'stage2_2-finished', 'stage3_4-shortcut', 'stage3_4-regular-finish']) {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.triggered).toBe(false);
    }
  });
});

describe('No web shots against the 4-1 bosses', () => {
  const cheevo = achievement('Web of Spider-Man');

  test('trigger icon appears when 4-1 starts', () => {
    const s = scenario('stage3_5-finished');
    const result = runAchievement(cheevo, s);

    // stage-id-blip: stageId 0x0c -> 0 -> 0x0c for one frame right after the stage starts
    expect(result.stateAt(s.marker('score-screen'))).toBe('active');
    expect(result.stateAt(s.marker('stage4_1-start') - 1)).toBe('active');
    expect(result.stateAt(s.marker('stage4_1-start'))).toBe('primed');
    expect(result.stateAt(s.marker('stage-id-blip'))).toBe('primed');
    expect(result.stateAt(s.lastFrame)).toBe('primed');
    expect(result.triggered).toBe(false);
  });

  test('pops on the score screen after beating all three bosses without web shots', () => {
    const s = scenario('stage4_1-bosses-no-web-used');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('primed');
    expect(result.stateAt(s.marker('boss1-beaten'))).toBe('primed');
    expect(result.stateAt(s.marker('boss2-beaten'))).toBe('primed');
    expect(result.stateAt(s.marker('boss3-beaten'))).toBe('primed');
    expect(result.stateAt(s.marker('stage-left'))).toBe('primed');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('pause lock after the first web shot', () => {
    const s = scenario('stage4_1-bosses-web-used');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('web-shot') - 1)).toBe('primed');
    expect(result.stateAt(s.marker('web-shot'))).toBe('paused');
    expect(result.stateAt(s.lastFrame)).toBe('paused');
    expect(result.triggered).toBe(false);
  });

  test('pause lock is released when a life is lost', () => {
    const s = scenario('stage4_1-webshot-then-death');
    const result = runAchievement(cheevo, s);

    // stageId stays 0x0c through the death, only the lives decrement releases the lock
    expect(result.stateAt(s.marker('web-shot') - 1)).toBe('primed');
    expect(result.stateAt(s.marker('web-shot'))).toBe('paused');
    expect(result.stateAt(s.marker('died'))).toBe('paused');
    expect(result.stateAt(s.marker('life-lost') - 1)).toBe('paused');
    expect(result.stateAt(s.marker('life-lost'))).toBe('reset');
    expect(result.stateAt(s.marker('life-lost') + 1)).toBe('primed');
    expect(result.stateAt(s.marker('respawned'))).toBe('primed');
    expect(result.stateAt(s.lastFrame)).toBe('primed');
    expect(result.triggered).toBe(false);
  });

  test('climbing with the web line does not lock', () => {
    const s = scenario('stage4_1-bosses-climb-webshot');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('web-climb'))).toBe('primed');
    expect(result.stateAt(s.lastFrame)).toBe('primed');
  });

  test('no trigger icon on start-up', () => {
    const s = scenario('game-start-up');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.lastFrame)).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on other stage clears', () => {
    for (const name of ['stage1_3-finished', 'stage2_2-finished', 'stage3_4-shortcut', 'stage3_5-finished']) {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.triggered).toBe(false);
    }
  });
});

describe('Progression: Beat Stage 4-2', () => {
  const cheevo = achievement('Deconstruction');

  test('pops on the time bonus screen after beating the Big Bug', () => {
    const s = scenario('stage4_2-finished');
    const result = runAchievement(cheevo, s);

    // big-bug-beaten: +400 score while still in 4-2, stage-left: stageId 0x10 -> 0
    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.stateAt(s.marker('big-bug-beaten'))).toBe('active');
    expect(result.stateAt(s.marker('stage-left'))).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('does not pop on other stage clears', () => {
    for (const name of ['stage1_3-finished', 'stage2_2-finished', 'stage3_5-finished', 'stage4_1-bosses-no-web-used']) {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.triggered).toBe(false);
    }
  });
});

describe('Progression: Beat Stage 5-3', () => {
  const cheevo = achievement('The Ultimate Spider-Slayer Slayer');

  test('pops when the final boss is beaten', () => {
    const s = scenario('stage5_3-finished');
    const result = runAchievement(cheevo, s);

    // boss-beaten: +500 score and stageId 0x0f -> 0 on the same frame, before the time bonus
    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.stateAt(s.marker('boss-beaten') - 1)).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('boss-beaten'));
  });

  test('does not pop on death or game over', () => {
    const s = scenario('stage5_3-death-then-game-over');
    const result = runAchievement(cheevo, s);

    // game-over: stageId 0x0f -> 0 like a clear, but the score only drops (score-reset)
    expect(result.stateAt(s.marker('game-over'))).toBe('active');
    expect(result.stateAt(s.marker('score-reset'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on other stage clears', () => {
    for (const name of ['stage1_3-finished', 'stage2_2-finished', 'stage3_5-finished', 'stage4_1-bosses-no-web-used', 'stage4_2-finished']) {
      const result = runAchievement(cheevo, scenario(name));

      expect(result.triggered).toBe(false);
    }
  });
});

describe('Collect all 5 extra lives', () => {
  const cheevo = achievement('Not-So-Sinister Six');

  test('counts the 1-1 1-up from a new game', () => {
    const s = scenario('collect-life-from-title');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(s.marker('new-game'))).toBe(0);
    expect(result.measuredAt(s.marker('life-collected') - 1)).toBe(0);
    expect(result.measuredAt(s.marker('life-collected'))).toBe(1);
    expect(result.measuredAt(s.lastFrame)).toBe(1);
    expect(result.triggered).toBe(false);
  });

  test('lives set to 3 on a new game do not count', () => {
    // lives go 0 -> 3 on the title screen at start-up and after a game over
    for (const name of ['game-start-up', 'stage1_3-game-over', 'stage5_3-death-then-game-over']) {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.measuredAt(s.lastFrame)).toBe(0);
      expect(result.triggered).toBe(false);
    }
  });

  test('counts a collected 1-up', () => {
    const s = scenario('collect-life');
    const result = runAchievement(cheevo, s);

    // Memory starts at 0, so the first frame of a mid-game recording also counts (lives 0 -> 3)
    expect(result.measuredAt(s.marker('life-collected') - 1)).toBe(1);
    expect(result.measuredAt(s.marker('life-collected'))).toBe(2);
    expect(result.triggered).toBe(false);
  });
});

describe('Collect both power-ups in Stage 2', () => {
  const cheevo = achievement('Orb Hiest');

  test('pops when the 2-2 power-up is collected after the 2-1 one', () => {
    const s = scenario('stage2-collect-both-powerups');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('powerup-2_1'))).toBe('active');
    expect(result.measuredAt(s.marker('stage2_2-start'))).toBe(1);
    expect(result.triggeredFrame).toBe(s.marker('powerup-2_2'));
  });

  test('does not pop with only the 2-1 power-up', () => {
    const s = scenario('collect-life');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(s.lastFrame)).toBe(1);
    expect(result.triggered).toBe(false);
  });
});

describe('Collect both invincibility pickups', () => {
  const cheevo = achievement('Spider-Armor');

  test('counts the 1-2 pickup', () => {
    const s = scenario('stage1_2-with-invincibility');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(s.marker('invincibility-pickup') - 1)).toBe(0);
    expect(result.measuredAt(s.marker('invincibility-pickup'))).toBe(1);
    expect(result.measuredAt(s.lastFrame)).toBe(1);
    expect(result.triggered).toBe(false);
  });

  test('getting hit does not count', () => {
    const s = scenario('stage1_2-no-invincibility');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(s.lastFrame)).toBe(0);
  });

  test('the respawned 4-2 pickup after a death counts only once', () => {
    const s = scenario('stage4_2-invincibility-death');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(s.marker('invincibility-pickup'))).toBe(1);
    expect(result.measuredAt(s.marker('invincibility-pickup-again'))).toBe(1);
    expect(result.measuredAt(s.lastFrame)).toBe(1);
    expect(result.triggered).toBe(false);
  });
});

describe('Reach power 4', () => {
  const cheevo = achievement('Face It, Tiger... You Just Hit the Jackpot');

  test('pops when power goes from 3 to 4', () => {
    const s = scenario('power-level-reach-4');
    const result = runAchievement(cheevo, s);

    expect(result.measuredAt(s.marker('power-4') - 1)).toBe(3);
    expect(result.triggeredFrame).toBe(s.marker('power-4'));
  });

  test('does not pop on lower power-ups', () => {
    const result = runAchievement(cheevo, scenario('stage2-collect-both-powerups'));

    expect(result.triggered).toBe(false);
  });
});

describe('Score of 50,000', () => {
  const cheevo = achievement('Spectacular Spider-Man');

  test('pops when the score reaches 5000 (x10)', () => {
    const s = scenario('score-50k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('stage5_3-cleared') - 1)).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('stage5_3-cleared'));
  });
});

describe('Beat the game without dying', () => {
  const cheevo = achievement('Superior Spider-Man');

  test('pops on the 5-3 clear without a death', () => {
    const s = scenario('stage5_3-finished');
    const result = runAchievement(cheevo, s);

    expect(result.triggeredFrame).toBe(runAchievement(achievement('The Ultimate Spider-Slayer Slayer'), s).triggeredFrame);
  });

  test('pause lock after a lost life', () => {
    // lives are RAM-edited in this recording, but the death is real
    const s = scenario('score-50k');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('life-lost') - 1)).toBe('active');
    expect(result.stateAt(s.marker('life-lost'))).toBe('paused');
    expect(result.stateAt(s.marker('stage5_3-cleared'))).toBe('paused');
    expect(result.triggered).toBe(false);
  });

  test('pause lock is released on a new game', () => {
    const s = scenario('stage5_3-death-then-game-over');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('life-lost'))).toBe('paused');
    // score-reset: title screen with score 0 and 3 lives
    expect(result.stateAt(s.marker('score-reset') - 1)).toBe('paused');
    expect(result.stateAt(s.marker('score-reset'))).toBe('reset');
    expect(result.stateAt(s.marker('new-game'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});
