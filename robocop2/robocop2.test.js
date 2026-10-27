import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './robocop2.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Stage 1', () => {
  const cheevo = achievement('Officer OCP001, Come In!');

  test('pops Stage 1 is finished', () => {
    const s = scenario('stage1-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });

  test('does not pop Stage 2', () => {
    const s = scenario('stage2-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

describe('Progression: Stage 2', () => {
  const cheevo = achievement('Machine Wars');

  test('pops Stage 2 is finished', () => {
    const s = scenario('stage2-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });
});


describe('Progression: Stage 3', () => {
  const cheevo = achievement('Psychological Interference');

  test('pops Stage 3 is finished', () => {
    const s = scenario('stage3-finish-unsolved');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });
});

describe('Progression: Stage 15, beat the game', () => {
  const cheevo = achievement(`"This will be your Ultimate Battle!"`);

  test('pops Stage 15 is finished', () => {
    const s = scenario('stage15-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });
});
