import {AchievementSet, define as $} from '@cruncheevos/core';
const set = new AchievementSet({gameId: 2574, title: 'Terminator 2: Judgment Day'});

const level = 0xd0df; // 1-6
const levelEndCode = 0xd0ea; // 0 during play, set once when a level ends
const LevelEndCodeEnum = {
  GameOver: 0x01, // Value after any game over text screen, until the next level init
  Level1Complete: 0x06,
  Level2Complete: 0x07,
  Level3Complete: 0x08,
  Level4Complete: 0x0c,
  Level5Complete: 0x0e,
  Level6Complete: 0x0f,
};
const score = 0xd0aa; // 16-bit, binary
const loopFrameCounter = 0xd0d7; // Increments during game, frozen while paused and during text screens
const playerX = 0xdbcf;

const progression = (levelId, code, trigger) => [
  ['AndNext',                'Mem',   '8bit', level,        '=', 'Value', '', levelId],
  ['AndNext',                'Delta', '8bit', levelEndCode, '=', 'Value', '', 0],
  [trigger ? 'Trigger' : '', 'Mem',   '8bit', levelEndCode, '=', 'Value', '', code],
];

/* -------------------------------- */

set.addAchievement({
  title: 'Kill the Hunter Killer',
  description: 'Destroy the HK-Tank in Los Angeles 2029 A.D. and complete level 1',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(1, LevelEndCodeEnum.Level1Complete),
    ),
  },
});

const level1HintColumn = 0xd100; // 0x6c, set to 0 when the hint is picked up

set.addAchievement({
  title: 'Thanks for the Tip, Mom!',
  description: 'Get the flashing hint in Los Angeles 2029 A.D. in level 1',
  points: 1,
  type: 'missable',
  conditions: $(
    ['', 'Mem',   '8bit', level,            '=', 'Value', '', 1],
    ['', 'Delta', '8bit', level1HintColumn, '=', 'Value', '', 0x6c],
    ['', 'Mem',   '8bit', level1HintColumn, '=', 'Value', '', 0],
  ),
});

const mines = [0xddae, 0xddb2, 0xddb6, 0xddba, 0xddbe, 0xddc2, 0xddc6, 0xddca, 0xddce];

set.addAchievement({
  title: 'Mines and Mines Alone',
  description: 'Complete level 1 while not stepping on any mines',
  points: 3,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', mines[0], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[1], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[2], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[3], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[4], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[5], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[6], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[7], '!=', 'Value', '', 0],
      ['', 'Mem', '8bit', mines[8], '!=', 'Value', '', 0],
      ...progression(1, LevelEndCodeEnum.Level1Complete, true),
    ),
  },
});

set.addAchievement({
  title: 'We Got Skynet by the Balls Now, Don\'t We?',
  description: 'Enter the correct room in Skynet and complete level 2',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(2, LevelEndCodeEnum.Level2Complete),
  ),
});

const level2HintCollected = 0xd139; // 0 -> 1
const level2Timer = 0xd0e9; // Timer arrow x, stops at 0xa3
const level2TimerEnd = 0xa3;

set.addAchievement({
  title: 'Thanks for the Hustle, Mom!',
  description: 'Get the flashing hint in Skynet and enter the correct room before the timer expires in level 2',
  points: 3,
  type: 'missable',
  conditions: $(
    ['', 'Mem', '8bit', level2HintCollected, '=', 'Value', '', 1],
    ['', 'Mem', '8bit', level2Timer,         '<', 'Value', '', level2TimerEnd],
    ...progression(2, LevelEndCodeEnum.Level2Complete, true),
  ),
});

const mysteriousPersonSpawned = 0xd0e8; // 0 -> 1

set.addAchievement({
  title: 'After You, Savior of Humanity',
  description: 'Wait for a mysterious person to appear and enter the correct room at the end of Skynet (Level 2)',
  points: 3,
  type: 'missable',
  conditions: $(
    // Only spawns once the final room is reached and the timer is past 0x83
    ['', 'Mem', '8bit', mysteriousPersonSpawned, '=', 'Value', '', 1],
    ...progression(2, LevelEndCodeEnum.Level2Complete, true),
  ),
});

set.addAchievement({
  title: 'You Reprogrammed Me to Be Your Protector',
  description: 'Reprogram all 3 boards of the T-800 and complete level 3',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ...progression(3, LevelEndCodeEnum.Level3Complete),
    ),
  },
});

const level3ChancesLeft = 0xd0fd; // 2 on new game, -1 per timeout

set.addAchievement({
  title: 'Who Sent You?',
  description: 'Reprogram all 3 boards of the T-800 without failing once in level 3',
  points: 2,
  type: 'missable',
  conditions: {
    core: $(
      ['', 'Mem', '8bit', level3ChancesLeft, '=', 'Value', '', 2],
      ...progression(3, LevelEndCodeEnum.Level3Complete, true),
    ),
  },
});

set.addAchievement({
  title: 'My Mission Is to Protect You',
  description: 'Survive and blast apart the T-1000\'s Freightliner and complete level 4',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(4, LevelEndCodeEnum.Level4Complete),
  ),
});

const level4RightSideX = 0x80; // TODO verify "right side of the screen" threshold

set.addAchievement({
  title: 'We Have to Get Out of the City Immediately',
  description: 'Destroy the T-1000\'s Freightliner without touching the right side of the screen in level 4',
  points: 3,
  type: 'missable',
  conditions: {
    core: $(
      // Checkpoint: level 4 started
      ['',        'Mem', '8bit', level,        '=',  'Value', '', 4,                1],
      ['ResetIf', 'Mem', '8bit', level,        '!=', 'Value', '', 4],
      // Only during play, not during the end animation / text screen
      ['AndNext', 'Mem', '8bit', levelEndCode, '=',  'Value', '', 0],
      ['ResetIf', 'Mem', '8bit', playerX,      '>=', 'Value', '', level4RightSideX],
      ...progression(4, LevelEndCodeEnum.Level4Complete, true),
    ),
  },
});

set.addAchievement({
  title: 'I Was Wondering if You Know Where It Came From?',
  description: 'Collect the T-800 arm and escape Cyberdyne anc complete level 5',
  points: 5,
  type: 'progression',
  conditions: $(
    ...progression(5, LevelEndCodeEnum.Level5Complete),
  ),
});

const slot6Type = 0xdc54;
const slot6EntryIndex = 0xdc62; // Index into the level 5 item list
const slot6IsArm = 0xdc65; // 1 = arm, 0 = keycard

// TODO verify which keycard is the one at the exit (column 0x4d, last in the level)
const level5ExitKeycardIndex = 1;
const level5ArmEntry = 0xde0a; // 4th entry of the item list
const level5ItemType = 0x32; // Object type of keycard / arm on screen (slot 6)
const level5ExitKeycardEntry = 0xde02; // 2nd entry of the item list

set.addAchievement({
  title: 'It Gave Us Ideas, Took Us in New Directions',
  description: 'Collect the T-800 arm before collecting the key at the exit of Cyberdyne in level 5',
  points: 2,
  type: 'missable',
  conditions: $(
    ['ResetIf', 'Mem', '8bit', level, '!=', 'Value', '', 5],

    // TODO verify
    // Checkpoint: arm picked up. The item object (slot 6) disappears and its list entry stays 0
    // (when it only scrolls off screen, the column is written back to the list)
    ['AndNext', 'Delta', '8bit', slot6Type,      '=', 'Value', '', level5ItemType],
    ['AndNext', 'Delta', '8bit', slot6IsArm,     '=', 'Value', '', 1],
    ['AndNext', 'Mem',   '8bit', slot6Type,      '=', 'Value', '', 0],
    ['',        'Mem',   '8bit', level5ArmEntry, '=', 'Value', '', 0,              1],

    // Exit keycard picked up. It can only be picked up once, so picking it up before the arm skips the trigger for good
    ['', 'Delta', '8bit', slot6Type,              '=', 'Value', '', level5ItemType],
    ['', 'Delta', '8bit', slot6IsArm,             '=', 'Value', '', 0],
    ['', 'Delta', '8bit', slot6EntryIndex,        '=', 'Value', '', level5ExitKeycardIndex],
    ['', 'Mem',   '8bit', slot6Type,              '=', 'Value', '', 0],
    ['', 'Mem',   '8bit', level5ExitKeycardEntry, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  title: 'Terminated',
  description: 'Defeat the T-1000 by blasting him into the foundry melt pool and beat the game',
  points: 25,
  type: 'win_condition',
  conditions: $(
    ...progression(6, LevelEndCodeEnum.Level6Complete),
  ),
});

const playerState = 0xdbbc;
const t1000TrueForm = 0xd136; // 0 -> 1 when the T-1000 runs out of HP

set.addAchievement({
  title: 'Advanced Prototype',
  description: 'Use punches to turn the T-1000 into its true form before defeating it - using guns first is allowed',
  points: 3,
  type: 'missable',
  conditions: $(
    ['', 'Mem',   '8bit', level,         '=', 'Value', '', 6],
    ['', 'Mem',   '8bit', playerState,   '=', 'Value', '', 0x85], // 0x85 = punching
    ['', 'Delta', '8bit', t1000TrueForm, '=', 'Value', '', 0],
    ['', 'Mem',   '8bit', t1000TrueForm, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  title: 'Hey Bro, I\'m Gonna Get Some Quarters',
  description: 'Beat the game with at least 2500 points as your high score',
  points: 5,
  type: 'missable',
  conditions: $(
    ['', 'Mem', '16bit', score, '>=', 'Value', '', 2500],
    ...progression(6, LevelEndCodeEnum.Level6Complete),
  ),
});

set.addAchievement({
  title: 'Drive Faster',
  description: 'Beat the game in fewer than ten minutes',
  points: 10,
  type: 'missable',
  conditions: {
    core: $(
      // Checkpoint: new game started (level 1)
      ['',        'Mem', '8bit', level,            '=',  'Value', '',     1,                         1],
      ['ResetIf', 'Mem', '8bit', levelEndCode,     '=',  'Value', '',     LevelEndCodeEnum.GameOver],
      // 10 minutes at 60 main loop frames per second
      ['ResetIf', 'Mem', '8bit', loopFrameCounter, '!=', 'Delta', '8bit', loopFrameCounter,          60 * 60 * 10],
      ...progression(6, LevelEndCodeEnum.Level6Complete),
    ),
  },
});

export default set;
