import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 45174, title: 'Mortal Coil'});

// Addresses and helpers
const state = 0xD000;
const StateEnum = {
  LevelSelect: 1,
  InLevel: 2,
  About: 3,
  EndScreen: 4,
  SecretSplash: 5,
};
const phaseInLevel = 0xD002; // 0: picking start, 1: coiling, 2: solved
const currentLevel = 0xD001;
const isSolved = 0xD003;
const moveCount = 0xD007;
const isClockwise = 0xD008;
const isCounterClockwise = 0xD009;
const isCornerStart = 0xD00A;
const isFinishNearStart = 0xD00B;
const rightMoveCount = 0xD00D;

/* ========= PROGRESSION ========= */

const progression = (levelId, trigger) => {
  return [
    ['',                       'Mem',   '8bit', currentLevel, '=', 'Value', '', levelId],
    ['',                       'Mem',   '8bit', state,        '=', 'Value', '', StateEnum.InLevel],
    ['',                       'Delta', '8bit', isSolved,     '=', 'Value', '', 0],
    [trigger ? 'Trigger' : '', 'Mem',   '8bit', isSolved,     '=', 'Value', '', 1],
  ];
};

set.addAchievement({
  id: 644368,
  badge: '735537',
  title: 'Like a Clock',
  description: 'Solve a level between 3 and 6 inclusive by only turning clockwise',
  points: 1,
  conditions: {
    core: $(
      ['',        'Mem',   '8bit', isClockwise,  '=',  'Value', '', 1],
      ['',        'Mem',   '8bit', currentLevel, '>=', 'Value', '', 3],
      ['',        'Mem',   '8bit', currentLevel, '<=', 'Value', '', 6],
      ['',        'Mem',   '8bit', state,        '=',  'Value', '', StateEnum.InLevel],
      ['',        'Delta', '8bit', isSolved,     '=',  'Value', '', 0],
      ['Trigger', 'Mem',   '8bit', isSolved,     '=',  'Value', '', 1],
    ),
  },
});

set.addAchievement({
  id: 644369,
  badge: '735538',
  title: 'Cornerstone',
  description: 'Solve a level between 4 and 8 inclusive by starting in a corner',
  points: 2,
  conditions: {
    core: $(
      ['',        'Mem',   '8bit', isCornerStart, '=',  'Value', '', 1],
      ['',        'Mem',   '8bit', currentLevel,  '>=', 'Value', '', 4],
      ['',        'Mem',   '8bit', currentLevel,  '<=', 'Value', '', 8],
      ['',        'Mem',   '8bit', state,         '=',  'Value', '', StateEnum.InLevel],
      ['',        'Delta', '8bit', isSolved,      '=',  'Value', '', 0],
      ['Trigger', 'Mem',   '8bit', isSolved,      '=',  'Value', '', 1],
    ),
  },
});

set.addAchievement({
  id: 644370,
  badge: '735539',
  title: 'Getting the Hang of It',
  description: 'Beat level 6',
  points: 2,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(6),
    ),
  },
});

set.addAchievement({
  id: 644371,
  badge: '735540',
  title: 'Turning Back Time',
  description: 'Solve a level between 7 and 10 inclusive by only turning counter-clockwise',
  points: 2,
  conditions: {
    core: $(
      ['',        'Mem',   '8bit', isCounterClockwise, '=',  'Value', '', 1],
      ['',        'Mem',   '8bit', currentLevel,       '>=', 'Value', '', 7],
      ['',        'Mem',   '8bit', currentLevel,       '<=', 'Value', '', 10],
      ['',        'Mem',   '8bit', state,              '=',  'Value', '', StateEnum.InLevel],
      ['',        'Delta', '8bit', isSolved,           '=',  'Value', '', 0],
      ['Trigger', 'Mem',   '8bit', isSolved,           '=',  'Value', '', 1],
    ),
  },
});


set.addAchievement({
  id: 644372,
  badge: '735541',
  title: 'The Right Way',
  description: 'Solve level 10 by going right only once',
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', rightMoveCount, '=', 'Value', '', 1],
      ...progression(10, true)
    ),
  },
});

set.addAchievement({
  id: 644373,
  badge: '735542',
  title: 'Still Easy',
  description: 'Beat level 12',
  points: 3,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(12),
    ),
  },
});

set.addAchievement({
  id: 644374,
  badge: '735543',
  title: '17 for 17',
  description: 'Solve level 17 with at most 17 moves',
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', moveCount, '<=', 'Value', '', 17],
      ...progression(17, true),
    ),
  },
});

set.addAchievement({
  id: 644375,
  badge: '735544',
  title: 'A Few More Tries',
  description: 'Beat level 18',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(18),
    ),
  },
});

set.addAchievement({
  id: 644376,
  badge: '735545',
  title: 'Zooming Out',
  description: 'Beat level 24',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(24),
    ),
  },
});

set.addAchievement({
  id: 644377,
  badge: '735536',
  title: 'Hello RA!',
  description: 'Find the secret level',
  points: 3,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', state,        '=', 'Value', '', StateEnum.InLevel],
      ['', 'Mem',   '8bit', state,        '=', 'Value', '', StateEnum.SecretSplash],
      ['', 'Mem',   '8bit', phaseInLevel, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  id: 644378,
  badge: '735546',
  title: 'Tail Biter',
  description: 'Solve a level between 26 and 30 inclusive while finishing your coil on a cell next to where it started',
  points: 3,
  conditions: {
    core: $(
      ['', 'Mem',   '8bit', isFinishNearStart, '=',  'Value', '', 1],
      ['', 'Mem',   '8bit', currentLevel,      '>=', 'Value', '', 26],
      ['', 'Mem',   '8bit', currentLevel,      '<=', 'Value', '', 30],
      ['', 'Mem',   '8bit', state,             '=',  'Value', '', StateEnum.InLevel],
      ['', 'Delta', '8bit', isSolved,          '=',  'Value', '', 0],
      ['', 'Mem',   '8bit', isSolved,          '=',  'Value', '', 1],
    ),
  },
});

set.addAchievement({
  id: 644379,
  badge: '735547',
  title: 'Finding the Right Start',
  description: 'Beat level 30',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(30),
    ),
  },
});

set.addAchievement({
  id: 644380,
  badge: '735548',
  title: 'There Must Be a Pattern',
  description: 'Beat level 36',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(36),
    ),
  },
});

set.addAchievement({
  id: 644381,
  badge: '735549',
  title: 'Maybe I Should Write a Solver',
  description: 'Beat level 42',
  points: 10,
  type: 'win_condition',
  conditions: {
    core: $(
      ...progression(42),
    ),
  },
});

export default set;
