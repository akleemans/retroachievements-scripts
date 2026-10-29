import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import {parseTrigger, createPeek} from 'cruncheevos-playtest';
import set from './terminator2.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

describe('Progression: Level 1', () => {
  const cheevo = achievement('Kill the Hunter Killer');

  test('pops when level 1 is finished', () => {
    const s = scenario('level1-finished');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(true);
    expect(result.triggeredFrame).toBe(s.marker('level-finished'));
  });

  // test('does not pop on different level', () => {
  //   const s = scenario('level2-finished');
  //   const result = runAchievement(cheevo, s);
  //
  //   expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
  //   expect(result.triggered).toBe(false);
  // });
});
