import {AchievementSet, define as $} from '@cruncheevos/core';
const set = new AchievementSet({gameId: 22119, title: 'Hugo 2'});

const cheatIndicator = 0xc2fa; // 0 = no cheat, 1 = infinite lives, 2 = logs deal no damage in forest
const lives = 0xdf52;

const lastCompletedStage = 0xdf42;
const stage = 0xffed;

const StageEnum = {
  Forest: 0x00,
  Snowboard: 0x01,
  Swimmer: 0x02,
  IceCave: 0x03,
  WitchEndgame: 0x04,
  EndgamePart2: 0x05,
  Ending: 0x06,
};

const scene = 0xc2d3;
const SceneEnum = {
  StageIntroCardAndTransition: 0x00,
  ForestAndStageStart: 0x01,
  Snowboard: 0x02,
  Swimmer: 0x03,
  IceCave: 0x0a,
  IceCaveSymbolDoor: 0x0b,
  EndgamePart2: 0x0c,
  WitchEndgame: 0x0d,
  Ending: 0x0e,
};

const score10k = 0xc1a0;
const score1k = 0xc1a1;
const score100 = 0xc1a2;
const score10 = 0xc1a3;
const score1 = 0xc1a4;

const difficulty = 0xdeaf; // 0 = Easy, 1 = Normal, 2 = Difficult
const heroVerticalState = 0xffce; // 0x00 = on ground, 0x10 = rising, 0x20 = falling


const progression = (levelId, hard) => {
  const arr = [
    ['', 'Delta', '8bit', lastCompletedStage, '!=', 'Value', '', levelId],
    ['', 'Mem',   '8bit', lastCompletedStage, '=',  'Value', '', levelId],
    ['', 'Mem',   '8bit', stage,              '=',  'Value', '', levelId],
    // No cheats allowed
    ['', 'Mem',   '8bit', cheatIndicator,     '=',  'Value', '', 0],
  ];
  if (hard) {
    arr.push(
      // Difficulty = hard
      ['', 'Mem', '8bit', difficulty, '=', 'Value', '', 2],
    );
  }
  return arr;
};

const deathlessProgression = (levelId) => {
  return [
    // Checkpoint: title screen -> intro card (new game) or a stage was completed, but not the ice cave itself
    ['AndNext', 'Delta', '8bit', scene,              '=',  'Value', '',     levelId],
    ['OrNext',  'Mem',   '8bit', scene,              '=',  'Value', '',     SceneEnum.StageIntroCardAndTransition],
    ['AndNext', 'Mem',   '8bit', lastCompletedStage, '!=', 'Delta', '8bit', lastCompletedStage],
    ['',        'Mem',   '8bit', lastCompletedStage, '!=', 'Value', '',     levelId,                               1],
    // Lost a life (skip the new-game write 0xFF -> 3)
    ['AndNext', 'Delta', '8bit', lives,              '!=', 'Value', '',     0xFF],
    ['ResetIf', 'Mem',   '8bit', lives,              '<',  'Delta', '8bit', lives],
    // Game over (0 -> 0xFF isn't caught above)
    ['ResetIf', 'Mem',   '8bit', lives,              '=',  'Value', '',     0xFF],
    ...progression(levelId),
  ];
};

const scoreReached = (score) => {
  return [
    // Score was below "score" in last frame, and is now "score" or higher
    ['AddSource', 'Delta', '8bit', score10k, '*', 'Value', '', 10000],
    ['AddSource', 'Delta', '8bit', score1k,  '*', 'Value', '', 1000],
    ['AddSource', 'Delta', '8bit', score100, '*', 'Value', '', 100],
    ['AddSource', 'Delta', '8bit', score10,  '*', 'Value', '', 10],
    ['',          'Delta', '8bit', score1,   '<', 'Value', '', score],

    ['AddSource', 'Mem', '8bit', score10k, '*',  'Value', '', 10000],
    ['AddSource', 'Mem', '8bit', score1k,  '*',  'Value', '', 1000],
    ['AddSource', 'Mem', '8bit', score100, '*',  'Value', '', 100],
    ['AddSource', 'Mem', '8bit', score10,  '*',  'Value', '', 10],
    ['',          'Mem', '8bit', score1,   '>=', 'Value', '', score],
  ];
};

/* ----------------------------- */

set.addAchievement({
  title: 'Now, What Were Those Symbols Again?',
  description: 'Beat the Ice Cave minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.IceCave),
  ),
});

set.addAchievement({
  title: 'Cool Under Pressure',
  description: 'Beat the Ice Cave minigame on Hard',
  points: 5,
  conditions: $(
    ...progression(StageEnum.IceCave, true),
  ),
});

set.addAchievement({
  title: 'Walking on Thin Ice',
  description: 'Beat the Ice Cave minigame without dying',
  points: 10,
  conditions: $(
    ...deathlessProgression(StageEnum.IceCave),
  ),
});


const IceCaveJumpLimit = 32;

set.addAchievement({
  title: 'Jump Scary',
  description: 'Beat the Ice Cave minigame by jumping no more than 32 times',
  points: 5,
  conditions: $(
    // Checkpoint: entering the Ice Cave from the intro card
    ['AndNext', 'Delta', '8bit', scene, '=', 'Value', '', SceneEnum.StageIntroCardAndTransition],
    ['AndNext', 'Mem',   '8bit', scene, '=', 'Value', '', SceneEnum.ForestAndStageStart],
    ['',        'Mem',   '8bit', stage, '=', 'Value', '', StageEnum.IceCave,                     1],

    // Count jumps (ground -> rising) in the pillar section; reset on jump X+1
    ['AndNext', 'Mem',   '8bit', scene,             '=', 'Value', '', SceneEnum.IceCave],
    ['AndNext', 'Delta', '8bit', heroVerticalState, '=', 'Value', '', 0x00],
    ['ResetIf', 'Mem',   '8bit', heroVerticalState, '=', 'Value', '', 0x10,              IceCaveJumpLimit + 1],

    // Game over
    ['ResetIf', 'Mem',   '8bit', lives, '=', 'Value', '', 0xFF],

    // Still in the Ice Cave, no cheats -> challenge icon is shown while these hold
    ['',        'Mem',   '8bit', stage,              '=',  'Value', '', StageEnum.IceCave],
    ['',        'Mem',   '8bit', cheatIndicator,     '=',  'Value', '', 0],
    // Completion
    ['Trigger', 'Delta', '8bit', lastCompletedStage, '!=', 'Value', '', StageEnum.IceCave],
    ['Trigger', 'Mem',   '8bit', lastCompletedStage, '=',  'Value', '', StageEnum.IceCave],
  ),
});

set.addAchievement({
  title: 'I Think I\'ll Hang Around!',
  description: 'Beat the Forest minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Forest),
  ),
});

set.addAchievement({
  title: 'Out of the Woods',
  description: 'Beat the Forest minigame without dying',
  points: 10,
  conditions: $(
    ...deathlessProgression(StageEnum.Forest),
  ),
});

set.addAchievement({
  title: 'The Forest Doesn\'t Scare Me',
  description: 'Beat the Forest minigame on Hard',
  points: 5,
  conditions: $(
    ...progression(StageEnum.Forest, true),
  ),
});


set.addAchievement({
  title: 'I\'m Gonna Be the Coolest Troll in the World, All Thanks to You!',
  description: 'Beat the Snowboard minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Snowboard),
  ),
});

set.addAchievement({
  title: 'Smooth Riding',
  description: 'Beat the Snowboard minigame without dying',
  points: 25,
  conditions: $(
    ...deathlessProgression(StageEnum.Snowboard),
  ),
});

set.addAchievement({
  title: 'Board to Perfection',
  description: 'Beat the Snowboard minigame on Hard',
  points: 5,
  conditions: $(
    ...progression(StageEnum.Snowboard, true),
  ),
});

const snowboardState = 0xdf7d; // 3 = snowman fight, 4 = snowman hit
const snowmanShotCooldown = 0xdcb8; // set to 0x23 on every shot, then counts down

set.addAchievement({
  title: 'Cold Shot',
  description: 'Defeat a snowman with a single shot',
  points: 3,
  conditions: $(
    // Checkpoint: Snowman fight started
    ['AndNext', 'Mem',   '8bit', stage,          '=',  'Value', '', StageEnum.Snowboard],
    ['AndNext', 'Delta', '8bit', snowboardState, '!=', 'Value', '', 3],
    ['',        'Mem',   '8bit', snowboardState, '=',  'Value', '', 3,                   1],

    // Second shot in the same fight: Reset
    ['AndNext', 'Mem',   '8bit', stage,               '=',  'Value', '', StageEnum.Snowboard],
    ['AndNext', 'Mem',   '8bit', snowboardState,      '=',  'Value', '', 3],
    ['AndNext', 'Delta', '8bit', snowmanShotCooldown, '!=', 'Value', '', 0x23],
    ['ResetIf', 'Mem',   '8bit', snowmanShotCooldown, '=',  'Value', '', 0x23,                2],

    // Fight ended without hitting the Snowman (clears the shot count for the next fight)
    ['AndNext', 'Delta', '8bit', snowboardState, '=',  'Value', '', 3],
    ['AndNext', 'Mem',   '8bit', snowboardState, '!=', 'Value', '', 3],
    ['ResetIf', 'Mem',   '8bit', snowboardState, '!=', 'Value', '', 4],

    // No cheats allowed
    ['', 'Mem', '8bit', cheatIndicator, '=', 'Value', '', 0],

    // Snowman hit
    ['', 'Mem',   '8bit', stage,          '=', 'Value', '', StageEnum.Snowboard],
    ['', 'Delta', '8bit', snowboardState, '=', 'Value', '', 3],
    ['', 'Mem',   '8bit', snowboardState, '=', 'Value', '', 4],
  ),
});

set.addAchievement({
  title: 'Do You Think I\'m A Sand Worm?!',
  description: 'Beat the Swimmer minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Swimmer),
  ),
});

set.addAchievement({
  title: 'Swimming with the Fishes',
  description: 'Beat the Swimmer minigame without dying',
  points: 10,
  conditions: $(
    ...deathlessProgression(StageEnum.Swimmer),
  ),
});

set.addAchievement({
  title: 'Just Keep Swimming',
  description: 'Beat the Swimmer minigame on Hard',
  points: 5,
  conditions: $(
    ...progression(StageEnum.Swimmer, true),
  ),
});

const swimmerHeroY = 0xffd5; // 0x58 = at the surface

const SwimmerRefillLimit = 6;

set.addAchievement({
  title: 'Hold Your Breath',
  description: `Beat the Swimmer minigame while refilling your air no more than ${SwimmerRefillLimit} times - deaths count as refill`,
  points: 5,
  conditions: $(
    // Checkpoint: entering the Swimmer from the intro card
    ['AndNext', 'Delta', '8bit', scene, '=', 'Value', '', SceneEnum.StageIntroCardAndTransition],
    ['AndNext', 'Mem',   '8bit', scene, '=', 'Value', '', SceneEnum.Swimmer],
    ['',        'Mem',   '8bit', stage, '=', 'Value', '', StageEnum.Swimmer,                     1],

    // Count refills: surfacing or losing a life (respawn refills the meter); reset on refill X+1
    ['AndNext', 'Delta', '8bit', swimmerHeroY, '!=', 'Value', '',     0x58],
    ['OrNext',  'Mem',   '8bit', swimmerHeroY, '=',  'Value', '',     0x58],
    ['AndNext', 'Mem',   '8bit', lives,        '<',  'Delta', '8bit', lives],
    ['ResetIf', 'Mem',   '8bit', scene,        '=',  'Value', '',     SceneEnum.Swimmer, SwimmerRefillLimit + 1],

    // Game over
    ['ResetIf', 'Mem',   '8bit', lives, '=', 'Value', '', 0xFF],

    // Still in the Swimmer, no cheats -> challenge icon is shown while these hold
    ['',        'Mem',   '8bit', stage,              '=',  'Value', '', StageEnum.Swimmer],
    ['',        'Mem',   '8bit', cheatIndicator,     '=',  'Value', '', 0],
    // Completion
    ['Trigger', 'Delta', '8bit', lastCompletedStage, '!=', 'Value', '', StageEnum.Swimmer],
    ['Trigger', 'Mem',   '8bit', lastCompletedStage, '=',  'Value', '', StageEnum.Swimmer],
  ),
});

set.addAchievement({
  title: 'Trollerit, Trollerat, Trollerut, This Game Is Kaput!',
  description: 'Beat the Witch\'s Endgame minigame and beat the game',
  points: 25,
  type: 'win_condition',
  conditions: $(
    ...progression(StageEnum.EndgamePart2),
  ),
});

set.addAchievement({
  title: 'Hugo\'s Point Cruise',
  description: 'Reach 1,000 points',
  points: 3,
  conditions: $(
    ...scoreReached(1000),
  ),
});

set.addAchievement({
  title: 'Hugo\'s Point Adventure',
  description: 'Reach 2,000 points',
  points: 5,
  conditions: $(
    ...scoreReached(2000),
  ),
});

set.addAchievement({
  title: 'Hugo\'s Point Extravaganza',
  description: 'Reach 3,000 points',
  points: 10,
  conditions: $(
    ...scoreReached(3000),
  ),
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
        // No cheats allowed
        ['', 'Mem', '8bit', cheatIndicator, '=', 'Value', '', 0],
      ),
      // Game over (lives 0 -> 0xFF)
      alt1: $(
        ['', 'Delta', '8bit', lives, '=', 'Value', '', 0],
        ['', 'Mem',   '8bit', lives, '=', 'Value', '', 0xFF],
      ),
      // Game beaten: ending converted the last remaining life into points
      alt2: $(
        ['', 'Mem',   '8bit', stage, '=', 'Value', '', StageEnum.Ending],
        ['', 'Delta', '8bit', lives, '=', 'Value', '', 1],
        ['', 'Mem',   '8bit', lives, '=', 'Value', '', 0],
      ),
      // Game beaten with 0 lives left: the ending has no lives to convert
      alt3: $(
        ['', 'Delta', '8bit', stage, '=', 'Value', '', StageEnum.EndgamePart2],
        ['', 'Mem',   '8bit', stage, '=', 'Value', '', StageEnum.Ending],
        ['', 'Mem',   '8bit', lives, '=', 'Value', '', 0],
      ),
    },
    cancel: '0=1',
    submit: '0=0',
    value: $(
      ['AddSource', 'Mem', '8bit', score10k, '*', 'Value', '', 10000],
      ['AddSource', 'Mem', '8bit', score1k,  '*', 'Value', '', 1000],
      ['AddSource', 'Mem', '8bit', score100, '*', 'Value', '', 100],
      ['AddSource', 'Mem', '8bit', score10,  '*', 'Value', '', 10],
      ['Measured',  'Mem', '8bit', score1],
    ),
  },
});

export default set;
