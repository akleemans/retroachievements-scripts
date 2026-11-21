import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './spiderman3.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Ride a skateboard for 5 seconds', () => {
  const cheevo = achievement('Way before THPS2');

  // first ride: score ticks +1 every frame from 4525 to 4882 (one board, no gap)
  const fiveSecondsIn = 4525 + (5 * 60) - 1;

  test('pops after 300 riding frames', () => {
    const s = scenario('stage1-1-ride-skateboard');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.measuredAt(4524)).toBe(0);
    expect(result.measuredAt(4600)).toBe(4600 - 4525 + 1);
    expect(result.triggeredFrame).toBe(fiveSecondsIn);
  });

  test('does not pop on the 1-3 time bonus', () => {
    const s = scenario('stage1-3-finished2');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });
});

describe('No innocents hit', () => {
  const cheevo = achievement('Friendly Neighborhood Spider-Man');

  // 'primed' (trigger icon) while in 1-1 and not locked
  test('pause lock after hitting an innocent, survives death and respawn', () => {
    const s = scenario('stage1-1-harm-innocent-civilians');
    const result = runAchievement(cheevo, s);

    const innocentHit = 6598; // score 1027 -> 1012
    const respawned = 7399; // died at 7200, stage reloaded (stageId 1 -> 0 -> 1)

    expect(result.stateAt(innocentHit - 1)).toBe('primed');
    expect(result.stateAt(innocentHit)).toBe('paused');
    expect(result.stateAt(respawned)).toBe('paused');
    expect(result.stateAt(s.lastFrame)).toBe('paused');
  });

  test('score reset on game over does not lock', () => {
    const s = scenario('stage1-3-game-over');
    const result = runAchievement(cheevo, s);

    // new game: score 0 and lives 3 on the same frame. ResetNextIf is true then, which also keeps
    // the PauseIf from being true on that frame
    const scoreReset = 21732;
    const newGameStarted = 22264; // stageId 0 -> 1

    // in 1-3 / game over screen: no trigger icon, but not locked either
    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.stateAt(scoreReset)).toBe('active');
    expect(result.stateAt(newGameStarted)).toBe('primed');
  });

  test('trigger icon only shows once 1-1 starts, not on start-up', () => {
    const s = scenario('game-start-up');
    const result = runAchievement(cheevo, s);

    const stage1_1Started = 1626; // stageId 0 -> 1

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.stateAt(stage1_1Started - 1)).toBe('active');
    expect(result.stateAt(stage1_1Started)).toBe('primed');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on the 1-3 clear', () => {
    const s = scenario('stage1-3-finished2');
    const result = runAchievement(cheevo, s);

    expect(result.triggered).toBe(false);
  });

  test('pause lock is released on game over', () => {
    const s = scenario('stage1-1-harm-innocent-and-game-over');
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
    const s = scenario('stage1-1-harm-no-innocent');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('primed');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });
});

describe('Progression: Beat Stage 1-3', () => {
  const cheevo = achievement('Marked for Death');

  test('pops on the time bonus screen after beating the boss', () => {
    const s = scenario('stage1-3-finished2');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('pops when jumping down after beating the boss', () => {
    const s = scenario('stage1-3-boss-defeated-then-jumped-down');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.triggeredFrame).toBe(s.marker('score-screen'));
  });

  test('does not pop on death', () => {
    const s = scenario('stage1-3-died');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop on game over', () => {
    const s = scenario('stage1-3-game-over');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop when the timer runs out', () => {
    const s = scenario('stage1-3-timer-ended');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.firstFrame)).toBe('active');
    expect(result.triggered).toBe(false);
  });
});
