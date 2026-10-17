import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 6821, title: 'Koneko Monogatari: The Adventures of Chatran'});

// Addresses and helpers
const season = 0x0705; // 1-4
const month = 0x0706; // 1-12
const timeOfDay = 0x0707; // 1-2

/* ========= PROGRESSION ========= */

const progression = (sceneId) => {
  // TODO handle even/odd differently

  return [
    ['', 'Mem',   '8bit', month, '=', 'Value', '', 2],
    ['', 'Delta', '8bit', timeOfDay, '=', 'Value', '', 1],
    ['', 'Mem',   '8bit', timeOfDay, '=', 'Value', '', 2],
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
    ),
    // TODO cheat-protection
    // alt1: $(
    //   // Reset has to be in a separate alt (and PauseIf can't be), because the reset will not trigger if
    //   // the Pause in the same group has accumulated a hit
    //   ...levelSelectReset(),
    // ),
  },
});

export default set;
