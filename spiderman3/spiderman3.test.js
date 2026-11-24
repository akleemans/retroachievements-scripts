import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './spiderman3.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Ride a skateboard for 5 seconds', () => {
  const cheevo = achievement('Way before THPS2');

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
    expect(result.stateAt(s.marker('score-reset'))).toBe('active');
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
    // new game: stageId 0, lives 3, score 0 -> ResetNextIf clears the lock ('reset' for one frame)
    expect(result.stateAt(s.marker('score-reset'))).toBe('reset');
    expect(result.stateAt(s.marker('score-reset') + 1)).toBe('primed');
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
  const cheevo = achievement('Ain\'t Got Time For Autoscrollers');

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
