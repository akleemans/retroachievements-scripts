import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './bubble-ghost.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Beat the game', () => {
  const cheevo = achievement('Free as a Bubble');

  test('pops when game is beaten', () => {
    const s = scenario('hall35-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('stage-finished'));
  });
});

describe('Get 50k score', () => {
  const cheevo = achievement('50K');

  test('pops when score is reached', () => {
    const s = scenario('hall34-50k-new');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('50k-reached'));
  });
});

describe('Get 100k score', () => {
  const cheevo = achievement('100K');

  test('pops when score is reached', () => {
    const s = scenario('hall34-100k-new');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('100k-reached'));
  });
});

describe('Get 6 Lives', () => {
  const cheevo = achievement('6 lives');

  test('pops with 6 lives', () => {
    const s = scenario('lives6');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('6-lives-reached'));
  });
});
