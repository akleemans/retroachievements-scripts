import {AchievementSet, define as $} from '@cruncheevos/core';
const set = new AchievementSet({gameId: 4967, title: 'QIX'});

const percentageCovered = 0xc640;
const multiplier = 0xc63f;
// const stageNumber = 0xc63b; // Starts at 0
const lives = 0xc642;
const demoFlag = 0xc65f; // 0 = Not in demo mode

set.addAchievement({
  id: 13018,
  badge: '12902',
  title: 'Master Coverer',
  description: 'Clear a stage with 99% of the area covered.',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', lives,    '>', 'Value', '', 0],
    ['', 'Mem', '8bit', demoFlag, '=', 'Value', '', 0],
    ['', 'Delta', '8bit', percentageCovered, '<',  'Value', '', 99],
    ['', 'Mem',   '8bit', percentageCovered, '>=', 'Value', '', 99],
  ),
});

const achieveMultiplier = (multiplierNr) => {
  return [
    ['', 'Mem', '8bit', lives,    '>', 'Value', '', 0],
    ['', 'Mem', '8bit', demoFlag, '=', 'Value', '', 0],
    ['', 'Delta', '8bit', multiplier,  '<',  'Value', '', multiplierNr],
    ['', 'Mem',   '8bit', multiplier,  '>=', 'Value', '', multiplierNr],
  ];
};

set.addAchievement({
  id: 13022,
  badge: '12910',
  title: 'Qix Splitter',
  description: 'Split two Qix.',
  points: 5,
  conditions: $(
    ...achieveMultiplier(2),
  ),
});

set.addAchievement({
  id: 13023,
  badge: '12911',
  title: 'Double Qix Splitter',
  description: 'Split two Qix two stages in a row.',
  points: 5,
  conditions: $(
    ...achieveMultiplier(3),
  ),
});

set.addAchievement({
  id: 13024,
  badge: '12912',
  title: 'Triple Qix Splitter',
  description: 'Split two Qix three stages in a row.',
  points: 10,
  conditions: $(
    ...achieveMultiplier(4),
  ),
});

set.addAchievement({
  id: 13025,
  badge: '12913',
  title: 'Quadruple Qix Splitter',
  description: 'Split two Qix four stages in a row.',
  points: 10,
  conditions: $(
    ...achieveMultiplier(5),
  ),
});


/* ------------------------------ */


set.addAchievement({
  id: 13017,
  badge: '12903',
  title: 'Covering Off',
  description: 'Clear a stage with at least 90% of the area covered.',
  points: 5,
  conditions: $(
    ['', 'Mem', '8bit', 0xc640, '>=', 'Value', '', 90],
    ['', 'Mem', '8bit', 0xc640, '<=', 'Value', '', 99],
  ),
});

set.addAchievement({
  id: 13020,
  badge: '12905',
  title: 'Ooo....fireworks!',
  description: 'Clear Stage 4.',
  points: 5,
  type: 'progression',
  conditions: $(
    ['',        'Mem',   '8bit',  0xc63b, '=', 'Value', '', 4, 60],
    ['',        'Delta', '32bit', 0xc63b, '=', 'Value', '', 3, 60],
    ['',        'Mem',   '8bit',  0xc640, '>', 'Value', '', 0],
    ['ResetIf', 'Mem',   '32bit', 0xdfc0, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  id: 13021,
  badge: '12906',
  title: 'More fireworks!',
  description: 'Clear Stage 8.',
  points: 5,
  type: 'progression',
  conditions: $(
    ['',        'Mem',   '8bit',  0xc63b, '=', 'Value', '', 8, 60],
    ['',        'Delta', '32bit', 0xc63b, '=', 'Value', '', 7, 60],
    ['',        'Mem',   '8bit',  0xc640, '>', 'Value', '', 0],
    ['ResetIf', 'Mem',   '32bit', 0xdfc0, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  id: 13364,
  badge: '13170',
  title: 'Even more fireworks!',
  description: 'Clear Stage 12.',
  points: 10,
  type: 'progression',
  conditions: $(
    ['',        'Mem',   '8bit',  0xc63b, '=', 'Value', '', 12, 60],
    ['',        'Delta', '32bit', 0xc63b, '=', 'Value', '', 11, 60],
    ['',        'Mem',   '8bit',  0xc640, '>', 'Value', '', 0],
    ['ResetIf', 'Mem',   '32bit', 0xdfc0, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  id: 13365,
  badge: '13171',
  title: 'Guess what? More fireworks!',
  description: 'Clear Stage 16.',
  points: 25,
  type: 'win_condition',
  conditions: $(
    ['',        'Mem',   '8bit',  0xc63b, '=', 'Value', '', 16, 60],
    ['',        'Delta', '32bit', 0xc63b, '=', 'Value', '', 15, 60],
    ['',        'Mem',   '8bit',  0xc640, '>', 'Value', '', 0],
    ['ResetIf', 'Mem',   '32bit', 0xdfc0, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  id: 13019,
  badge: '12904',
  title: 'Viva Mexico....or something.',
  description: 'Earn at least 50000 points.',
  points: 5,
  conditions: {
    core: $(['', 'Mem', '16bit', 0xdfc2, '>=', 'Value', '', 0]),
    alt1: $(['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 50000]),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 1]),
  },
});

set.addAchievement({
  id: 13374,
  badge: '13172',
  title: 'Mario, in Africa? What?',
  description: 'Earn at least 150000 points.',
  points: 10,
  conditions: {
    core: $(['', 'Mem', '8bit', 0xdfc2, '>=', 'Value', '', 2]),
    alt1: $(['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 18928]),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 3]),
  },
});

set.addAchievement({
  id: 13380,
  badge: '13173',
  title: 'Top Of The High Score Table',
  description: 'Earn at least 200000 points.',
  points: 10,
  conditions: {
    core: $(['', 'Mem', '8bit', 0xdfc2, '>=', 'Value', '', 3]),
    alt1: $(
      ['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 3392],
      ['', 'Mem', '8bit',  0xdfc2, '!=', 'Value', '', 15],
    ),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 4]),
  },
});

set.addAchievement({
  id: 13375,
  badge: '13174',
  title: 'Ole!',
  description: 'Earn at least 250000 points.',
  points: 10,
  conditions: {
    core: $(['', 'Mem', '8bit', 0xdfc2, '>=', 'Value', '', 3]),
    alt1: $(['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 53392]),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 4]),
  },
});

set.addAchievement({
  id: 13376,
  badge: '13175',
  title: 'Enchanting snakes, eh, Mario?',
  description: 'Earn at least 300000 points.',
  points: 25,
  conditions: {
    core: $(['', 'Mem', '8bit', 0xdfc2, '>=', 'Value', '', 4]),
    alt1: $(['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 37856]),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 5]),
  },
});

set.addAchievement({
  id: 13377,
  badge: '13176',
  title: 'Don\'t make the dishes fall, Mario!',
  description: 'Earn at least 350000 points.',
  points: 25,
  conditions: {
    core: $(['', 'Mem', '8bit', 0xdfc2, '>=', 'Value', '', 5]),
    alt1: $(['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 22320]),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 6]),
  },
});

set.addAchievement({
  id: 13378,
  badge: '13177',
  title: 'Mario, Now A Royal Guard',
  description: 'Earn at least 400000 points.',
  points: 25,
  conditions: {
    core: $(['', 'Mem', '8bit', 0xdfc2, '>=', 'Value', '', 6]),
    alt1: $(['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 6784]),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 7]),
  },
});

set.addAchievement({
  id: 13379,
  badge: '13178',
  title: 'Qix Master',
  description: 'Earn at least 500000 points.',
  points: 50,
  conditions: {
    core: $(['', 'Mem', '8bit', 0xdfc2, '>=', 'Value', '', 7]),
    alt1: $(['', 'Mem', '16bit', 0xdfc0, '>=', 'Value', '', 41248]),
    alt2: $(['', 'Mem', '8bit', 0xdfc2, '=', 'Value', '', 8]),
  },
});

set.addLeaderboard({
  id: 463,
  title: 'High Score!',
  description: 'Get the highest score!',
  lowerIsBetter: false,
  type: 'SCORE',
  conditions: {
    start: $(
      ['', 'Mem', '8bit', 0xdfc0, '=',  'Value', '', 0],
      ['', 'Mem', '8bit', 0xdfc1, '=',  'Value', '', 0],
      ['', 'Mem', '8bit', 0xdfc2, '=',  'Value', '', 0],
      ['', 'Mem', '8bit', 0xc63b, '=',  'Value', '', 0],
      ['', 'Mem', '8bit', 0xc642, '=',  'Value', '', 3],
      ['', 'Mem', '8bit', 0xc65f, '!=', 'Value', '', 1],
    ),
    cancel: $(['', 'Delta', '8bit', 0xc65f, '<', 'Mem', '8bit', 0xc65f]),
    submit: $(['', 'Mem', '8bit', 0xc642, '=', 'Value', '', 0]),
    value: $(
      ['AddSource', 'Mem', '8bit', 0xdfc0],
      ['AddSource', 'Mem', '8bit', 0xdfc1, '*', 'Value', '', 256],
      ['Measured',  'Mem', '8bit', 0xdfc2, '*', 'Value', '', 65536],
    ),
  },
});

export default set;
