import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 22119, title: 'Hugo 2' })

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
}

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
}

const score10k = 0xc1a0;
const score1k = 0xc1a1;
const score100 = 0xc1a2;
const score10 = 0xc1a3;
const score1 = 0xc1a4;

const difficulty = 0xdeaf; // 0 = Easy, 1 = Normal, 2 = Difficult

const progression = (levelId) => {
  return [
    ['', 'Delta', '8bit', lastCompletedStage, '!=', 'Value', '', levelId],
    ['', 'Mem',   '8bit', lastCompletedStage, '=',  'Value', '', levelId],
    ['', 'Mem',   '8bit', stage, '=',  'Value', '', levelId],
    // No cheats allowed
    ['', 'Mem',   '8bit', cheatIndicator, '=',  'Value', '', 0],
  ];
};

const deathlessProgression = (levelId) => {
  return [
    // Checkpoint: title screen -> intro card (new game) or a stage was completed, but not the ice cave itself
    ['AndNext', 'Delta', '8bit', scene,              '=',  'Value', '',     levelId],
    ['OrNext',  'Mem',   '8bit', scene,              '=',  'Value', '',     SceneEnum.StageIntroCardAndTransition],
    ['AndNext', 'Mem',   '8bit', lastCompletedStage, '!=', 'Delta', '8bit', lastCompletedStage],
    ['',        'Mem',   '8bit', lastCompletedStage, '!=', 'Value', '',     levelId, 1],
    // Lost a life (skip the new-game write 0xFF -> 3)
    ['AndNext', 'Delta', '8bit', lives, '!=', 'Value', '',     0xFF],
    ['ResetIf', 'Mem',   '8bit', lives, '<',  'Delta', '8bit', lives],
    // Game over (0 -> 0xFF isn't caught above)
    ['ResetIf', 'Mem',   '8bit', lives, '=',  'Value', '',     0xFF],
    ...progression(levelId)
  ];
};

const scoreReached = (score) => {
  return [
    // Score was below "score" in last frame, and is now "score" or higher
    ['AddSource', 'Delta', '8bit', score10k,  '*', 'Value', '', 10000],
    ['AddSource', 'Delta', '8bit', score1k,   '*', 'Value', '', 1000],
    ['AddSource', 'Delta', '8bit', score100,  '*', 'Value', '', 100],
    ['AddSource', 'Delta', '8bit', score10,   '*', 'Value', '', 10],
    ['',          'Delta', '8bit', score1,    '<', 'Value', '', score],

    ['AddSource', 'Mem', '8bit', score10k,  '*',  'Value', '', 10000],
    ['AddSource', 'Mem', '8bit', score1k,   '*',  'Value', '', 1000],
    ['AddSource', 'Mem', '8bit', score100,  '*',  'Value', '', 100],
    ['AddSource', 'Mem', '8bit', score10,   '*',  'Value', '', 10],
    ['',          'Mem', '8bit', score1,    '>=', 'Value', '', score],
  ];
};

/* ----------------------------- */

set.addAchievement({
  title: 'Now, What Were Those Symbols Again?',
  description: 'Complete the Ice Cave minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.IceCave)
  ),
})

// TODO
/*
TODO hard titles?
Just Keep Swimming
Snow Worries / Board to Perfection
The Forest Doesn't Scare Me
Cool Under Pressure
*/
set.addAchievement({
  title: 'Cool Under Pressure',
  description: 'Complete the Ice Cave minigame on Hard',
  points: 5,
  conditions: $(
    // difficulty
    ['', 'Mem', '8bit', difficulty, '=', 'Value', '', 2],
    ...progression(StageEnum.IceCave)
  ),
})

set.addAchievement({
  title: 'Walking on Thin Ice',
  description: 'Complete the Ice Cave minigame without dying',
  points: 10,
  conditions: $(
    ...deathlessProgression(StageEnum.IceCave)
  ),
});

set.addAchievement({
  title: `I Think I'll Hang Around!`,
  description: 'Complete the Forest minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Forest)
  ),
});

set.addAchievement({
  title: 'Out of the Woods',
  description: 'Complete the Forest minigame without dying',
  points: 10,
  conditions: $(
    ...deathlessProgression(StageEnum.Forest)
  ),
});

set.addAchievement({
  title: `I'm Gonna Be the Coolest Troll in the World, All Thanks to You!`,
  description: 'Complete the Snowboard minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Snowboard)
  ),
});

set.addAchievement({
  title: 'Smooth Riding',
  description: 'Complete the Snowboard minigame without dying',
  points: 25,
  conditions: $(
    ...deathlessProgression(StageEnum.Snowboard)
  ),
})

set.addAchievement({
  title: `Do You Think I'm A Sand Worm?!`,
  description: 'Complete the Swimmer minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Swimmer)
  ),
});

set.addAchievement({
  title: 'Swimming with the Fishes',
  description: 'Complete the Swimmer minigame without dying',
  points: 10,
  conditions: $(
    ...deathlessProgression(StageEnum.Swimmer)
  ),
});

set.addAchievement({
  title: 'Trollerit, Trollerat, Trollerut, This Game Is Kaput!',
  description: `Complete the Witch's Endgame minigame and beat the game`,
  points: 25,
  type: 'win_condition',
  conditions: $(
    ...progression(StageEnum.EndgamePart2)
  ),
});

set.addAchievement({
  title: `Hugo's Point Cruise`,
  description: 'Reach 1,000 points',
  points: 3,
  conditions: $(
    ...scoreReached(1000)
  ),
});

set.addAchievement({
  title: `Hugo's Point Adventure`,
  description: 'Reach 2,000 points',
  points: 5,
  conditions: $(
    ...scoreReached(2000)
  ),
});

set.addAchievement({
  title: `Hugo's Point Extravaganza`,
  description: 'Reach 3,000 points',
  points: 10,
  conditions: $(
    ...scoreReached(3000)
  ),
});

export default set;
