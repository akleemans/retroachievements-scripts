import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 6821, title: 'Koneko Monogatari: The Adventures of Chatran'});

// Addresses and helpers


/* ========= PROGRESSION ========= */

const progression = (levelId) => {
  return [
    // // Pop on reaching score screen in correct level, with max level = current level (will be incremented later, on save game screen)
    // // This is also save-protection - must just have finished the level and reached score screen
    // ['', 'Mem',   '8bit', maxLevelUnlocked, '=', 'Value', '', levelId],
    // ['', 'Mem',   '8bit', currentLevel,     '=', 'Value', '', levelId],
    // ['', 'Delta', '8bit', gameState,        '=', 'Value', '', GameStateEnum.InGame],
    // ['', 'Mem',   '8bit', gameState,        '=', 'Value', '', GameStateEnum.ScoreScreen],
  ];
};

set.addAchievement({
  title: 'Spring Kitten',
  description: 'Clear stage 3',
  points: 3,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(3),
      // ...invincibilityCheatProtection(),
      // ...skipLevelCheatProtection(),
    ),
    // alt1: $(
    //   // Reset has to be in a separate alt (and PauseIf can't be), because the reset will not trigger if
    //   // the Pause in the same group has accumulated a hit
    //   ...levelSelectReset(),
    // ),
  },
});

export default set;
