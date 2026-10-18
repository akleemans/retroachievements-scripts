import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 6821, title: 'Koneko Monogatari: The Adventures of Chatran'});

// Addresses and helpers
//const season = 0x0705; // 1-4
const month = 0x0706; // 1-12
const timeOfDay = 0x0707; // 1-2
const lives = 0x0704;
const goldenEggFlag = 0x071f;

const bearHitCountsDay = 0xb2fb;
const bearHitCountsNight = 0xb305;

const projectileSlot = 0x077c;
const enemyKillFlags = [0x0478, 0x0488, 0x0498, 0x04a8, 0x04b8, 0x04c8, 0x04d8, 0x04e8, 0x04f8, 0x0508];

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

const deathReset = () => {
  return [
    // Reset on death
    ['ResetIf', 'Delta', '8bit', lives, '>', 'Mem', '8bit', lives],
  ];
};

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
  description: 'Clear scene 24 and see the ending',
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
const enemyKills = () => {
  const arr = [];
  for (let enemyKillFlag of enemyKillFlags) {
    // const lastEnemy = (enemyKillFlag === enemyKillFlags[9]);
    arr.push(...[
      // Killed by either falling fruit or player/poosuke
      ['OrNext', 'Mem', '8bit', enemyKillFlag, '=', 'Value', '', 0x02],
      ['AndNext', 'Mem', '8bit', enemyKillFlag, '=', 'Value', '', 0x04],
      ['AddHits', 'Delta', '8bit', enemyKillFlag, '=', 'Value', '', 0x00],
    ])
  }
  arr.push(['Measured', 'Value', '', 0, '=', 'Value', '', 1, 10]);
  return arr;
};


set.addAchievement({
  title: 'Pest Control',
  description: 'Defeat 10(?) enemies in one scene without dying',
  points: 5,
  conditions: {
    core: $(
      // Add hits on enemy kills with
      ...enemyKills(),
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      // Reset on death
      ...deathReset(),
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
  title: 'Good Boy',
  description: 'Defeat 5 enemies with a single Poo-suke summoning',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

const goalReached = 0x0724;

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
      ['AddSource', 'Delta',   '8bit', bearHitCountsDay],
      ['',   'Delta',   '8bit', bearHitCountsNight,  '<=', 'Value', '',     4],

      // Goal reached
      // ['', 'Delta', '8bit', timeOfDay, '!=', 'Mem', '8bit', timeOfDay],
      ['', 'Mem', '8bit', goalReached, '=', 'Value', '', 0],
      ['', 'Delta', '8bit', goalReached, '=', 'Value', '', 1],

    ),
  },
});

set.addAchievement({
  title: 'Nine Lives, Plus One',
  description: 'Earn an Extra life from collecting 50 apples',
  points: 5,
  conditions: {
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Dog for All Seasons',
  description: 'Summon Poo-suke in spring, summer, autumn and winter',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Exterminator',
  description: 'Defeat a bird, a turtle, a mouse and a beetle',
  points: 5,
  conditions: {
    // TODO: enemy type IDs - accessed from kill enemy slot?
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'H-E-L-P!',
  description: 'Collect all four letters and summon Poo-suke',
  points: 2,
  conditions: {
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Source of Power',
  description: 'Get invincibility from milk',
  points: 3,
  conditions: {
    // TODO: where? Memory: Milk timer
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Ooh, It\'s Shiny!',
  description: 'Collect a golden egg',
  points: 5,
  conditions: {
    core: $(
      // TODO
      ['', 'Delta', '8bit', goldenEggFlag, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', goldenEggFlag, '=', 'Value', '', 1],
      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
  title: 'Egg Drop',
  description: 'Defeat an enemy with a white egg',
  points: 2,
  conditions: {
    // 1. Projectile slot = egg (0x2a), 2. Egg active (last object in array), 3. Enemy kill flag
    core: $(
      // Projectile slot = Egg
      ['', 'Delta', '8bit', projectileSlot, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', projectileSlot, '=', 'Value', '', 0x2a],

      // Any enemy killed by egg
      ['OrNext', 'Mem', '8bit', enemyKillFlags[0], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[1], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[2], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[3], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[4], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[5], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[6], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[7], '=', 'Value', '', 0x04],
      ['OrNext', 'Mem', '8bit', enemyKillFlags[8], '=', 'Value', '', 0x04],
      ['', 'Mem', '8bit', enemyKillFlags[9], '=', 'Value', '', 0x04],

      ...infiniteLivesCheatProtection(),
    ),
    alt1: $(
      ...levelSelectReset(),
    ),
  },
});

set.addAchievement({
  title: 'TODO High Score',
  description: 'Get a total score of 50,000',
  points: 5,
  conditions: {
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Milk Run',
  description: 'Defeat 5(?) enemies while being invincible by Milk',
  points: 5,
  conditions: {
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Gentle Paws',
  description: 'Clear a scene without defeating any enemy',
  points: 10,
  conditions: {
    // TODO: Trigger (except for bear?)
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Catch of the Day',
  description: 'Defeat a fish enemy',
  points: 2,
  conditions: {
    core: $(
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

set.addAchievement({
  title: 'Nothing goes to waste',
  description: 'Do not let any fruit go to waste for a whole scene',
  points: 3,
  conditions: {
    // TODO: Trigger
    core: $(
      // TODO: logic
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
      // TODO: logic
      ['', 'Value', '', 0, '=', 'Value', '', 1],
    ),
  },
});

export default set;
