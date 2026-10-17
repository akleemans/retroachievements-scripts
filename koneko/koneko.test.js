import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './koneko.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Beat Scene 3', () => {
  const cheevo = achievement('Spring Kitten');

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
});

describe('Progression: Beat Scene 6', () => {
  const cheevo = achievement('Spring Is Over');

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
