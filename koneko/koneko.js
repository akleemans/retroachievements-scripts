import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 6821, title: 'Koneko Monogatari: The Adventures of Chatran'});

// Addresses and helpers
// const season = 0x0705; // 1-4
const month = 0x0706; // 1-12
const timeOfDay = 0x0707; // 1-2
const lives = 0x0704;
const goldenEggFlag = 0x071f;

const bearHitCountsDay = 0xb2fb;
const bearHitCountsNight = 0xb305;

const projectileSlot = 0x077c;
const enemyIds = [0x0470, 0x0480, 0x0490, 0x04a0, 0x04b0, 0x04c0, 0x04d0, 0x04e0, 0x04f0, 0x0500];
const enemyKillFlags = [0x0478, 0x0488, 0x0498, 0x04a8, 0x04b8, 0x04c8, 0x04d8, 0x04e8, 0x04f8, 0x0508];

const tileIndexStart = 0xd9;
const score1 = 0xb2db;
const score10 = 0xb2da;
const score100 = 0xb2d9;
const score1k = 0xb2d8;
const score10k = 0xb2d7;
const score100k = 0xb2d6;

const goalReachedFlag = 0x0724;
const apples10 = 0xb2e8;
const apples1 = 0xb2e9;
// const eggs1 = 0xb2e2;
const eggs10 = 0xb2e1;

const lettersCollected = 0x072d;
const milkTimer = 0x072c;

const startedFromMidLevelCheckpoint = 0x0708;

/* ------------------------------------------ */

const progression = (sceneId) => {
  const expectedMonth = Math.floor(sceneId / 2) + 1;
  if (sceneId % 2 === 1) {
    // For odd scenes, check time of day increase
    // goalReachedFlag is required to protect against save/load exploits
    return [
      ['', 'Mem',   '8bit', month,     '=', 'Value', '', expectedMonth],
      ['', 'Delta', '8bit', timeOfDay, '=', 'Value', '', 1],
      ['', 'Mem',   '8bit', timeOfDay, '=', 'Value', '', 2],
      ['', 'Delta', '8bit', goalReachedFlag, '=', 'Value', '', 1],
    ];
  } else {
    // For even scenes, check month increase
    return [
      ['', 'Mem',   '8bit', timeOfDay, '=', 'Value', '', 1],
      ['', 'Delta', '8bit', month,     '=', 'Value', '', expectedMonth - 1],
      ['', 'Mem',   '8bit', month,     '=', 'Value', '', expectedMonth],
      ['', 'Delta', '8bit', goalReachedFlag, '=', 'Value', '', 1],
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
    ['OrNext',  'Mem',   '8bit', month,     '!=', 'Value', '', 1],
    ['AndNext', 'Mem',   '8bit', timeOfDay, '!=', 'Value', '', 1],
    ['AndNext', 'Delta', '8bit', lives,     '=',  'Value', '', 0],
    ['PauseIf', 'Mem',   '8bit', lives,     '=',  'Value', '', 5, 1],
  ];
};

const startGameReset = () => {
  return [
    // Reset on game start (init will be 0 lives at month 1 and time of day 1)
    ['AndNext', 'Mem', '8bit', month,     '=', 'Value', '', 1],
    ['AndNext', 'Mem', '8bit', timeOfDay, '=', 'Value', '', 1],
    ['ResetIf', 'Mem', '8bit', lives,     '=', 'Value', '', 0],
  ];
};

const deathReset = () => {
  return [
    // Reset on death
    ['ResetIf', 'Delta', '8bit', lives, '>', 'Mem', '8bit', lives],
  ];
};

const levelChangedReset = () => {
  return [
    // Reset on level change
    ['ResetIf', 'Delta', '8bit', timeOfDay, '!=', 'Mem', '8bit', timeOfDay],
  ];
};

// Alternative, early way to recognize finish of a level
const goalReached = (trigger) => {
  return [
    ['',                     'Delta', '8bit', goalReachedFlag, '=', 'Value', '', 0],
    [trigger ? 'Trigger' : '', 'Mem',   '8bit', goalReachedFlag, '=', 'Value', '', 1],
  ];
};

/* ========= PROGRESSION ========= */

set.addAchievement({
  id: 645541,
  badge: '737356',
  title: 'Sunny Start',
  description: 'Clear scene 3',
  points: 3,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(3),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645542,
  badge: '737357',
  title: 'Summer Is Over',
  description: 'Clear scene 6',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(6),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645543,
  badge: '737358',
  title: 'Falling Leaves',
  description: 'Clear scene 9',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(9),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645544,
  badge: '737359',
  title: 'Autumn Is Over',
  description: 'Clear scene 12',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(12),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645545,
  badge: '737360',
  title: 'First Snow',
  description: 'Clear scene 15',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(15),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645546,
  badge: '737361',
  title: 'Winter Is Over',
  description: 'Clear scene 18',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(18),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645547,
  badge: '737362',
  title: 'Spring Kitten',
  description: 'Clear scene 21',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(21),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645548,
  badge: '737363',
  title: 'Reunited with Shiro',
  description: 'Clear scene 24 and beat the game',
  points: 25,
  type: 'win_condition',
  conditions: {
    core: $(
      ...progression(24),
      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

/* ========= CHALLENGES & COLLECTION ========= */

const enemyKills = (amount) => {
  const arr = [];
  for (let enemyKillFlag of enemyKillFlags) {
    // const lastEnemy = (enemyKillFlag === enemyKillFlags[9]);
    arr.push(...[
      // Killed by either falling fruit or player/poosuke
      ['OrNext',  'Mem',   'Bit1', enemyKillFlag, '=', 'Value', '', 1],
      ['AndNext', 'Mem',   'Bit2', enemyKillFlag, '=', 'Value', '', 1],
      ['AndNext', 'Delta', 'Bit1', enemyKillFlag, '=', 'Value', '', 0],
      ['AddHits', 'Delta', 'Bit2', enemyKillFlag, '=', 'Value', '', 0],
    ]);
  }
  arr.push(['Measured', 'Value', '', 0, '=', 'Value', '', 1, amount]);
  return arr;
};

// TODO increase number?
set.addAchievement({
  id: 645549,
  badge: '737375',
  title: 'Pest Control',
  description: 'Defeat 10 enemies in one scene without dying',
  points: 5,
  conditions: {
    core: $(
      // Add hits on enemy kills with
      ...enemyKills(10),
      ...infiniteLivesCheatProtection(),

      // Reset on death
      ...deathReset(),
      ...levelChangedReset(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

const pooSukeSlot = 0x0420;

set.addAchievement({
  id: 645550,
  badge: '737371',
  title: 'Good Boy',
  description: 'Keep Poo-suke alive for 20 seconds',
  points: 5,
  conditions: {
    core: $(
      // Add hits on poo-suke alive
      ['Measured%', 'Mem', '8bit', pooSukeSlot, '=', 'Value', '', 2, 20 * 60],

      ...infiniteLivesCheatProtection(),

      // Reset if poo-suke despawns
      ['ResetIf', 'Mem', '8bit', pooSukeSlot, '=', 'Value', '', 0],
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645551,
  badge: '737372',
  title: 'Bear Trouble',
  description: 'Get past Blacky the bear while his head is still fully visible before scene 23',
  points: 5,
  conditions: {
    core: $(
      // Month >= 4 (bear first appears) and before last 2 scenes (<= month 11)
      ['', 'Mem', '8bit', month, '>=', 'Value', '', 4],
      ['', 'Mem', '8bit', month, '<=', 'Value', '', 11],

      // Bear hits (day + night combined) no greater than 4
      ['AddSource', 'Mem', '8bit', bearHitCountsDay],
      ['',          'Mem', '8bit', bearHitCountsNight, '<=', 'Value', '', 4],
      ['AddSource', 'Mem', '8bit', bearHitCountsDay],
      ['',          'Mem', '8bit', bearHitCountsNight, '>=', 'Value', '', 1],

      ...goalReached(),

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645552,
  badge: '737370',
  title: 'Nine Lives, Plus One',
  description: 'Earn an Extra life from collecting 50 apples or cherries',
  points: 5,
  conditions: {
    core: $(
      // Lives increment
      ['', 'Mem',   '8bit', lives,    '>', 'Delta', '8bit', lives],

      // Apples were 49 in the last frame
      ['', 'Delta', '8bit', apples10, '=', 'Value', '', tileIndexStart + 4],
      ['', 'Delta', '8bit', apples1,  '=', 'Value', '', tileIndexStart + 9],
      // Apples are 0 now
      ['', 'Mem', '8bit', apples10, '=', 'Value', '', tileIndexStart],
      ['', 'Mem', '8bit', apples1,  '=', 'Value', '', tileIndexStart],

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645553,
  badge: '737366',
  title: 'H-E-L-P!',
  description: 'Collect all four letters and summon Poo-suke, the dog',
  points: 2,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', lettersCollected, '=', 'Value', '', 3],
      ['', 'Mem',   '8bit', lettersCollected, '=', 'Value', '', 0],

      // Poo-suke spawned in same frame
      ['', 'Delta', '8bit', pooSukeSlot, '=', 'Value', '', 0],
      ['', 'Mem',   '8bit', pooSukeSlot, '=', 'Value', '', 2],

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});


set.addAchievement({
  id: 645554,
  badge: '737365',
  title: 'Source of Power',
  description: 'Get invincibility from milk',
  points: 3,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', milkTimer, '=', 'Value', '', 0],
      ['', 'Mem',   '8bit', milkTimer, '=', 'Value', '', 1],
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645555,
  badge: '737367',
  title: 'Ooh, It\'s Shiny!',
  description: 'Collect a golden egg',
  points: 5,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', goldenEggFlag, '=', 'Value', '', 0],
      ['', 'Mem',   '8bit', goldenEggFlag, '=', 'Value', '', 1],
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645556,
  badge: '737364',
  title: 'Egg Drop',
  description: 'Defeat an enemy by dropping an egg on them',
  points: 1,
  conditions: {
    // 1. Projectile slot = egg (0x2a), 2. Egg active (last object in array), 3. Enemy kill flag
    core: $(
      // Projectile slot = Egg
      ['', 'Delta', '8bit', projectileSlot, '=', 'Value', '', 0],
      ['', 'Mem',   '8bit', projectileSlot, '=', 'Value', '', 0x2a],

      // Any enemy killed by egg
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[0], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[1], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[2], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[3], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[4], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[5], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[6], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[7], '=', 'Value', '', 1],
      ['OrNext', 'Mem', 'Bit2', enemyKillFlags[8], '=', 'Value', '', 1],
      ['', 'Mem', 'Bit2', enemyKillFlags[9], '=', 'Value', '', 1],

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645557,
  badge: '737376',
  title: 'Purr-fect Score',
  description: 'Get a total score of 50,000',
  points: 10,
  conditions: {
    core: $(
      // Score was below 50k in last frame, and is now higher
      ['', 'Delta', '8bit', score10k, '<',  'Value', '', 0xde],
      ['', 'Mem',   '8bit', score10k, '>=', 'Value', '', 0xde],

      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

set.addAchievement({
  id: 645558,
  badge: '737373',
  title: 'Milk Run',
  description: 'Defeat 5 enemies while being invincible by milk',
  points: 10,
  conditions: {
    core: $(
      // Add hits on enemy kills with
      ...enemyKills(5),
      ...infiniteLivesCheatProtection(),

      // Reset if milk runs out
      ['ResetIf', 'Mem', '8bit', milkTimer, '=', 'Value', '', 0],
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

const timer1 = 0xb2f6;
const timer10 = 0xb2f5;
const timer100 = 0xb2f4;


const resetOnAnyEnemyDeath = () => {
  const arr = [];
  for (let enemyKillFlag of enemyKillFlags) {
    // Detect moment of enemy kill
    arr.push(...[
      ['AndNext', 'Delta', 'Bit1', enemyKillFlag, '=', 'Value', '', 0],
      ['ResetIf', 'Mem',   'Bit1', enemyKillFlag, '=', 'Value', '', 1],

      ['AndNext', 'Delta', 'Bit2', enemyKillFlag, '=', 'Value', '', 0],
      ['ResetIf', 'Mem',   'Bit2', enemyKillFlag, '=', 'Value', '', 1],
    ]);
  }

  return arr;
};

set.addAchievement({
  id: 645559,
  badge: '737374',
  title: 'Gentle Paws',
  description: 'Clear a scene without defeating any enemy',
  points: 5,
  conditions: {
    core: $(
      // Checkpoint hit on level start, if time switches from 350 to 349
      // This is after init & cheat protection
      ['AndNext', 'Mem',   '8bit', startedFromMidLevelCheckpoint, '=', 'Value', '', 0],
      ['AndNext', 'Mem',   '8bit', timer100,                      '=', 'Value', '', 0xdc],
      ['AndNext', 'Delta', '8bit', timer10,                       '=', 'Value', '', 0xde],
      ['AndNext', 'Delta', '8bit', timer1,                        '=', 'Value', '', 0xd9],
      ['',        'Mem',   '8bit', timer1,                        '=', 'Value', '', 0xe2, 1],

      // Any enemy killed resets the checkpoint hit
      ...resetOnAnyEnemyDeath(),

      // Pop on goal reached
      ...goalReached(true),

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
    ),
  },
});

const catchOfTheDay = () => {
  const conditions = {
    core: $(
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ['', 'Value', '', 0, '=', 'Value', '', 1],
      ...startGameReset(),
    ),
  };

  let count = 2;
  for (let i = 0; i < 10; i += 1) {
    const arr = [
      // Enemy is fish
      ['OrNext', 'Mem', '8bit', enemyIds[i], '=', 'Value', '', 0x13],
      ['', 'Mem', '8bit', enemyIds[i], '=', 'Value', '', 0x15],

      // Enemy killed by fruit or player/poo-suke
      ['', 'Delta', 'Bit1', enemyKillFlags[i], '=', 'Value', '', 0],
      ['', 'Delta', 'Bit2', enemyKillFlags[i], '=', 'Value', '', 0],
      ['OrNext', 'Mem', 'Bit1', enemyKillFlags[i], '=', 'Value', '', 1],
      ['', 'Mem', 'Bit2', enemyKillFlags[i], '=', 'Value', '', 1],
    ];
    conditions['alt' + count] = $(...arr);
    count += 1;
  }
  return conditions;
};

set.addAchievement({
  id: 645560,
  badge: '737368',
  title: 'Catch of the Day',
  description: 'Defeat a fish enemy',
  points: 2,
  conditions: catchOfTheDay(),
});

set.addAchievement({
  id: 645561,
  badge: '737369',
  title: 'Eggcellently Prepared',
  description: 'Hold 20 eggs at once',
  points: 2,
  conditions: {
    core: $(
      // Score was below 50k in last frame, and is now higher
      ['', 'Delta', '8bit', eggs10, '<',  'Value', '', 0xdb],
      ['', 'Mem',   '8bit', eggs10, '>=', 'Value', '', 0xdb],

      ...infiniteLivesCheatProtection(),
      ...continueCheatProtection(),
    ),
    alt1: $(
      ...startGameReset(),
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
    start: {
      core: $(
        // Month must be between 1 and 13
        ['', 'Mem', '8bit', month, '>=', 'Value', '', 1],
        ['', 'Mem', '8bit', month, '<=', 'Value', '', 13],

        ...infiniteLivesCheatProtection(),
        ...continueCheatProtection(),
      ),
      alt1: $(
        // Trigger on game over (no more lives)
        ['', 'Delta', '8bit', lives, '=', 'Value', '', 1],
        ['', 'Mem',   '8bit', lives, '=', 'Value', '', 0],
      ),
      alt2: $(
        // Trigger on finishing the game (scene 24 cleared)
        ...progression(24),
      ),
      alt3: $(
        // Reset cheat protection on new game, but not on the game over frame itself
        ['AndNext', 'Delta', '8bit', lives, '=', 'Value', '', 0],
        ...startGameReset(),
        // Only reset alt
        ['', 'Value', '', 0, '=', 'Value', '', 1],
      ),
    },
    cancel: '0=1',
    submit: '0=0',
    value: $(
      // Each digit is offset by tileIndexStart, so subtract 0xd9 * 111111 once for all six digits
      ['SubSource', 'Value', '',     tileIndexStart * 111_111],
      ['AddSource', 'Mem',   '8bit', score100k,                '*', 'Value', '', 100_000],
      ['AddSource', 'Mem',   '8bit', score10k,                 '*', 'Value', '', 10000],
      ['AddSource', 'Mem',   '8bit', score1k,                  '*', 'Value', '', 1000],
      ['AddSource', 'Mem',   '8bit', score100,                 '*', 'Value', '', 100],
      ['AddSource', 'Mem',   '8bit', score10,                  '*', 'Value', '', 10],
      ['Measured',  'Mem',   '8bit', score1],
    ),
  },
});

export default set;
