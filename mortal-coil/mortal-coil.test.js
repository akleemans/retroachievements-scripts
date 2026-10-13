import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './mortal-coil.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Beat Level 6', () => {
  const cheevo = achievement('Filling It Up');

  test('pops when level 6 is finished', () => {
    const s = scenario('finish-level-6');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-solved'));
  });

  test('does not pop when player is stuck', () => {
    const s = scenario('level-6-stuck');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });

  test('does not pop for level 7', () => {
    const s = scenario('level-7-finish');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('level-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});
