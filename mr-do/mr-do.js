import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 4746, title: 'Mr. Do!'});

const level = 0xd0db; // 0-99
const lives = 0xd1e8;

const apple1 = 0xd287;
const apple2 = 0xd28c;
const apple3 = 0xd291;
const apple4 = 0xd296;
const apple5 = 0xd29b;
const apple6 = 0xd2a0;

const timerFrames = 0xd0b9;
const timerSeconds = 0xd0d9;
const timer256Seconds = 0xd0da;

const score1 = 0xd0d8;
const score10 = 0xd0d7;
const score100 = 0xd0d6;
const score1k = 0xd0d5;
const score10k = 0xd0d4;
const score100k = 0xd0d3;

const enemyKillsNeeded = 0xd1f2;

const progression = (levelId) => {
  return [
    // Pop if next level reached - there's no game state, just a continuous loop
    ['', 'Delta', '8bit', level, '=', 'Value', '', levelId - 1],
    ['', 'Mem',   '8bit', level, '=', 'Value', '', levelId],

    // Add check for lives still > 0, to avoid one-condition cheevos
    ['', 'Mem', '8bit', lives, '>', 'Value', '', 0],
  ];
};

// Resets on game over, not the first time
const resetOnGameRestart = () => {
  return [
    // Reset on game over
    ['AndNext', 'Delta', '8bit', lives, '=', 'Value', '', 1],
    ['ResetIf', 'Mem',   '8bit', lives, '=', 'Value', '', 0],
  ];
};

// Needed for initializing also on first start
const resetOnStartOfFirstLevel = () => {
  return [
    // Reset on start of level, if timer starts to run (frames = 1, apples initialized)
    ['AndNext', 'Mem', '8bit', timerFrames,     '=', 'Value', '', 1],
    ['AndNext', 'Mem', '8bit', timerSeconds,    '=', 'Value', '', 0],
    ['ResetIf', 'Mem', '8bit', timer256Seconds, '=', 'Value', '', 0],
  ];
};

// A monster kill as the game counts it
const monstersKilled = (flag, hits) => [
  // Count enemy kill changes except for initialization of game
  ['AddSource', 'Mem',   '8bit', timerSeconds],
  ['AndNext',   'Mem',   '8bit', timer256Seconds,  '!=', 'Value', '',     0],
  [flag,        'Delta', '8bit', enemyKillsNeeded, '>',  'Mem',   '8bit', enemyKillsNeeded, hits],
];


/* ----------------------------- */


set.addAchievement({
  id: 643776,
  badge: '734921',
  title: 'Dirt Digger',
  description: 'Beat level 1',
  points: 1,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(1),
    ),
  },
});

set.addAchievement({
  id: 643777,
  badge: '734922',
  title: 'Dribbler',
  description: 'Beat level 3',
  points: 3,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(3),
    ),
  },
});

set.addAchievement({
  id: 643778,
  badge: '734923',
  title: 'Dropper',
  description: 'Beat level 6',
  points: 3,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(6),
    ),
  },
});

set.addAchievement({
  id: 643779,
  badge: '734924',
  title: 'Dizzy Dorks',
  description: 'Beat level 9',
  points: 3,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(9),
    ),
  },
});

set.addAchievement({
  id: 643780,
  badge: '734925',
  title: 'Delivery',
  description: 'Finish a full loop by beating level 10',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(10),
    ),
  },
});

set.addAchievement({
  id: 643781,
  badge: '734926',
  title: 'Disciplined',
  description: 'Beat level 15',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(15),
    ),
  },
});

set.addAchievement({
  id: 643782,
  badge: '734927',
  title: 'Mr. Do!',
  description: 'Finish two loops by beating level 20',
  points: 25,
  type: 'win_condition',
  conditions: {
    core: $(
      ...progression(20),
    ),
  },
});

const difficulty = 0xd0cf;

set.addAchievement({
  id: 643783,
  badge: '734938',
  title: 'Dexterity',
  description: 'Finish a full loop on Hard',
  points: 10,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', difficulty, '=', 'Value', '', 2],
      ...progression(10),
    ),
  },
});

set.addAchievement({
  id: 643784,
  badge: '734939',
  title: 'Dovish',
  type: 'missable',
  description: 'Finish one loop without killing any regular monsters, whether by power ball or apple - killing letter monsters and ghosts is allowed',
  points: 10,
  conditions: {
    core: $(
      ...monstersKilled('PauseIf', 1),

      // Pop on full loop
      ['Trigger', 'Delta', '8bit', level, '=', 'Value', '', 9],
      ['Trigger', 'Mem',   '8bit', level, '=', 'Value', '', 10],

      // From progression method (check for lives still > 0)
      ['', 'Mem', '8bit', lives, '>', 'Value', '', 0],
    ),
    alt1: $(
      // Reset on start of first level
      ...resetOnGameRestart(),
    ),
  },
});

set.addAchievement({
  id: 643785,
  badge: '734940',
  title: 'Diligent',
  type: 'missable',
  description: 'Beat level 1 without letting an apple fall or move',
  points: 5,
  conditions: {
    core: $(
      // Pause if any apple moved (state != 1)
      ['OrNext',  'Mem', '8bit', apple1, '!=', 'Value', '', 1],
      ['OrNext',  'Mem', '8bit', apple2, '!=', 'Value', '', 1],
      ['OrNext',  'Mem', '8bit', apple3, '!=', 'Value', '', 1],
      ['OrNext',  'Mem', '8bit', apple4, '!=', 'Value', '', 1],
      ['OrNext',  'Mem', '8bit', apple5, '!=', 'Value', '', 1],
      ['PauseIf', 'Mem', '8bit', apple6, '!=', 'Value', '', 1, 1],

      ...progression(1),
    ),
    alt1: $(
      // Reset on start of level, if timer starts to run (frames = 1, apples initialized)
      ['AndNext', 'Mem', '8bit', timerFrames,     '=', 'Value', '', 1],
      ['AndNext', 'Mem', '8bit', timerSeconds,    '=', 'Value', '', 0],
      ['ResetIf', 'Mem', '8bit', timer256Seconds, '=', 'Value', '', 0],
    ),
  },
});

set.addAchievement({
  id: 643786,
  badge: '734941',
  title: 'Disguised',
  type: 'missable',
  description: 'Survive in level 1 for 2 minutes without dying',
  points: 5,
  conditions: {
    core: $(
      // PauseLock if died
      ['PauseIf', 'Delta', '8bit', lives, '>', 'Mem', '8bit', lives, 1],

      // Total time must be equal to or above 120 seconds
      ['AddSource', 'Delta', '8bit', timer256Seconds, '*',  'Value', '', 256],
      ['',          'Delta', '8bit', timerSeconds,    '<',  'Value', '', 120],
      ['AddSource', 'Mem',   '8bit', timer256Seconds, '*',  'Value', '', 256],
      ['Measured%', 'Mem',   '8bit', timerSeconds,    '>=', 'Value', '', 120],

      // Level must be 0
      ['MeasuredIf', 'Mem', '8bit', level, '=', 'Value', '', 0],
    ),
    alt1: $(
      // Resets on start of first level
      ...resetOnStartOfFirstLevel(),
    ),
  },
});

const checkScore = (score) => {
  return [
    // Score was below "score" in last frame, and is now "score" or higher
    ['AddSource', 'Delta', 'Lower4', score100k, '*', 'Value', '', 100_000],
    ['AddSource', 'Delta', 'Lower4', score10k,  '*', 'Value', '', 10000],
    ['AddSource', 'Delta', 'Lower4', score1k,   '*', 'Value', '', 1000],
    ['AddSource', 'Delta', 'Lower4', score100,  '*', 'Value', '', 100],
    ['AddSource', 'Delta', 'Lower4', score10,   '*', 'Value', '', 10],
    ['',          'Delta', 'Lower4', score1,    '<', 'Value', '', score],


    ['AddSource', 'Mem', 'Lower4', score100k, '*',  'Value', '', 100_000],
    ['AddSource', 'Mem', 'Lower4', score10k,  '*',  'Value', '', 10000],
    ['AddSource', 'Mem', 'Lower4', score1k,   '*',  'Value', '', 1000],
    ['AddSource', 'Mem', 'Lower4', score100,  '*',  'Value', '', 100],
    ['AddSource', 'Mem', 'Lower4', score10,   '*',  'Value', '', 10],
    ['',          'Mem', 'Lower4', score1,    '>=', 'Value', '', score],
  ];
};

set.addAchievement({
  id: 643787,
  badge: '734928',
  title: 'Decent',
  description: 'Get a score of 50,000 or more',
  points: 3,
  conditions: {
    core: $(
      ...checkScore(50_000),
    ),
  },
});

set.addAchievement({
  id: 643788,
  badge: '734929',
  title: 'Devoted',
  description: 'Get a score of 100,000 or more',
  points: 5,
  conditions: {
    core: $(
      ...checkScore(100_000),
    ),
  },
});

set.addAchievement({
  id: 643789,
  badge: '734930',
  title: 'Deck the Duck',
  description: 'Place first on the leaderboard by beating the score of 147,000',
  points: 10,
  conditions: {
    core: $(
      // Must be _above_ 147,000 to place first - exactly 147k will place second
      ...checkScore(147_001),
    ),
  },
});

set.addAchievement({
  id: 643790,
  badge: '734931',
  title: 'Determined',
  type: 'missable',
  description: 'Finish one loop without dying',
  points: 10,
  conditions: {
    core: $(
      // Pause if life lost
      ['PauseIf', 'Delta', '8bit', lives, '>', 'Mem', '8bit', lives, 1],

      // Progression, but with trigger
      ['',        'Delta', '8bit', level, '=', 'Value', '', 9],
      ['Trigger', 'Mem',   '8bit', level, '=', 'Value', '', 10],
    ),
    alt1: $(
      // Reset game start
      ...resetOnStartOfFirstLevel()
    ),
  },
});

const checkAll3MapsTimesBelow30s = () => {
  const timeSecondsMap1 = 0xd0e2;
  const time256SecondsMap1 = 0xd0e3;
  const timeSecondsMap2 = 0xd0eb;
  const time256SecondsMap2 = 0xd0ec;
  const timeSecondsMap3 = 0xd0f4;
  const time256SecondsMap3 = 0xd0f5;
  return [
    // We have to check Prior here, values will be already 0 at the point where the levelId increases
    ['', 'Prior', '16bit', timeSecondsMap1, '<=', 'Value', '', 30],
    ['', 'Prior', '16bit', timeSecondsMap2, '<=', 'Value', '', 30],
    ['', 'Prior', '16bit', timeSecondsMap3, '<=', 'Value', '', 30],
  ];
};


set.addAchievement({
  id: 643791,
  badge: '734942',
  title: 'Dancing',
  type: 'missable',
  description: 'Finish levels 1-3 with 0:30 or less on the timer for all levels',
  points: 5,
  conditions: {
    core: $(
      ...checkAll3MapsTimesBelow30s(),
      ...progression(3),
    ),
  },
});

set.addAchievement({
  id: 643792,
  badge: '734943',
  title: 'Dashing',
  type: 'missable',
  description: 'Finish levels 4-6 with 0:30 or less on the timer for all levels',
  points: 5,
  conditions: {
    core: $(
      ...checkAll3MapsTimesBelow30s(),
      ...progression(6),
    ),
  },
});

set.addAchievement({
  id: 643793,
  badge: '734944',
  title: 'Darting',
  type: 'missable',
  description: 'Finish levels 7-9 with 0:30 or less on the timer for all levels',
  points: 5,
  conditions: {
    core: $(
      ...checkAll3MapsTimesBelow30s(),
      ...progression(9),
    ),
  },
});


set.addAchievement({
  id: 643794,
  badge: '734945',
  title: 'Doing It All',
  type: 'missable',
  description: 'Finish one loop with 4:00 or less on the timer',
  points: 10,
  conditions: {
    core: $(
      // Total time must be equal or below to 4*60 = 240
      ['AddSource', 'Mem', '8bit', timer256Seconds, '*',  'Value', '', 256],
      ['',          'Mem', '8bit', timerSeconds,    '<=', 'Value', '', 240],
      ...progression(10),
    ),
  },
});

set.addAchievement({
  id: 643795,
  badge: '734946',
  title: 'Daring',
  description: 'Kill 30 regular monsters in a single run',
  points: 5,
  conditions: {
    core: $(
      ...monstersKilled('Measured', 30),
    ),
    alt1: $(
      // Reset on first level
      ...resetOnGameRestart(),
    ),
  },
});

const itemCollectedInCurrentLevel = 0xcc75;

set.addAchievement({
  id: 643796,
  badge: '734947',
  title: 'Do-Boy',
  type: 'missable',
  description: 'Find and collect the Game Boy collectible',
  points: 3,
  conditions: {
    core: $(
      // Item collected
      ['', 'Delta', '8bit', itemCollectedInCurrentLevel, '=', 'Value', '', 3],
      ['', 'Mem',   '8bit', itemCollectedInCurrentLevel, '=', 'Value', '', 1],

      // Pop in level % 16 = 7 (8, 24, ...)
      ['AddSource', 'Mem',   '8bit', level, '%', 'Value', '', 16],
      ['',          'Value', '',     0,     '=', 'Value', '', 7],
    ),
  },
});

const checkTreatCollection = (amount) => {
  return [
    // Add hits for every treat collection
    ['AndNext',  'Delta', '8bit', itemCollectedInCurrentLevel, '=', 'Value', '', 3],
    ['AddHits',  'Mem',   '8bit', itemCollectedInCurrentLevel, '=', 'Value', '', 1],
    ['Measured', 'Value', '',     0,                           '=', 'Value', '', 1, amount],
  ];
};

set.addAchievement({
  id: 643797,
  badge: '734948',
  title: 'Delicate',
  description: 'Collect 5 treats in a single run',
  points: 3,
  conditions: {
    core: $(
      ...checkTreatCollection(5),
    ),
    alt1: $(
      ...resetOnGameRestart(),
    ),
  },
});

set.addAchievement({
  id: 643798,
  badge: '734949',
  title: 'Delish',
  description: 'Collect 10 treats in a single run',
  points: 5,
  conditions: {
    core: $(
      ...checkTreatCollection(10),
    ),
    alt1: $(
      ...resetOnGameRestart(),
    ),
  },
});

const collectTreatInEveryLevel = () => {
  const arr = [];
  for (let i = 0; i < 16; i++) {
    arr.push(
      // Add hits for every treat collection, separately
      ['AndNext', 'Mem',   '8bit', level,                       '=', 'Value', '', i],
      ['AndNext', 'Delta', '8bit', itemCollectedInCurrentLevel, '=', 'Value', '', 3],
      ['',        'Mem',   '8bit', itemCollectedInCurrentLevel, '=', 'Value', '', 1, 1],
    );
  }

  return arr;
};

set.addAchievement({
  id: 643799,
  badge: '734950',
  title: 'Dinner',
  type: 'missable',
  description: 'Collect 16 different treats in the first 16 levels',
  points: 10,
  conditions: {
    core: $(
      ...collectTreatInEveryLevel(),

      // Make sure level is below 16 (0-15)
      ['', 'Mem', '8bit', level, '<', 'Value', '', 16],
    ),
    alt1: $(
      ...resetOnGameRestart(),
    ),
  },
});

const diamondCollected = 0xd1fc;

set.addAchievement({
  id: 643800,
  badge: '734951',
  title: 'Diamond Delight',
  description: 'Beat a level by collecting a diamond',
  points: 5,
  conditions: {
    core: $(
      // Win condition 3: Diamond collected
      ['', 'Mem', '8bit', diamondCollected, '!=', 'Value', '', 0],

      // Pop on any level
      ['', 'Delta', '8bit', level, '<', 'Mem', '8bit', level],
    ),
  },
});

set.addAchievement({
  id: 643801,
  badge: '734952',
  title: 'Dangerous Dudes',
  description: 'Beat a level by defeating a full wave of enemies',
  points: 3,
  conditions: {
    core: $(
      // Dangerous Dudes - last required monster killed
      ['', 'Delta', '8bit', enemyKillsNeeded, '=', 'Value', '', 1],
      ['', 'Mem',   '8bit', enemyKillsNeeded, '=', 'Value', '', 0],

      // Add check for lives still > 0, to avoid one-condition cheevos
      ['', 'Mem', '8bit', lives, '>', 'Value', '', 0],
    ),
  },
});

const extraLettersNeeded = 0xd0b6;

set.addAchievement({
  id: 643802,
  badge: '734953',
  title: 'Duplication',
  description: 'Beat a level and get an Extra life by collecting all "EXTRA" letters',
  points: 3,
  conditions: {
    core: $(
      // Win condition 2: All EXTRA letters collected
      ['', 'Delta', '8bit', extraLettersNeeded, '=', 'Value', '', 1],
      ['', 'Mem',   '8bit', extraLettersNeeded, '=', 'Value', '', 0],

      // Add check for lives still > 0, to avoid one-condition cheevos
      ['', 'Mem', '8bit', lives, '>', 'Value', '', 0],
    ),
  },
});

const cherriesNeeded = 0xd0ae;

set.addAchievement({
  id: 643803,
  badge: '734954',
  title: 'Delicious Cherries',
  description: 'Beat a level by eating all cherries',
  points: 2,
  conditions: {
    core: $(
      // Pop on last cherry eaten (score changes in the same frame, not on score screen)
      ['', 'Delta', 'Lower4', score10,        '!=', 'Mem',   'Lower4', score10],
      ['', 'Delta', '8bit',   cherriesNeeded, '=',  'Value', '',       1],
      ['', 'Mem',   '8bit',   cherriesNeeded, '=',  'Value', '',       0],
    ),
  },
});

/* ========= LEADERBOARDS ========= */

set.addLeaderboard({
  title: 'High Score',
  description: 'Score the most points',
  lowerIsBetter: false,
  type: 'SCORE',
  conditions: {
    start: $(
      // Add additional condition to avoid one-condition cheevo
      ['', 'Mem',   '8bit', level, '>', 'Value', '', 0],
      // Trigger on game over (no more lives)
      ['', 'Delta', '8bit', lives, '=', 'Value', '', 1],
      ['', 'Mem',   '8bit', lives, '=', 'Value', '', 0],
    ),
    cancel: '0=1',
    submit: '0=0',
    value: $(
      ['AddSource', 'Mem', 'Lower4', score100k, '*', 'Value', '', 100_000],
      ['AddSource', 'Mem', 'Lower4', score10k,  '*', 'Value', '', 10000],
      ['AddSource', 'Mem', 'Lower4', score1k,   '*', 'Value', '', 1000],
      ['AddSource', 'Mem', 'Lower4', score100,  '*', 'Value', '', 100],
      ['AddSource', 'Mem', 'Lower4', score10,   '*', 'Value', '', 10],
      ['Measured',  'Mem', 'Lower4', score1],
    ),
  },
});


set.addLeaderboard({
  title: 'Speedrun',
  description: 'Finish 1 loop as fast as possible',
  lowerIsBetter: true,
  type: 'FRAMES',
  conditions: {
    start: $(
      ...progression(10),
    ),
    cancel: '0=1',
    submit: '0=0',
    value: $(
      // Submit time at level increase
      ['AddSource', 'Mem', '8bit', timer256Seconds, '*', 'Value', '', 256 * 60],
      ['AddSource', 'Mem', '8bit', timerSeconds,    '*', 'Value', '', 60],
      ['Measured',  'Mem', '8bit', timerFrames],
    ),
  },
});


export default set;
