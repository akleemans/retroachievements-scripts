import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 2574, title: 'Terminator 2: Judgment Day' })

set.addAchievement({
  id: 475168,
  badge: '538961',
  title: 'Kill the Hunter Killer',
  description: 'Destroy the HK-Tank in Los Angeles 2029 A.D. (Complete Level 1)',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ['AndNext', 'Mem', '8bit', 0x8132, '=', 'Value', '', 63, 1],
      ['', 'Mem', '8bit', 0x8132, '=', 'Value', '', 4],
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 36]),
    alt2: $(['', 'Mem', '8bit', 0xd004, '=', 'Value', '', 30]),
  },
})

set.addAchievement({
  id: 475174,
  badge: '538967',
  title: 'Thanks for the Tip, Mom!',
  description: 'Get the flashing hint in Los Angeles 2029 A.D. (Level 1)',
  points: 1,
  type: 'missable',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xd0bc, '=', 'Value', '', 1],
    ['', 'Mem', '8bit', 0xd0eb, '=', 'Value', '', 135],
  ),
})

set.addAchievement({
  id: 475176,
  badge: '538969',
  title: 'Mines and Mines Alone',
  description: `Don't step on any mines. Then, destroy the HK-Tank in Los Angeles 2029 A.D. (Level 1)`,
  points: 3,
  type: 'missable',
  conditions: {
    core: $(
      ['AndNext', 'Mem', '8bit', 0x8132, '=', 'Value', '', 63, 1],
      ['', 'Mem', '8bit', 0x8132, '=', 'Value', '', 4],
      ['AndNext', 'Mem', '8bit', 0xddae, '=', 'Value', '', 4],
      ['AndNext', 'Mem', '8bit', 0xddb2, '=', 'Value', '', 36],
      ['AndNext', 'Mem', '8bit', 0xddb6, '=', 'Value', '', 40],
      ['AndNext', 'Mem', '8bit', 0xddba, '=', 'Value', '', 75],
      ['AndNext', 'Mem', '8bit', 0xddbe, '=', 'Value', '', 90],
      ['AndNext', 'Mem', '8bit', 0xddc2, '=', 'Value', '', 95],
      ['AndNext', 'Mem', '8bit', 0xddc6, '=', 'Value', '', 100],
      ['AndNext', 'Mem', '8bit', 0xddca, '=', 'Value', '', 130],
      ['', 'Mem', '8bit', 0xddce, '=', 'Value', '', 148],
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 36]),
    alt2: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 30]),
  },
})

set.addAchievement({
  id: 475169,
  badge: '538962',
  title: `We Got Skynet by the Balls Now, Don't We?`,
  description: 'Enter the correct room in Skynet (Complete Level 2)',
  points: 5,
  type: 'progression',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xdbc9, '=', 'Value', '', 1],
    ['AndNext', 'Mem', '8bit', 0xdbcf, '>=', 'Value', '', 108],
    ['AndNext', 'Mem', '8bit', 0xdbcf, '<=', 'Value', '', 122],
    ['AndNext', 'Mem', '8bit', 0xdbce, '=', 'Value', '', 64],
    ['', 'Mem', '8bit', 0xdbbc, '=', 'Value', '', 134],
  ),
})

set.addAchievement({
  id: 475175,
  badge: '538968',
  title: 'Thanks for the Hustle, Mom!',
  description: 'Get the flashing hint in Skynet and enter the correct room before the timer expires (Level 2)',
  points: 3,
  type: 'missable',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xfe14, '=', 'Value', '', 128],
    ['AndNext', 'Mem', '8bit', 0xfe15, '<', 'Value', '', 163],
    ['AndNext', 'Mem', '8bit', 0xdbc9, '=', 'Value', '', 1],
    ['AndNext', 'Mem', '8bit', 0xdbcf, '>=', 'Value', '', 108],
    ['AndNext', 'Mem', '8bit', 0xdbcf, '<=', 'Value', '', 122],
    ['AndNext', 'Mem', '8bit', 0xdbce, '=', 'Value', '', 64],
    ['', 'Mem', '8bit', 0xdbbc, '=', 'Value', '', 134],
  ),
})

set.addAchievement({
  id: 475183,
  badge: '538976',
  title: 'After You, Savior of Humanity',
  description: 'Wait for a mysterious person to appear and enter the correct room at the end of Skynet (Level 2)',
  points: 3,
  type: 'missable',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xd0bc, '=', 'Value', '', 2],
    ['', 'Mem', '8bit', 0x85c5, '=', 'Value', '', 187],
  ),
})

set.addAchievement({
  id: 475170,
  badge: '538963',
  title: 'You Reprogrammed Me to Be Your Protector',
  description: 'Reprogram all 3 boards of the T-800 (Complete Level 3)',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ['OrNext', 'Mem', '8bit', 0x9801, '=', 'Value', '', 117, 1],
      ['', 'Mem', '8bit', 0x9801, '=', 'Value', '', 102, 1],
      ['AndNext', 'Mem', '8bit', 0xd0f0, '=', 'Value', '', 0],
      ['AndNext', 'Mem', '8bit', 0xd0f1, '=', 'Value', '', 0],
      ['AndNext', 'Mem', '8bit', 0xd0f2, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', 0xd0f3, '=', 'Value', '', 0],
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 36]),
    alt2: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 30]),
  },
})

set.addAchievement({
  id: 475177,
  badge: '538970',
  title: 'Who Sent You?',
  description: 'Reprogram all 3 boards of the T-800 without failing once (Level 3)',
  points: 2,
  type: 'missable',
  conditions: {
    core: $(
      ['PauseIf', 'Mem', '8bit', 0xd0eb, '=', 'Value', '', 70, 1],
      ['OrNext', 'Mem', '8bit', 0x9801, '=', 'Value', '', 102, 1],
      ['', 'Mem', '8bit', 0x9801, '=', 'Value', '', 117, 1],
      ['AndNext', 'Mem', '8bit', 0xd0f0, '=', 'Value', '', 0],
      ['AndNext', 'Mem', '8bit', 0xd0f1, '=', 'Value', '', 0],
      ['AndNext', 'Mem', '8bit', 0xd0f2, '=', 'Value', '', 0],
      ['', 'Mem', '8bit', 0xd0f3, '=', 'Value', '', 0],
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 36]),
    alt2: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 30]),
  },
})

set.addAchievement({
  id: 475171,
  badge: '538964',
  title: 'My Mission Is to Protect You',
  description: `Survive and blast apart the T-1000's Freightliner (Complete Level 4)`,
  points: 5,
  type: 'progression',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xdbb8, '=', 'Value', '', 42],
    ['', 'Mem', '8bit', 0xd11b, '=', 'Value', '', 3],
  ),
})

set.addAchievement({
  id: 475178,
  badge: '538971',
  title: 'We Have to Get Out of the City Immeditately',
  description: `Destroy the T-1000's Frieightliner without touching the right side of the screen (Level 4)`,
  points: 3,
  type: 'missable',
  conditions: {
    core: $(
      ['PauseIf', 'Mem', '8bit', 0xdbcf, '=', 'Value', '', 128, 1],
      ['', 'Mem', '8bit', 0xd11b, '=', 'Value', '', 3],
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 36]),
    alt2: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 30]),
  },
})

set.addAchievement({
  id: 475172,
  badge: '538965',
  title: 'I Was Wondering if You Know Where It Came From?',
  description: 'Collect the T-800 arm and escape Cyberdyne (Complete Level 5)',
  points: 5,
  type: 'progression',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xc011, '=', 'Value', '', 168],
    ['', 'Mem', '8bit', 0xdeaa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 475179,
  badge: '538972',
  title: 'It Gave Us Ideas, Took Us in New Directions',
  description: 'Collect the T-800 arm before collecting the key at the exit of Cyberdyne (Level 5)',
  points: 2,
  type: 'missable',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xdc3f, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xd0eb, '=', 'Value', '', 202],
  ),
})

set.addAchievement({
  id: 475173,
  badge: '538966',
  title: 'Terminated',
  description: 'Defeat the T-1000 by blasting him into the foundry melt pool (Complete Level 6 and beat the game)',
  points: 5,
  type: 'win_condition',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xdbb8, '=', 'Value', '', 60],
    ['', 'Mem', '8bit', 0x8352, '=', 'Value', '', 49],
  ),
})

set.addAchievement({
  id: 475180,
  badge: '538973',
  title: 'Advanced Prototype',
  description: 'Use punches to turn the T-1000 into its true form before defeating it (can use guns first) (Level 6)',
  points: 3,
  type: 'missable',
  conditions: $(
    ['OrNext', 'Mem', '8bit', 0xdbcb, '=', 'Value', '', 97],
    ['AndNext', 'Mem', '8bit', 0xdbcb, '=', 'Value', '', 98],
    ['', 'Mem', '8bit', 0x8352, '=', 'Value', '', 243],
  ),
})

set.addAchievement({
  id: 475181,
  badge: '538974',
  title: `Hey Bro, I'm Gonna Get Some Quarters`,
  description: 'Beat the game with at least 2500 points as your high score',
  points: 5,
  type: 'missable',
  conditions: $(
    ['AndNext', 'Mem', '8bit', 0xd0a6, '>=', 'Value', '', 242],
    ['AndNext', 'Mem', '8bit', 0xd0a7, '>=', 'Value', '', 245],
    ['', 'Mem', '8bit', 0x8352, '=', 'Value', '', 49],
  ),
})

set.addAchievement({
  id: 475182,
  badge: '538975',
  title: 'Drive Faster',
  description: 'Beat the game in fewer than ten minutes',
  points: 5,
  type: 'missable',
  conditions: {
    core: $(
      ['Trigger', 'Mem', '8bit', 0xd0bc, '=', 'Value', '', 1, 1],
      ['', 'Mem', '8bit', 0x8352, '=', 'Value', '', 49],
      ['ResetIf', 'Mem', '8bit', 0xd006, '!=', 'Delta', '8bit', 0xdf, 36000],
      ['PauseIf', 'Mem', '8bit', 0xd000, '=', 'Value', '', 0],
    ),
    alt1: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 36]),
    alt2: $(['ResetIf', 'Mem', '8bit', 0xd004, '=', 'Value', '', 30]),
  },
})

export default set
