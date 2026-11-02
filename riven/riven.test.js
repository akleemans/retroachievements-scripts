import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './riven.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));

const bootScenarios = [
  'start-game-usa',
  'start-game-europe',
  'start-game-france',
  'start-game-germany',
  'start-game-japan',
  'start-game-usa-disc-2',
];

describe('WARNING', () => {
  const cheevo = achievement('WARNING');

  for (const name of bootScenarios) {
    test(`pops before the title screen: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('flags-initialized'));
      expect(result.triggeredFrame).toBeLessThan(s.marker('title-screen'));
    });
  }
});

const findChoScenarios = [
  'temple-find-cho',
  'temple-find-cho-france',
  'temple-find-cho-japan',
  'temple-find-cho-europe',
  'temple-find-cho-germany',
];

describe('Find Cho', () => {
  const cheevo = achievement('Find Cho');

  for (const name of findChoScenarios) {
    test(`pops when cho is found: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('cho-found'));
    });
  }

  test('does not pop if Cho disappeared', () => {
    const s = scenario('temple-cho-disappeared-germany');
    const result = runAchievement(cheevo, s);

    expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
    expect(result.triggered).toBe(false);
  });
});

const inspectArtScenarios = [
  // 'temple-inspect-all-art-displays',
  'temple-inspect-all-art-displays-germany',
];

describe('The Chapel', () => {
  const cheevo = achievement('The Chapel');

  for (const name of inspectArtScenarios) {
    test(`pops when all art is inspected: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.measuredAt(s.marker('first-art-inspected') )).toBe(1);
      expect(result.triggered).toBe(true);
      expect(result.measuredAt(s.marker('last-beetle-inspected') - 1)).toBe(4);
      expect(result.triggeredFrame).toBe(s.marker('last-beetle-inspected'));
    });
  }
});

const solveRotatingRoomScenarios = [
  'temple-rotating-room',
  'temple-rotating-room-france',
  'temple-rotating-room-germany',
  'temple-rotating-room-japan',
  // 'temple-rotating-room-europe',
];

describe('Rotating Room', () => {
  const cheevo = achievement('Outsmart the Gate');

  for (const name of solveRotatingRoomScenarios) {
    test(`pops when rotating room is solved: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('rotating-room-solved'));
    });
  }
});

const maglevToJungleScenarios = [
  'temple-maglev-to-jungle',
  'temple-maglev-to-jungle-france',
  'temple-maglev-to-jungle-germany',
  'temple-maglev-to-jungle-japan',
  // 'temple-maglev-to-jungle-europe',
];

describe('Jungle Island', () => {
  const cheevo = achievement('Jungle Island');

  for (const name of maglevToJungleScenarios) {
    test(`pops when going off for Jungle Island: ${name}`, () => {
      const s = scenario(name);
      const result = runAchievement(cheevo, s);

      expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
      expect(result.triggered).toBe(true);
      expect(result.triggeredFrame).toBe(s.marker('departing-maglev'));
    });
  }
});
