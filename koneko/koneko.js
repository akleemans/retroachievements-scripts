import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 6821, title: 'Koneko Monogatari: The Adventures of Chatran'});

// Addresses and helpers
//const season = 0x0705; // 1-4
const month = 0x0706; // 1-12
const timeOfDay = 0x0707; // 1-2
const lives = 0x0704;

const progression = (sceneId) => {
  const expectedMonth = Math.floor(sceneId / 2) + 1;
  if (sceneId % 2 === 1) {
    // For odd scenes, check time of day increase
    return [
      ['', 'Mem', '8bit', month, '=', 'Value', '', expectedMonth],
      ['', 'Delta', '8bit', timeOfDay, '=', 'Value', '', 1],
      ['', 'Mem', '8bit', timeOfDay, '=', 'Value', '', 2],
    ];
  } else {
    // For even scenes, check month increase
    return [
      ['', 'Mem', '8bit', timeOfDay, '=', 'Value', '', 1],
      ['', 'Delta', '8bit', month, '=', 'Value', '', expectedMonth - 1],
      ['', 'Mem', '8bit', month, '=', 'Value', '', expectedMonth],
    ];
  }
};

const infiniteLivesCheatProtection = () => {
  return [
    // Pause if levels ever was 99
    ['PauseIf', 'Mem', '8bit', lives, '=', 'Value', '', 99, 1],
  ];
};

const continueCheatProtection = () => {
  return [
    // Pause if levels was reset from 0 to 5 while not at start
    ['OrNext', 'Mem', '8bit', month, '!=', 'Value', '', 1],
    ['AndNext', 'Mem', '8bit', timeOfDay, '!=', 'Value', '', 1],
    ['AndNext', 'Delta', '8bit', lives, '=', 'Value', '', 0],
    ['PauseIf', 'Mem', '8bit', lives, '=', 'Value', '', 5, 1],
  ];
};

const levelSelectReset = () => {
  return [
    // Reset on game start (init will be 0 lives at month 1 and time of day 1)
    ['AndNext', 'Mem', '8bit', month, '=', 'Value', '', 1],
    ['AndNext', 'Mem', '8bit', timeOfDay, '=', 'Value', '', 1],
    ['ResetIf', 'Mem', '8bit', lives, '=', 'Value', '', 0],
  ];
};

/* ========= PROGRESSION ========= */

set.addAchievement({
  title: 'Spring Kitten',
  description: 'Clear stage 3',
  points: 3,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(3),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
  title: 'Spring Is Over',
  description: 'Clear stage 6',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(6),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...levelSelectReset(),
    ),
  },
});

export default set;
