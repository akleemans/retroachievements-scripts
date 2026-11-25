import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 2570, title: 'Spider-Man 3: Invasion of the Spider-Slayers'});

const stageId = 0x00ffcc;
const score = 0x00d070;
const lives = 0x00d043;
const power = 0x00d044;
const invincibilityTimer = 0x00d056;
const mapPosX = 0x00ffc6;
const playerState = 0x00d0f9;
const hiScore = 0x00d077;
const gameBeaten = 0x00d0a9;

const StageEnum = {
  Stage1_1: 0x01,
  Stage1_2: 0x04,
  Stage1_3Tower1: 0x02,
  Stage1_3Tower2: 0x03,
  Stage2_1: 0x05,
  Stage2_2: 0x06,
  Stage3_4: 0x0a,
  Stage3_5: 0x0b,
  Stage4_1: 0x0c,
  Stage4_2: 0x10,
  Stage5_2: 0x0e,
  Stage5_3: 0x0f,
};

const PlayerStateEnum = {
  WebShot: 0x96, // climbing with the web line uses other states (0x86, 0x8a)
};

// Stage ID goes from target stage to 0, and a bit later the score goes up
const stageCleared = (stage, flag = '') => [
  [flag, 'Prior', '8bit',  stageId, '=', 'Value', '',      stage],
  [flag, 'Mem',   '8bit',  stageId, '=', 'Value', '',      0],
  [flag, 'Delta', '16bit', score,   '<', 'Mem',   '16bit', score],
];

// Title screen of a new game: score 0 and 3 lives (also right after a game over)
// Used in an alt when core has a pause lock, a paused core can't reset itself
const newGame = () => [
  ['AndNext', 'Mem', '8bit',  stageId, '=', 'Value', '', 0],
  ['AndNext', 'Mem', '8bit',  lives,   '=', 'Value', '', 3],
  ['ResetIf', 'Mem', '16bit', score,   '=', 'Value', '', 0],
];

/* ----------------------------- */

// Continuous skateboard ride: Every frame the score goes up by 1
const rideContinuous = (frames) => $(
  ['SubSource',  'Delta', '16bit', score],
  ['ResetIf',    'Mem',   '16bit', score,   '!=', 'Value', '', 1],
  ['MeasuredIf', 'Mem',   '8bit',  stageId, '=',  'Value', '', StageEnum.Stage1_1],
  ['Measured%',  'Mem',   '8bit',  stageId, '=',  'Value', '', StageEnum.Stage1_1, frames],
);

set.addAchievement({
  id: 654844,
  title: 'Way Before THPS2',
  description: 'Ride a skateboard for 5 seconds in Central Park',
  points: 3,
  type: 'missable',
  conditions: rideContinuous(5 * 60),
});

set.addAchievement({
  id: 654846,
  title: 'Friendly Neighborhood Spider-Man',
  description: 'Don\'t hit any innocent civilians in Central Park',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      // Hitting an innocent costs 15 points, the only score decrease in world 1
      ['PauseIf', 'Delta', '16bit', score,   '>', 'Mem',   '16bit', score,              1],
      // Don't prime on startup of game
      ['OrNext',  'Mem',   '8bit',  stageId, '=', 'Value', '',      StageEnum.Stage1_1],
      ['',        'Prior', '8bit',  stageId, '=', 'Value', '',      StageEnum.Stage1_1],
      ...stageCleared(StageEnum.Stage1_1, 'Trigger'),
    ),
    alt1: $(
      ...newGame(),
    ),
  },
});

set.addAchievement({
  id: 654845,
  title: 'Marked for Death',
  description: 'Beat Stage 1',
  points: 5,
  type: 'progression',
  conditions: {
    // After the boss the game always throws you down to tower 1, so 1-3 ends with 0x02 -> 0x00
    core: $(
      ...stageCleared(StageEnum.Stage1_3Tower1),
    ),
  },
});

set.addAchievement({
  id: 654847,
  title: 'Orb Hiest', // Yes, the same typo they used on "Jewelry Hiest"
  description: 'Collect both power-ups in Stage 2',
  points: 3,
  type: 'missable',
  conditions: {
    core: $(
      // One capped hit per stage
      ...newGame(),
      ['AndNext',  'Mem',   '8bit', stageId, '=', 'Value', '',     StageEnum.Stage2_1],
      ['AddHits',  'Delta', '8bit', power,   '<', 'Mem',   '8bit', power,              1],
      ['AndNext',  'Mem',   '8bit', stageId, '=', 'Value', '',     StageEnum.Stage2_2],
      ['AddHits',  'Delta', '8bit', power,   '<', 'Mem',   '8bit', power,              1],
      ['Measured', 'Value', '',     0,       '=', 'Value', '',     1,                  2],
    ),
  },
});


set.addAchievement({
  id: 654848,
  title: 'Enter Electro',
  description: 'Beat Stage 2',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...stageCleared(StageEnum.Stage2_2),
    ),
  },
});

set.addAchievement({
  id: 654849,
  title: 'Ain\'t Got Time for Autoscrollers',
  description: 'Use the secret exit in stage 3-4',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      // The regular exit is at the end of the autoscroller (map X = 60), the secret one at map X = 28
      ['', 'Mem', '8bit', mapPosX, '<', 'Value', '', 50],
      ...stageCleared(StageEnum.Stage3_4),
    ),
  },
});

set.addAchievement({
  id: 654850,
  title: 'The Scorpion\'s Tale',
  description: 'Beat Stage 3',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...stageCleared(StageEnum.Stage3_5),
    ),
  },
});

set.addAchievement({
  id: 654851,
  title: 'Web of Spider-Man',
  description: 'Beat the Scorpion, Tarantula and Black Widow without using web shots',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      // Dying restarts 4-1 with all bosses back, so a lost life or entering 4-1 releases the lock
      ['AndNext',     'Delta', '8bit', stageId,     '!=', 'Value', '',     StageEnum.Stage4_1],
      ['OrNext',      'Mem',   '8bit', stageId,     '=',  'Value', '',     StageEnum.Stage4_1],
      ['ResetNextIf', 'Delta', '8bit', lives,       '>',  'Mem',   '8bit', lives],
      ['AndNext',     'Mem',   '8bit', stageId,     '=',  'Value', '',     StageEnum.Stage4_1],
      ['PauseIf',     'Mem',   '8bit', playerState, '=',  'Value', '',     PlayerStateEnum.WebShot, 1],
      // Trigger icon while in 4-1 (and on the frames between leaving it and the score screen)
      ['OrNext',      'Mem',   '8bit', stageId,     '=',  'Value', '',     StageEnum.Stage4_1],
      ['',            'Prior', '8bit', stageId,     '=',  'Value', '',     StageEnum.Stage4_1],
      ...stageCleared(StageEnum.Stage4_1, 'Trigger'),
    ),
  },
});

set.addAchievement({
  id: 654852,
  title: 'Deconstruction',
  description: 'Beat Stage 4',
  points: 10,
  type: 'progression',
  conditions: {
    core: $(
      ...stageCleared(StageEnum.Stage4_2),
    ),
  },
});

set.addAchievement({
  id: 654853,
  title: 'The Ultimate Spider-Slayer Slayer',
  description: 'Beat Stage 5 and finish the game',
  points: 25,
  type: 'progression',
  conditions: {
    core: $(
      ...stageCleared(StageEnum.Stage5_3),
    ),
  },
});

set.addAchievement({
  id: 654854,
  title: 'Face It, Tiger... You Just Hit the Jackpot',
  description: 'Reach the maximum Power of 4',
  points: 5,
  type: 'missable',
  conditions: {
    // The power-ups are in 1-3, 2-1, 2-2 and 5-2 and never respawn, so the 4th is always the 5-2 one
    core: $(
      ['',         'Mem',   '8bit', stageId, '=', 'Value', '', StageEnum.Stage5_2],
      ['',         'Delta', '8bit', power,   '=', 'Value', '', 3],
      ['Measured', 'Mem',   '8bit', power,   '=', 'Value', '', 4],
    ),
  },
});

set.addAchievement({
  id: 654855,
  title: 'Spider-Armor',
  description: 'Collect both invulnerability pick-ups',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      // The pickup sets the timer to 80 (getting hit only to 15), and respawns after a death
      ['AndNext',  'Delta', '8bit', stageId,            '=', 'Value', '', StageEnum.Stage1_2],
      ['AddHits',  'Delta', '8bit', invincibilityTimer, '>', 'Value', '', 15,                 1],
      ['AndNext',  'Delta', '8bit', stageId,            '=', 'Value', '', StageEnum.Stage4_2],
      ['AddHits',  'Delta', '8bit', invincibilityTimer, '>', 'Value', '', 15,                 1],
      ['',         'Value', '',     0,                  '=', 'Value', '', 1,                  1],
      ['AndNext',  'Mem',   '8bit', stageId,            '=', 'Value', '', StageEnum.Stage1_2],
      ['AddHits',  'Mem',   '8bit', invincibilityTimer, '>', 'Value', '', 15,                 1],
      ['AndNext',  'Mem',   '8bit', stageId,            '=', 'Value', '', StageEnum.Stage4_2],
      ['AddHits',  'Mem',   '8bit', invincibilityTimer, '>', 'Value', '', 15,                 1],
      ['Measured', 'Value', '',     0,                  '=', 'Value', '', 1,                  2],
      ...newGame(),
    ),
  },
});

set.addAchievement({
  id: 654856,
  title: 'Not-So-Sinister Six',
  description: 'Collect all 5 extra lives',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      // A new game also raises lives (to 3), but the reset fires on that same frame
      ['Measured', 'Delta', '8bit', lives, '<', 'Mem', '8bit', lives, 5],
      ...newGame(),
    ),
  },
});

set.addAchievement({
  id: 654857,
  title: 'Spectacular Spider-Man',
  description: 'Reach a score of 50,000',
  points: 10,
  conditions: {
    // Score is stored / 10. Stage ID is garbage after power-on until a new game, 4-2 (0x10) is the highest valid ID
    core: $(
      ['', 'Mem',   '8bit',  stageId, '<=', 'Value', '', StageEnum.Stage4_2],
      ['', 'Delta', '16bit', score,   '<',  'Value', '', 5000],
      ['', 'Mem',   '16bit', score,   '>=', 'Value', '', 5000],
    ),
  },
});

set.addAchievement({
  id: 654858,
  title: 'Superior Spider-Man',
  description: 'Beat the game without dying',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      // A lost life locks the achievement until a new game
      ['PauseIf', 'Delta', '8bit', lives, '>', 'Mem', '8bit', lives, 1],
      ...stageCleared(StageEnum.Stage5_3),
    ),
    alt1: $(
      ...newGame(),
    ),
  },
});

/* ----------------------------- */

set.addLeaderboard({
  title: 'High Score',
  description: 'Score the most points',
  lowerIsBetter: false,
  type: 'SCORE',
  conditions: {
    start: {
      core: $(
        ['', 'Mem', '8bit', stageId, '=', 'Value', '', 0],
      ),
      // Game over: back on the title the score resets and lives go 0 -> 3
      // The hi-score is updated on that frame, which excludes the new game after power-on (garbage score > hi-score)
      alt1: $(
        ['', 'Delta', '8bit',  lives, '=',  'Value', '',      0],
        ['', 'Mem',   '8bit',  lives, '=',  'Value', '',      3],
        ['', 'Delta', '16bit', score, '>',  'Value', '',      0],
        ['', 'Mem',   '16bit', score, '=',  'Value', '',      0],
        ['', 'Delta', '16bit', score, '<=', 'Mem',   '16bit', hiScore],
      ),
      // Game beaten: set after the final bonus count-up
      alt2: $(
        ['', 'Delta', '8bit', gameBeaten, '=', 'Value', '', 0],
        ['', 'Mem',   '8bit', gameBeaten, '=', 'Value', '', 1],
      ),
    },
    cancel: '0=1',
    submit: '0=0',
    value: $(
      // Score is stored / 10, Delta because the score is already reset on the game over frame
      ['Measured', 'Delta', '16bit', score, '*', 'Value', '', 10],
    ),
  },
});

export default set;
