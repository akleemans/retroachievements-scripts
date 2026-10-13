import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 45174, title: 'Mortal Coil'});

// Addresses and helpers
const currentLevel = 0xD001;
const isSolved = 0xD003;

/* ========= PROGRESSION ========= */

const progression = (levelId) => {
  return [
    ['', 'Mem',   '8bit', currentLevel,     '=', 'Value', '', levelId],
    ['', 'Delta', '8bit', isSolved,        '=', 'Value', '', 0],
    ['', 'Mem',   '8bit', isSolved,        '=', 'Value', '', 1],
  ];
};

set.addAchievement({
  title: 'Filling It Up',
  description: 'Beat level 3',
  points: 2,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(6),
    ),
  },
});



export default set;
