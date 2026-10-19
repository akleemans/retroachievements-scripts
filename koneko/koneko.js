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
// const score1 = 0xb2db;
// const score10 = 0xb2da;
// const score100 = 0xb2d9;
// const score1k = 0xb2d8;
const score10k = 0xb2d7;
// const score100k = 0xb2d6;

const goalReachedFlag = 0x0724;
const apples1 = 0xb2e8;
const apples10 = 0xb2e9;
const eggs10 = 0xb2e1;

const lettersCollected = 0x072d;
const milkTimer = 0x072c;

/* ------------------------------------------ */

const progression = (sceneId) => {
  const expectedMonth = Math.floor(sceneId / 2) + 1;
  if (sceneId % 2 === 1) {
    // For odd scenes, check time of day increase
    return [
      ['', 'Mem',   '8bit', month,     '=', 'Value', '', expectedMonth],
      ['', 'Delta', '8bit', timeOfDay, '=', 'Value', '', 1],
      ['', 'Mem',   '8bit', timeOfDay, '=', 'Value', '', 2],
    ];
  } else {
    // For even scenes, check month increase
    return [
      ['', 'Mem',   '8bit', timeOfDay, '=', 'Value', '', 1],
      ['', 'Delta', '8bit', month,     '=', 'Value', '', expectedMonth - 1],
      ['', 'Mem',   '8bit', month,     '=', 'Value', '', expectedMonth],
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

const levelSelectReset = () => {
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

// Alternative, early way to recognize finish of a level
const goalReached = (trigger) => {
  return [
    ['', 'Delta',   '8bit', goalReachedFlag, '=', 'Value', '', 0],
    [trigger ? 'Trigger':'', 'Mem', '8bit', goalReachedFlag, '=', 'Value', '', 1],
  ]
}

/* ========= PROGRESSION ========= */

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
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
    ])
  }
  arr.push(['Measured', 'Value', '', 0, '=', 'Value', '', 1, amount]);
  return arr;
};

set.addAchievement({
  title: 'Pest Control',
  description: 'Defeat 10 enemies in one scene without dying',
  points: 5,
  conditions: {
    core: $(
      // Add hits on enemy kills with
      ...enemyKills(10),
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      // Reset on death
      ...deathReset(),
      ...levelSelectReset(),
    ),
  },
});

const pooSukeSlot = 0x0420;

set.addAchievement({
  title: 'Good Boy',
  description: 'Keep Poo-suke the dog alive for 20 seconds',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      // Add hits on poo-suke alive
      ['Measured%', 'Mem', '8bit', pooSukeSlot, '=', 'Value', '', 2, 20*60],

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      // Reset if poo-suke despawns
      ['ResetIf', 'Mem', '8bit', pooSukeSlot, '=', 'Value', '', 0],
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
  title: 'Bear Trouble',
  description: 'Get past Blacky the bear while his head is still fully visible before Scene 23',
  points: 5,
  conditions: {
    core: $(
      // Month >= 4 (bear first appears) and before last 2 scenes (<= month 11)
      ['', 'Mem', '8bit', month, '>=', 'Value', '', 4],
      ['', 'Mem', '8bit', month, '<=', 'Value', '', 11],

      // Bear hits (day + night combined) no greater than 4. Uses Delta because it's reset on current frame when goal is reached
      ['AddSource', 'Delta', '8bit', bearHitCountsDay],
      ['',          'Delta', '8bit', bearHitCountsNight, '<=', 'Value', '', 4],

      ...goalReached(),
    ),
  },
});

set.addAchievement({
  title: 'Nine Lives, Plus One',
  description: 'Earn an Extra life from collecting 50 apples',
  points: 5,
  conditions: {
    core: $(
      // Lives increment
      ['', 'Mem',   '8bit', lives, '>', 'Delta', '8bit', lives],

      // Apples reset to 0
      ['', 'Delta', '8bit', apples1, '!=', 'Value', '', tileIndexStart],
      ['', 'Delta', '8bit', apples10, '!=', 'Value', '', tileIndexStart],
      ['', 'Mem',   '8bit', apples1, '=', 'Value', '', tileIndexStart],
      ['', 'Mem',   '8bit', apples10, '=', 'Value', '', tileIndexStart],
    ),
  },
});

set.addAchievement({
  title: 'H-E-L-P!',
  description: 'Collect all four letters and summon Poo-suke',
  points: 2,
  conditions: {
    core: $(
      ['', 'Delta', '8bit', lettersCollected, '=', 'Value', '', 3],
      ['', 'Mem',   '8bit', lettersCollected, '=', 'Value', '', 0],
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...levelSelectReset(),
    ),
  },
});


set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
  title: 'Egg Drop',
  description: 'Defeat an enemy by dropping an egg on them',
  points: 2,
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
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
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
  title: 'Milk Run',
  description: 'Defeat 5 enemies while being invincible by Milk',
  points: 5,
  conditions: {
    core: $(
      // Add hits on enemy kills with
      ...enemyKills(5),
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      // Reset if milk runs out
      ['ResetIf', 'Mem', '8bit', milkTimer, '=', 'Value', '', 0],
      ...levelSelectReset(),
    ),
  },
});

const timer1 = 0xb2f6;
const timer10 = 0xb2f5;
const timer100 = 0xb2f4;


const resetOnAnyEnemyDeath = () => {
  const arr = [];
  for (let enemyKillFlag of enemyKillFlags) {
    // We have to detect the moment of enemy kill, some 0x04
    arr.push(...[
      ['AndNext', 'Delta', 'Bit1', enemyKillFlag, '=', 'Value', '', 0],
      ['ResetIf', 'Mem', 'Bit1', enemyKillFlag, '=', 'Value', '', 1],

      ['AndNext', 'Delta', 'Bit2', enemyKillFlag, '=', 'Value', '', 0],
      ['ResetIf', 'Mem', 'Bit2', enemyKillFlag, '=', 'Value', '', 1],
    ]);
  }

  return arr;
};

set.addAchievement({
  title: 'Gentle Paws',
  description: 'Clear a scene without defeating any enemy',
  points: 10,
  conditions: {
    core: $(
      // Checkpoint hit on level start, if time switches from 350 to 349
      // This is after init & cheat protection
      ['AndNext', 'Mem', '8bit', timer100, '=', 'Value', '', 0xdc],
      ['AndNext', 'Delta', '8bit', timer10, '=', 'Value', '', 0xde],
      ['AndNext', 'Delta', '8bit', timer1, '=', 'Value', '', 0xd9],
      ['', 'Mem', '8bit', timer1, '=', 'Value', '', 0xe2, 1],

      // Any enemy killed resets the checkpoint hit
      ...resetOnAnyEnemyDeath(),

      // Pop on goal reached
      ...goalReached(true),

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...levelSelectReset(),
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
      ...levelSelectReset(),
    )
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
  title: 'Catch of the Day',
  description: 'Defeat a fish enemy',
  points: 2,
  conditions: catchOfTheDay(),
});

set.addAchievement({
  title: 'Nothing goes to waste',
  description: 'Do not let any fruit go to waste for a whole scene',
  points: 3,
  conditions: {
    core: $(
      // TODO logic, trigger
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Eggcellently Prepared',
  description: 'Have a total of 20 eggs available',
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
      ...levelSelectReset(),
    ),
  },
});

export default set;
