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
const hugoVerticalState = 0xffce; // 0x00 = on ground, 0x10 = rising, 0x20 = falling
const jumpReady = 0xddfa; // Jump detection: 1 once A was released, set to 0 on every jump start

const swimmerHugoY = 0xffd5; // 0x58 = at the surface

// Scene shown when a stage is entered from the intro card (the Ice Cave passes through 0x01 before 0x0a)
const stageStartScene = {
  [StageEnum.Forest]: SceneEnum.ForestAndStageStart,
  [StageEnum.Snowboard]: SceneEnum.Snowboard,
  [StageEnum.Swimmer]: SceneEnum.Swimmer,
  [StageEnum.IceCave]: SceneEnum.ForestAndStageStart,
};

// Checkpoint: entering the stage from the intro card (retries after a death skip the intro card)
const stageEntered = (levelId) => [
  ['AndNext', 'Delta', '8bit', scene, '=', 'Value', '', SceneEnum.StageIntroCardAndTransition],
  ['AndNext', 'Mem',   '8bit', scene, '=', 'Value', '', stageStartScene[levelId]],
  ['',        'Mem',   '8bit', stage, '=', 'Value', '', levelId,                    1],
];

const progression = (levelId, hard) => {
  const arr = [
    ['', 'Delta', '8bit', lastCompletedStage, '!=', 'Value', '', levelId],
    ['', 'Mem',   '8bit', lastCompletedStage, '=',  'Value', '', levelId],
    ['', 'Mem',   '8bit', stage,              '=',  'Value', '', levelId],
    // Not on the intro card: the soft reset after beating the game would look like "Forest completed"
    ['', 'Mem',   '8bit', scene,              '!=', 'Value', '', SceneEnum.StageIntroCardAndTransition],
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
    ...stageEntered(levelId),
    // Lost a life (skip the new-game write 0xFF -> 3)
    ['AndNext', 'Delta', '8bit', lives, '!=', 'Value', '',     0xFF],
    ['ResetIf', 'Mem',   '8bit', lives, '<',  'Delta', '8bit', lives],
    // Game over (0 -> 0xFF isn't caught above)
    ['ResetIf', 'Mem',   '8bit', lives, '=',  'Value', '',     0xFF],
    ...progression(levelId),
  ];
};

const scoreReached = (score) => {
  return [
    // No cheats allowed
    ['', 'Mem', '8bit', cheatIndicator, '=', 'Value', '', 0],

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
  id: '646239',
  badge: '738357',
  title: 'Now, What Were Those Symbols Again?',
  description: 'Beat the Ice Cave minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.IceCave),
  ),
});

set.addAchievement({
  id: '646241',
  badge: '738359',
  title: 'Walking on Thin Ice',
  description: 'Beat the Ice Cave minigame without dying',
  points: 10,
  type: 'missable',
  conditions: $(
    ...deathlessProgression(StageEnum.IceCave),
  ),
});

set.addAchievement({
  id: '646240',
  badge: '738358',
  title: 'Cool Under Pressure',
  description: 'Beat the Ice Cave minigame on Hard',
  points: 5,
  conditions: $(
    ...progression(StageEnum.IceCave, true),
  ),
});


const IceCaveJumpLimit = 32;

set.addAchievement({
  id: '646242',
  badge: '738360',
  title: 'Jump Scary',
  description: 'Beat the Ice Cave minigame by jumping no more than 32 times',
  points: 5,
  type: 'missable',
  conditions: $(
    ...stageEntered(StageEnum.IceCave),

    // Count jumps (ground -> rising) in the pillar section; reset on jump X+1
    ['AndNext', 'Mem',   '8bit', scene,             '=', 'Value', '', SceneEnum.IceCave],
    ['AndNext', 'Delta', '8bit', hugoVerticalState, '=', 'Value', '', 0x00],
    ['ResetIf', 'Mem',   '8bit', hugoVerticalState, '=', 'Value', '', 0x10,              IceCaveJumpLimit + 1],

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
  id: '646243',
  badge: '738361',
  title: 'I Think I\'ll Hang Around!',
  description: 'Beat the Forest minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Forest),
  ),
});

set.addAchievement({
  id: '646244',
  badge: '738362',
  title: 'Out of the Woods',
  description: 'Beat the Forest minigame without dying',
  points: 10,
  type: 'missable',
  conditions: $(
    ...deathlessProgression(StageEnum.Forest),
  ),
});

set.addAchievement({
  id: '646245',
  badge: '738363',
  title: 'The Forest Doesn\'t Scare Me',
  description: 'Beat the Forest minigame on Hard',
  points: 5,
  conditions: $(
    ...progression(StageEnum.Forest, true),
  ),
});

const ForestJumpLimit = 40;

set.addAchievement({
  id: '646246',
  badge: '738364',
  title: 'Energy Saver',
  description: 'Beat the Forest minigame by jumping no more than 40 times',
  points: 5,
  type: 'missable',
  conditions: $(
    ...stageEntered(StageEnum.Forest),

    // Count jumps (JumpPer 1 -> 0); reset on jump X+1
    ['AndNext', 'Mem',   '8bit', scene,     '=', 'Value', '', SceneEnum.ForestAndStageStart],
    ['AndNext', 'Mem',   '8bit', stage,     '=', 'Value', '', StageEnum.Forest],
    ['AndNext', 'Delta', '8bit', jumpReady, '=', 'Value', '', 1],
    ['ResetIf', 'Mem',   '8bit', jumpReady, '=', 'Value', '', 0,                             ForestJumpLimit + 1],

    // Game over
    ['ResetIf', 'Mem',   '8bit', lives, '=', 'Value', '', 0xFF],

    // Still in the Forest, no cheats -> challenge icon is shown while these hold
    ['',        'Mem',   '8bit', stage,              '=',  'Value', '', StageEnum.Forest],
    ['',        'Mem',   '8bit', cheatIndicator,     '=',  'Value', '', 0],
    // Completion
    ['Trigger', 'Delta', '8bit', lastCompletedStage, '!=', 'Value', '', StageEnum.Forest],
    ['Trigger', 'Mem',   '8bit', lastCompletedStage, '=',  'Value', '', StageEnum.Forest],
  ),
});

set.addAchievement({
  id: '646247',
  badge: '738365',
  title: 'I\'m Gonna Be the Coolest Troll in the World, All Thanks to You!',
  description: 'Beat the Snowboard minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Snowboard),
  ),
});

set.addAchievement({
  id: '646248',
  badge: '738366',
  title: 'Smooth Riding',
  description: 'Beat the Snowboard minigame without dying',
  points: 25,
  type: 'missable',
  conditions: $(
    ...deathlessProgression(StageEnum.Snowboard),
  ),
});

set.addAchievement({
  id: '646249',
  badge: '738367',
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
  id: '646250',
  badge: '738368',
  title: 'Cold Shot',
  description: 'Defeat a snowman with your first shot',
  points: 3,
  type: 'missable',
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

    // Not fighting or just hit: clear the shot count, otherwise an odd number of shots (3+)
    // in one fight would carry over and make the first shot of the next fight count as the second
    ['AndNext', 'Mem', '8bit', snowboardState, '!=', 'Value', '', 3],
    ['ResetIf', 'Mem', '8bit', snowboardState, '!=', 'Value', '', 4],

    // No cheats allowed
    ['', 'Mem', '8bit', cheatIndicator, '=', 'Value', '', 0],

    // Snowman hit
    ['', 'Mem',   '8bit', stage,          '=', 'Value', '', StageEnum.Snowboard],
    ['', 'Delta', '8bit', snowboardState, '=', 'Value', '', 3],
    ['', 'Mem',   '8bit', snowboardState, '=', 'Value', '', 4],
  ),
});

set.addAchievement({
  id: '646251',
  badge: '738369',
  title: 'Do You Think I\'m A Sand Worm?!',
  description: 'Beat the Swimmer minigame',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(StageEnum.Swimmer),
  ),
});

set.addAchievement({
  id: '646252',
  badge: '738370',
  title: 'Swimming with the Fishes',
  description: 'Beat the Swimmer minigame without dying',
  points: 10,
  type: 'missable',
  conditions: $(
    ...deathlessProgression(StageEnum.Swimmer),
  ),
});

set.addAchievement({
  id: '646253',
  badge: '738371',
  title: 'Just Keep Swimming',
  description: 'Beat the Swimmer minigame on Hard',
  points: 5,
  conditions: $(
    ...progression(StageEnum.Swimmer, true),
  ),
});

const SwimmerRefillLimit = 6;

set.addAchievement({
  id: '646254',
  badge: '738372',
  title: 'Hold Your Breath',
  description: 'Beat the Swimmer minigame while surfacing no more than 6 times - deaths count as surfacing',
  points: 5,
  type: 'missable',
  conditions: $(
    ...stageEntered(StageEnum.Swimmer),

    // Count refills: surfacing or losing a life (respawn refills the meter); reset on refill X+1
    ['AndNext', 'Delta', '8bit', swimmerHugoY, '!=', 'Value', '',     0x58],
    ['OrNext',  'Mem',   '8bit', swimmerHugoY, '=',  'Value', '',     0x58],
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
  id: '646255',
  badge: '738373',
  title: 'Trollerit, Trollerat, Trollerut, This Game Is Kaput!',
  description: 'Beat the Witch\'s Endgame minigame and beat the game',
  points: 25,
  type: 'win_condition',
  conditions: $(
    ...progression(StageEnum.EndgamePart2),
  ),
});

set.addAchievement({
  id: '646256',
  badge: '738374',
  title: 'Hugo\'s Point Cruise',
  description: 'Reach 1,000 points',
  points: 3,
  conditions: $(
    ...scoreReached(1000),
  ),
});

set.addAchievement({
  id: '646257',
  badge: '738375',
  title: 'Hugo\'s Point Adventure',
  description: 'Reach 2,000 points',
  points: 5,
  conditions: $(
    ...scoreReached(2000),
  ),
});

set.addAchievement({
  id: '646258',
  badge: '738376',
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
