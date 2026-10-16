import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 2459, title: 'Last Action Hero'});

const score = 0xc100; // 16-bit, in hundreds
const lives = 0xc104;
const timeRemaining = 0xc106;
const ticketsToCollect = 0xc108;
const maxHealth = 0xc10a; // 0x07-0x0b
const health = 0xc10c;
const continues = 0xc111;
const scene = 0xc112;
const nextScene = 0xc113;
const progressUnlocked = 0xc174;
const playerState = 0xc807;
const playerX = 0xc808; // 16-bit
const playerY = 0xc80a; // 16-bit

const enemyHits = [0xc834, 0xc854, 0xc874, 0xc894, 0xc8b4];

// Pop when scene increases to the next one - pass 'Trigger' as flag to show the challenge indicator
const progression = (sceneId, flag = '') => {
  return [
    ['',   'Delta', '8bit', scene,     '=', 'Value', '', sceneId],
    [flag, 'Mem',   '8bit', scene,     '=', 'Value', '', sceneId + 1],
    [flag, 'Mem',   '8bit', nextScene, '=', 'Value', '', sceneId + 1],
  ];
};

// In a playable scene (1-9) and not loading the next one
const inGame = () => {
  return [
    ['', 'Mem', '8bit', scene, '>=', 'Value', '',     1],
    ['', 'Mem', '8bit', scene, '<=', 'Value', '',     9],
    ['', 'Mem', '8bit', scene, '=',  'Mem',   '8bit', nextScene],
  ];
};

// Reset if a life was lost
const resetOnLifeLost = () => {
  return [['ResetIf', 'Delta', '8bit', lives, '>', 'Mem', '8bit', lives]];
};


/* ----------------------------- */


set.addAchievement({
  title: 'Fire Extinguisher',
  description: 'Extinguish a flame',
  points: 1,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Mem',   '8bit', scene,            '=', 'Value', '', 1],
      ['', 'Delta', '8bit', progressUnlocked, '=', 'Value', '', 0],
      ['', 'Mem',   '8bit', progressUnlocked, '=', 'Value', '', 1],
    ),
  },
});

const roundhouseKickDefeat = () => {
  const conditions = {
    core: $(
      ['', 'Mem', '8bit', scene, '=', 'Value', '', 1],
    ),
  };
  let count = 1;
  for (let enemy of enemyHits) {
    // Enemy in this slot was defeated by a roundhouse kick: a kick adds 2 hits (punch: 1), enemy is defeated at 6 hits
    const arr = [
      ['SubSource', 'Delta', '8bit', enemy],
      ['',          'Mem',   '8bit', enemy, '=',  'Value', '', 2],
      ['',          'Mem',   '8bit', enemy, '>=', 'Value', '', 6],
    ];
    conditions['alt' + count] = $(...arr);
    count += 1;
  }
  return conditions;
};

set.addAchievement({
  title: 'Jack Norris',
  description: 'Defeat an enemy with a roundhouse kick in Scene 1',
  points: 2,
  type: 'missable',
  // This will create 5 alts, one per enemy slot
  conditions: roundhouseKickDefeat(),
});

set.addAchievement({
  title: 'Inside the School',
  description: 'Finish Scene 1',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(1),
    ),
  },
});

set.addAchievement({
  title: 'Faster than the Hollywood Police',
  description: 'Finish Scene 1 with 50 or more seconds left',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', timeRemaining, '>=', 'Value', '', 50],
      ...progression(1, 'Trigger'),
    ),
  },
});

set.addAchievement({
  title: 'On the Roof',
  description: 'Finish Scene 2 by beating the Ripper',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(2),
    ),
  },
});

set.addAchievement({
  title: 'Rip Swings a Mean Axe',
  description: 'Beat the Ripper in Scene 2 without taking damage',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      // PauseLock if damage taken in Scene 2
      ['AndNext', 'Mem',   '8bit', scene,  '=', 'Value', '',     2],
      ['PauseIf', 'Delta', '8bit', health, '>', 'Mem',   '8bit', health, 1],

      ...progression(2),
    ),
    alt1: $(
      ...resetOnLifeLost(),
    ),
  },
});

set.addAchievement({
  title: 'Bonneville Car Chase',
  description: 'Finish Scene 3',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(3),
    ),
  },
});

set.addAchievement({
  title: 'Full Throttle, Full Health',
  description: 'Get the big heart at the end of Scene 3',
  points: 2,
  type: 'missable',
  conditions: {
    core: $(
      // Big heart increases the max. possible health
      ['', 'Mem',   '8bit', scene,     '=', 'Value', '',     3],
      ['', 'Delta', '8bit', maxHealth, '<', 'Mem',   '8bit', maxHealth],
    ),
  },
});

set.addAchievement({
  title: 'Motion-Picture Style',
  description: 'Finish Scene 3 with 20 or more seconds left',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', timeRemaining, '>=', 'Value', '', 20],
      ...progression(3, 'Trigger'),
    ),
  },
});

set.addAchievement({
  title: 'Outside The Subway',
  description: 'Finish Scene 4',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(4),
    ),
  },
});

set.addAchievement({
  title: 'Subway Sprint',
  description: 'Finish Scene 4 with 15 or more seconds left',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', timeRemaining, '>=', 'Value', '', 15],
      ...progression(4, 'Trigger'),
    ),
  },
});

set.addAchievement({
  title: 'Crane Climbing',
  description: 'Reach the crane hook at the far left of Scene 5 without using the elevator',
  points: 3,
  type: 'missable',
  conditions: {
    core: $(
      // Player jumps up into the box around the crane hook (standing on the ledge below is y = 1304)
      ['', 'Mem', '8bit',  scene,   '=',  'Value', '', 5],
      ['', 'Mem', '16bit', playerX, '<',  'Value', '', 40],
      ['', 'Mem', '16bit', playerY, '>=', 'Value', '', 1250],
      ['', 'Mem', '16bit', playerY, '<',  'Value', '', 1288],
    ),
  },
});

set.addAchievement({
  title: 'Leo\'s Funeral',
  description: 'Finish Scene 5',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(5),
    ),
  },
});

set.addAchievement({
  title: 'Elevator Action',
  description: 'Finish Scene 5 with 100 or more seconds left',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', timeRemaining, '>=', 'Value', '', 100],
      ...progression(5, 'Trigger'),
    ),
  },
});

set.addAchievement({
  title: 'The Car Chase',
  description: 'Finish Scene 6',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(6),
    ),
  },
});

set.addAchievement({
  title: 'Mobster Motorcade',
  description: 'Achieve the ticket goal in Scene 6 with at least 40 seconds left on the timer',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', scene,         '=',  'Value', '', 6],
      ['', 'Mem', '8bit', timeRemaining, '>=', 'Value', '', 40],

      // Last ticket collected
      ['Trigger', 'Delta', '8bit', ticketsToCollect, '=', 'Value', '', 1],
      ['Trigger', 'Mem',   '8bit', ticketsToCollect, '=', 'Value', '', 0],
    ),
  },
});

set.addAchievement({
  title: 'Premiere Night',
  description: 'Finish Scene 7',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(7),
    ),
  },
});

set.addAchievement({
  title: 'Jack Slater IV',
  description: 'Finish Scene 7 with 15 or more seconds left',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', timeRemaining, '>=', 'Value', '', 15],
      ...progression(7, 'Trigger'),
    ),
  },
});

set.addAchievement({
  title: 'Déjà-vu Experience',
  description: 'Finish Scene 8 by beating the Ripper a second time',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(8),
    ),
  },
});

set.addAchievement({
  title: 'Just You, Him and a 40-Story Drop',
  description: 'Finish Scene 8 with at least 20 seconds left on the timer',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', timeRemaining, '>=', 'Value', '', 20],
      ...progression(8, 'Trigger'),
    ),
  },
});

set.addAchievement({
  title: 'Last of the Action Heroes',
  description: 'Beat Benedict in Scene 9 and beat the game',
  points: 25,
  type: 'win_condition',
  conditions: {
    core: $(
      ...progression(9),
    ),
  },
});

// TODO
set.addAchievement({
  title: 'No Jump Cuts',
  description: 'Beat Benedict without jumping or pressing B with at least 6 hearts of remaining health',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      // PauseLock if jumped in Scene 9 (the intro jump comes from state 0x0e and is ignored)
      ['AndNext', 'Mem',   '8bit', scene,       '=', 'Value', '', 9],
      ['AndNext', 'Delta', '8bit', playerState, '<', 'Value', '', 0x09],
      ['PauseIf', 'Mem',   '8bit', playerState, '=', 'Value', '', 0x09, 1],

      // PauseLock if punched (B) in Scene 9
      ['AndNext', 'Mem', '8bit', scene,       '=', 'Value', '', 9],
      ['PauseIf', 'Mem', '8bit', playerState, '=', 'Value', '', 0x11, 1],

      // Health is refilled on scene change, so check the health before
      ['',        'Delta', '8bit', health,      '>=', 'Value', '', 6],
      ...progression(9, 'Trigger'),
    ),
    alt1: $(
      ...resetOnLifeLost(),
    ),
  },
});

set.addAchievement({
  title: 'To Be or Not to Be',
  description: 'Fill up your health bar to the maximum by collecting hearts',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      ...inGame(),
      ['', 'Delta', '8bit', maxHealth, '=', 'Value', '', 0x0a],
      ['', 'Mem',   '8bit', maxHealth, '=', 'Value', '', 0x0b],

      // Collecting a big heart refills the health to the new maximum on the same frame
      ['', 'Delta', '8bit', health, '<', 'Mem', '8bit', health],
      ['', 'Mem',   '8bit', health, '=', 'Mem', '8bit', maxHealth],
    ),
  },
});

set.addAchievement({
  title: 'Exceptionally Well Trained',
  description: 'Beat the game without using a continue',
  points: 10,
  conditions: {
    core: $(
      ['', 'Mem', '8bit', continues, '=', 'Value', '', 3],
      ...progression(9),
    ),
  },
});

set.addAchievement({
  title: 'Big-Screen Bandit',
  description: 'Reach a total score of 120,000',
  points: 10,
  conditions: {
    core: $(
      ...inGame(),

      // Score is stored in hundreds
      ['', 'Delta', '16bit', score, '<',  'Value', '', 1200],
      ['', 'Mem',   '16bit', score, '>=', 'Value', '', 1200],
    ),
  },
});

/* ========= LEADERBOARDS ========= */

set.addLeaderboard({
  title: 'High Score',
  description: 'Score the most points by beating the game',
  lowerIsBetter: false,
  type: 'SCORE',
  conditions: {
    start: $(
      ...progression(9),
    ),
    cancel: '0=1',
    submit: '0=0',
    value: $(
      // Score is stored in hundreds
      ['Measured', 'Mem', '16bit', score, '*', 'Value', '', 100],
    ),
  },
});


export default set;
