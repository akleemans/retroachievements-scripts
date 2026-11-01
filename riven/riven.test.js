import {describe, test, expect} from 'vitest';
import {loadScenario, runAchievement} from 'cruncheevos-playtest/testing';
import set from './riven.js';

const achievement = (title) => Object.values(set.achievements).find((a) => a.title === title);
const scenario = (name) => loadScenario(new URL(`./scenarios/${name}`, import.meta.url));


const findChoScenarios = [
  'dome-find-cho',
  'dome-find-cho-france',
  'dome-find-cho-japan',
  'dome-find-cho-europe',
  'dome-find-cho-germany',
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

  // TODO add after later part of game is unlocked where cho disappeared by the game's logic
  // test('does not pop if Cho disappeared', () => {
  //   const s = scenario('dome-cho-disappeared');
  //   const result = runAchievement(cheevo, s);
  //
  //   expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
  //   expect(result.triggered).toBe(false);
  // });
});

// TODO
// const inspectArtScenarios = [
//   'dome-inspect-all-art-displays',
// ];
//
// describe('The Chapel', () => {
//   const cheevo = achievement('The Chapel');
//
//   for (const name of inspectArtScenarios) {
//     test(`pops when all art is inspected: ${name}`, () => {
//       const s = scenario(name);
//       const result = runAchievement(cheevo, s);
//
//       expect(result.stateAt(s.marker('scenario-start'))).toBe('active');
//       expect(result.triggered).toBe(true);
//       expect(result.triggeredFrame).toBe(s.marker('last-beetle-inspected'));
//     });
//   }
// });

const solveRotatingRoomScenarios = [
  'dome-rotating-room',
  'dome-rotating-room-france',
  // 'dome-rotating-room-japan',
  // 'dome-rotating-room-europe',
  // 'dome-rotating-room-germany',
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

