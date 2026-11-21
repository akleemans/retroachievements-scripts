import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 2570, title: 'Spider-Man 3: Invasion of the Spider-Slayers'});

const stageId = 0x00ffcc;
const score = 0x00d070;
const lives = 0x00d043;

const StageEnum = {
  Stage1_1: 0x01,
  Stage1_3Tower1: 0x02,
  Stage1_3Tower2: 0x03,
};

// Stage ID goes from target stage to 0, and a bit later the score goes up
const stageCleared = (stage, flag = '') => [
  [flag, 'Prior', '8bit',  stageId, '=',  'Value', '',    stage],
  [flag, 'Mem',   '8bit',  stageId, '=',  'Value', '',    0],
  [flag, 'Delta',   '16bit', score,   '<',  'Mem', '16bit', score],
];

const resetNextOnNewGame = () => [
  ['AndNext',     'Mem', '8bit',  stageId, '=', 'Value', '', 0],
  ['AndNext',     'Mem', '8bit',  lives,   '=', 'Value', '', 3],
  ['ResetNextIf', 'Mem', '16bit', score,   '=', 'Value', '', 0],
];

/* ----------------------------- */

// Continuous skateboard ride: Every frame the score goes up by 1
const rideContinuous = (frames) => $(
  ['SubSource', 'Delta', '16bit', score],
  ['ResetIf',   'Mem',   '16bit', score,   '!=', 'Value', '', 1],
  ['Measured%',  'Mem',   '8bit',  stageId, '=',  'Value', '', StageEnum.Stage1_1, frames],
);

set.addAchievement({
  title: 'Way before THPS2',
  description: 'Ride a skateboard for 5 seconds',
  points: 3,
  type: 'missable',
  conditions: rideContinuous(5 * 60),
});

set.addAchievement({
  title: 'Friendly Neighborhood Spider-Man',
  description: 'Don\'t hit any innocent civilians in Central Park',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      // Hitting an innocent costs 15 points, the only score decrease in world 1
      ...resetNextOnNewGame(),
      ['PauseIf', 'Delta', '16bit', score, '>', 'Mem', '16bit', score, 1],
      // Don't prime on startup of game
      ['OrNext',  'Mem',   '8bit',  stageId, '=', 'Value', '', StageEnum.Stage1_1],
      ['',        'Prior', '8bit',  stageId, '=', 'Value', '', StageEnum.Stage1_1],
      ...stageCleared(StageEnum.Stage1_1, 'Trigger'),
    ),
  },
});

set.addAchievement({
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


export default set;
