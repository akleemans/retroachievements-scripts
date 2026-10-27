import {AchievementSet, define as $} from '@cruncheevos/core';
const set = new AchievementSet({gameId: 6127, title: 'Bubble Ghost'});

const currentHall = 0xc0ad;
const nextHallToLoad = 0xc0ac;
const lives = 0xc0af;
// const scoreInternal = 0xc0fb;

set.addAchievement({
  id: 88082,
  badge: '96164',
  title: 'Free as a Bubble',
  description: 'Beat the game',
  points: 25,
  type: 'win_condition',
  conditions: $(
    ['', 'Mem',   '8bit', currentHall,    '=', 'Value', '', 36],
    ['', 'Delta', '8bit', nextHallToLoad, '=', 'Value', '', 36],
    ['', 'Mem',   '8bit', nextHallToLoad, '=', 'Value', '', 37],
  ),
});

const getLives = (amountOfLives) => {
  return [
    ['', 'Mem',   '8bit', currentHall, '>=', 'Value', '', 2],
    ['', 'Mem',   '8bit', currentHall, '<=', 'Value', '', 36],
    ['', 'Delta', '8bit', lives,       '=',  'Value', '', amountOfLives - 1],
    ['', 'Mem',   '8bit', lives,       '=',  'Value', '', amountOfLives],
  ];
};

set.addAchievement({
  id: 88083,
  badge: '96187',
  title: '6 Lives',
  description: 'Get 6 Lives',
  points: 5,
  conditions: $(
    ...getLives(6),
  ),
});

set.addAchievement({
  id: 88084,
  badge: '96188',
  title: '7 Lives',
  description: 'Get 7 Lives',
  points: 10,
  conditions: $(
    ...getLives(7),
  ),
});

set.addAchievement({
  id: 88085,
  badge: '96189',
  title: '8 Lives',
  description: 'Get 8 Lives',
  points: 10,
  conditions: $(
    ...getLives(8),
  ),
});

set.addAchievement({
  id: 88086,
  badge: '96195',
  title: 'Am I a Cat?',
  description: 'Get 9 Lives',
  points: 25,
  conditions: $(
    ...getLives(9),
  ),
});

// Below are unofficial cheevos

// const getScore10x = (score10x) => {
//   return [
//     ['', 'Mem',   '8bit',  currentHall,   '>=', 'Value', '', 2],
//     ['', 'Mem',   '8bit',  currentHall,   '<=', 'Value', '', 36],
//     ['', 'Delta', '16bit', scoreInternal, '<',  'Value', '', score10x],
//     ['', 'Mem',   '16bit', scoreInternal, '>=', 'Value', '', score10x],
//   ];
// };
//
// set.addAchievement({
//   id: 88087,
//   badge: '96169',
//   title: '50K',
//   description: 'Get more than 50,000 points',
//   points: 5,
//   conditions: $(
//     ...getScore10x(5_000),
//   ),
// });
//
// set.addAchievement({
//   id: 88088,
//   badge: '96170',
//   title: '100K',
//   description: 'Score more than 100,000 points',
//   points: 5,
//   conditions: $(
//     ...getScore10x(10_000),
//   ),
// });


/* ------------------------------- */

set.addAchievement({
  id: 88076,
  badge: '96157',
  title: 'Hall 5',
  description: 'Beat level 5',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 6],
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 7],
  ),
});

set.addAchievement({
  id: 88077,
  badge: '96158',
  title: 'Hall 10',
  description: 'Beat level 10',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 11],
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 12],
  ),
});

set.addAchievement({
  id: 88078,
  badge: '96159',
  title: 'Hall 15',
  description: 'Beat level 15',
  points: 10,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 16],
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 17],
  ),
});

set.addAchievement({
  id: 88079,
  badge: '96160',
  title: 'Hall 20',
  description: 'Beat level 20',
  points: 10,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 21],
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 22],
  ),
});

set.addAchievement({
  id: 88080,
  badge: '96161',
  title: 'Hall 25',
  description: 'Beat level 25',
  points: 10,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 26],
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 27],
  ),
});

set.addAchievement({
  id: 88081,
  badge: '96163',
  title: 'Hall 30',
  description: 'Beat level 30',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 31],
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 32],
  ),
});

set.addAchievement({
  id: 88089,
  badge: '96172',
  title: '150K',
  description: 'Score more than 150.000 points',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xe0de, '=', 'Value', '', 1],
    ['', 'Mem', '8bit', 0xe0df, '>', 'Value', '', 4],
  ),
});

set.addAchievement({
  id: 88090,
  badge: '96171',
  title: '200K',
  description: 'Score more than 200.000 points',
  points: 10,
  conditions: $(['', 'Mem', '8bit', 0xe0de, '=', 'Value', '', 2]),
});

set.addAchievement({
  id: 88091,
  badge: '96173',
  title: '250K',
  description: 'Get more than 250.000 points.',
  points: 25,
  conditions: $(
    ['', 'Mem', '8bit', 0xe0df, '>', 'Value', '', 4],
    ['', 'Mem', '8bit', 0xe0de, '=', 'Value', '', 2],
  ),
});

set.addAchievement({
  id: 88092,
  badge: '96197',
  title: 'Skip a few levels',
  description: 'Find the first shortcut',
  points: 5,
  conditions: $(
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 22],
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 15],
  ),
});

set.addAchievement({
  id: 88093,
  badge: '96196',
  title: 'No time to waste',
  description: 'Find the second shortcut.',
  points: 10,
  conditions: $(
    ['', 'Delta', '8bit', 0xc0ad, '=', 'Value', '', 28],
    ['', 'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 33],
  ),
});

set.addAchievement({
  id: 88094,
  badge: '96192',
  title: 'You don\'t need it, do you...?',
  description: 'Beat the game without using a continue.',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xe0b2, '=', 'Value', '', 2],
    ['', 'Mem', '8bit', 0xc0ac, '=', 'Value', '', 37],
  ),
});

set.addAchievement({
  id: 88095,
  badge: '96190',
  title: 'Like a candle in the wind',
  description: 'Blow it.',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 58],
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 33],
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 4],
  ),
});

set.addAchievement({
  id: 88096,
  badge: '96191',
  title: 'Like two candles in the wind',
  description: '(c) Elton',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 195],
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 112],
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 5],
  ),
});

set.addAchievement({
  id: 88097,
  badge: '96183',
  title: 'I\'m a fan of rabbits.',
  description: 'Pun intended.',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 195],
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 112],
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 6],
  ),
});

set.addAchievement({
  id: 88098,
  badge: '96176',
  title: 'I\'m not a fan.',
  description: 'Sorry.',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 112],
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 195],
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 9],
  ),
});

set.addAchievement({
  id: 88099,
  badge: '96194',
  title: 'Pachyderm.',
  description: 'Make it happy by blowing it. ',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 14],
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 195],
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 112],
  ),
});

set.addAchievement({
  id: 88100,
  badge: '96174',
  title: 'Ophidiophobia',
  description: 'Get rid of the snake.',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 46],
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 10],
  ),
});

set.addAchievement({
  id: 88101,
  badge: '96193',
  title: 'Arachnophobia',
  description: 'I hate them',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 112],
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 195],
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 17],
  ),
});

set.addAchievement({
  id: 88102,
  badge: '96178',
  title: 'Empty-V #1',
  description: 'Turn it off.',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 33],
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 58],
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 24],
  ),
});

set.addAchievement({
  id: 88103,
  badge: '96179',
  title: 'Empty-V #2',
  description: 'Still nothing to watch.',
  points: 1,
  conditions: $(
    ['', 'Mem', '8bit', 0xc0ad, '=', 'Value', '', 15],
    ['', 'Mem', '8bit', 0xffe7, '=', 'Value', '', 195],
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 112],
    ['', 'Mem', '8bit', 0xffe6, '=', 'Value', '', 112],
  ),
});

set.addAchievement({
  id: 88518,
  badge: '96192',
  title: 'You don\'t need it, do you...?',
  description: 'Beat the game without using a continue.',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xc0b2, '=', 'Value', '', 2],
    ['', 'Mem', '8bit', 0xc0ac, '=', 'Value', '', 37],
  ),
});

set.addAchievement({
  id: 88615,
  badge: '96593',
  title: 'void',
  description: 'void',
  points: 5,
  conditions: $(undefined),
});

set.addAchievement({
  id: 88632,
  badge: '96603',
  title: 'A greedy ghost',
  description: 'Get more than 6540pts at the first hall.',
  points: 5,
  conditions: $(
    ['',          'Delta', '8bit', 0xc0ad, '=', 'Value', '', 2],
    ['',          'Mem',   '8bit', 0xc0ad, '=', 'Value', '', 3],
    ['AddSource', 'Mem',   '8bit', 0xc0e0, '*', 'Value', '', 100],
    ['AddSource', 'Mem',   '8bit', 0xc0e1, '*', 'Value', '', 10],
    ['',          'Mem',   '8bit', 0xc0e2, '>', 'Value', '', 654],
  ),
});

set.addAchievement({
  id: 88526,
  badge: '96169',
  title: '50K',
  description: 'Get more than 50.000 points',
  points: 5,
  conditions: $(
    ['', 'Mem',   '8bit', 0xc0df, '=', 'Value', '', 5],
    ['', 'Delta', '8bit', 0xc0df, '=', 'Value', '', 4],
  ),
});

set.addAchievement({
  id: 88525,
  badge: '96170',
  title: '100K',
  description: 'Score more than 100.000 points',
  points: 5,
  conditions: $(
    ['', 'Mem',   '8bit', 0xc0de, '=', 'Value', '', 1],
    ['', 'Delta', '8bit', 0xc0df, '=', 'Value', '', 9],
  ),
});

set.addAchievement({
  id: 88523,
  badge: '96172',
  title: '150K',
  description: 'Score more than 150.000 points',
  points: 10,
  conditions: $(
    ['', 'Mem',   '8bit', 0xc0de, '=', 'Value', '', 1],
    ['', 'Mem',   '8bit', 0xc0df, '=', 'Value', '', 5],
    ['', 'Delta', '8bit', 0xc0df, '=', 'Value', '', 4],
  ),
});

set.addAchievement({
  id: 88521,
  badge: '96171',
  title: '200K',
  description: 'Score more than 200.000 points',
  points: 10,
  conditions: $(
    ['', 'Mem',   '8bit', 0xc0de, '=', 'Value', '', 2],
    ['', 'Delta', '8bit', 0xc0de, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 88520,
  badge: '96173',
  title: '250K',
  description: 'Get more than 250.000 points.',
  points: 25,
  conditions: $(
    ['', 'Mem',   '8bit', 0xc0de, '=', 'Value', '', 2],
    ['', 'Mem',   '8bit', 0xc0df, '=', 'Value', '', 5],
    ['', 'Delta', '8bit', 0xc0df, '=', 'Value', '', 4],
  ),
});

set.addLeaderboard({
  id: 6388,
  title: 'High Score Challenge',
  description: 'Get the highest score possible!',
  lowerIsBetter: false,
  type: 'SCORE',
  conditions: {
    start: $(
      ['', 'Mem', '8bit',  0xc0af, '=', 'Value', '', 5],
      ['', 'Mem', '16bit', 0xc0fb, '=', 'Value', '', 0],
    ),
    cancel: '0=1',
    submit: $(
      ['', 'Mem', '8bit', 0xc0af, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', 0x9a02, '=', 'Value', '', 30],
    ),
    value: $(
      ['Measured', 'Mem', '16bit', 0xc0fb, '*', 'Value', '', 10],
    ),
  },
});

export default set;
