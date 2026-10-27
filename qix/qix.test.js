import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './qix.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Clear 99%', () => {
  const cheevo = achievement('Master Coverer');

  test('pops when 99% is covered', () => {
    const s = scenario('cover-99-percent');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('99-percent-covered'));
  });
});

describe('Split Qix', () => {
  const cheevo = achievement('Qix Splitter');

  test('pops when multiplier is 2', () => {
    const s = scenario('stage5-before-split');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('multiplier2'));
  });
});

describe('Double Qix Splitter', () => {
  const cheevo = achievement('Double Qix Splitter');

  test('pops when multiplier is 3', () => {
    const s = scenario('stage6-before-split');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('multiplier3'));
  });
});
