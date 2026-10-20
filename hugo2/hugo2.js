import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 22119, title: 'Hugo 2' })

set.addAchievement({
  id: 571283,
  badge: '648996',
  title: `I Think I'll Hang Around!`,
  description: 'Complete the Forest minigame.',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 224],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 97],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571284,
  badge: '648997',
  title: `I'm Gonna Be the Coolest Troll in the World, All Thanks to You!`,
  description: 'Complete the Snowboard minigame.',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 25],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 224],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 25],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 33],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571285,
  badge: '648998',
  title: `Do You Think I'm A Sand Worm?!`,
  description: 'Complete the Swimmer minigame.',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 145],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 224],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 145],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 120],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571286,
  badge: '648999',
  title: 'Now, What Were the Symbols I Got Again?',
  description: 'Complete the Ice Cave minigame.',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Delta', '8bit', 0xcb17, '=', 'Value', '', 192],
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 0],
    ['', 'Delta', '8bit', 0xcb1a, '=', 'Value', '', 127],
    ['OrNext', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['OrNext', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 25],
    ['OrNext', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 145],
    ['', 'Mem', '8bit', 0xcb17, '=', 'Value', '', 254],
    ['', 'Mem', '8bit', 0xcb1a, '!=', 'Value', '', 127],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571287,
  badge: '649000',
  title: 'Trollerit, Trollerat, Trollerut, This Game Is Kaput!',
  description: `Complete the Witch's Endgame minigame and beat the game.`,
  points: 10,
  type: 'win_condition',
  conditions: $(
    ['', 'Delta', '8bit', 0xc1a7, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xcb1a, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xc1a7, '=', 'Value', '', 1],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571281,
  badge: '648994',
  title: `Hugo's Point Cruise`,
  description: 'Reach 500 points.',
  points: 1,
  conditions: $(
    ['OrNext', 'Delta', '8bit', 0xc1a3, '=', 'Value', '', 5],
    ['', 'Delta', '8bit', 0xc1a3, '=', 'Value', '', 7],
    ['', 'Delta', '8bit', 0xc1a2, '=', 'Value', '', 4],
    ['', 'Mem', '8bit', 0xc1a2, '>=', 'Value', '', 5],
  ),
})

set.addAchievement({
  id: 571282,
  badge: '648995',
  title: `Hugo's Point Adventure`,
  description: 'Reach 1,000 points.',
  points: 5,
  conditions: $(
    ['', 'Delta', '8bit', 0xc1a1, '=', 'Value', '', 0],
    ['', 'Delta', '8bit', 0xc1a2, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xc1a1, '=', 'Value', '', 1],
  ),
})

set.addAchievement({
  id: 571280,
  badge: '648993',
  title: '5-Up',
  description: 'Reach 5 lives.',
  points: 10,
  conditions: $(
    ['', 'Delta', '8bit', 0xdf52, '=', 'Value', '', 4],
    ['Measured', 'Mem', '8bit', 0xdf52, '>=', 'Value', '', 5],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571289,
  badge: '649002',
  title: 'Perfectionist of the Forest',
  description: 'Complete the Forest minigame without dying.',
  points: 10,
  conditions: $(
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 255],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 25],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 145],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 0],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['', 'Value', '', 0, '=', 'Value', '', 1, 1],
    ['ResetIf', 'Mem', '8bit', 0xdf52, '<', 'Delta', '8bit', 0xdf52],
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 224],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 97],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571290,
  badge: '649003',
  title: 'Perfectionist of the Mountain',
  description: 'Complete the Snowboard minigame without dying.',
  points: 25,
  conditions: $(
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 255],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 0],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 0],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 145],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 0],
    ['AndNext', 'Delta', '8bit', 0xcb1a, '=', 'Value', '', 127],
    ['AddHits', 'Mem', '8bit', 0xcb1a, '=', 'Value', '', 25],
    ['', 'Value', '', 0, '=', 'Value', '', 1, 1],
    ['ResetIf', 'Mem', '8bit', 0xdf52, '<', 'Delta', '8bit', 0xdf52],
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 25],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 224],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 25],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 33],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571291,
  badge: '649004',
  title: 'Perfectionist of the Water',
  description: 'Complete the Swimmer minigame without dying.',
  points: 10,
  conditions: $(
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 255],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 120],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 120],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 25],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 120],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 0],
    ['AddHits', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 120],
    ['', 'Value', '', 0, '=', 'Value', '', 1, 1],
    ['ResetIf', 'Mem', '8bit', 0xdf52, '<', 'Delta', '8bit', 0xdf52],
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 145],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 224],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 145],
    ['', 'Mem', '8bit', 0xcb19, '!=', 'Value', '', 120],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571292,
  badge: '649005',
  title: 'Perfectionist of the Ice Cave',
  description: 'Complete the Ice Cave minigame without dying.',
  points: 10,
  conditions: $(
    ['AndNext', 'Delta', '8bit', 0xcb17, '=', 'Value', '', 255],
    ['AndNext', 'Delta', '8bit', 0xcb18, '=', 'Value', '', 15],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 255],
    ['AddHits', 'Mem', '8bit', 0xcb18, '=', 'Value', '', 255],
    ['AndNext', 'Delta', '8bit', 0xcb17, '=', 'Value', '', 75],
    ['AndNext', 'Delta', '8bit', 0xcb18, '=', 'Value', '', 76],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['AddHits', 'Mem', '8bit', 0xcb18, '=', 'Value', '', 255],
    ['AndNext', 'Delta', '8bit', 0xcb17, '=', 'Value', '', 25],
    ['AndNext', 'Delta', '8bit', 0xcb18, '=', 'Value', '', 25],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 25],
    ['AddHits', 'Mem', '8bit', 0xcb18, '=', 'Value', '', 255],
    ['AndNext', 'Delta', '8bit', 0xcb17, '=', 'Value', '', 143],
    ['AndNext', 'Delta', '8bit', 0xcb18, '=', 'Value', '', 144],
    ['AndNext', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 145],
    ['AddHits', 'Mem', '8bit', 0xcb18, '=', 'Value', '', 255],
    ['', 'Value', '', 0, '=', 'Value', '', 1, 1],
    ['ResetIf', 'Mem', '8bit', 0xdf52, '<', 'Delta', '8bit', 0xdf52],
    ['', 'Delta', '8bit', 0xcb17, '=', 'Value', '', 192],
    ['', 'Delta', '8bit', 0xcb19, '=', 'Value', '', 0],
    ['', 'Delta', '8bit', 0xcb1a, '=', 'Value', '', 127],
    ['OrNext', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 97],
    ['OrNext', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 25],
    ['OrNext', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 145],
    ['', 'Mem', '8bit', 0xcb17, '=', 'Value', '', 254],
    ['', 'Mem', '8bit', 0xcb1a, '!=', 'Value', '', 127],
    ['', 'Mem', '8bit', 0xc2fa, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 571288,
  badge: '649001',
  title: `Hugo's Point Extravanagza`,
  description: 'Beat the game with 3,000 points or more',
  points: 25,
  conditions: $(
    ['', 'Delta', '8bit', 0xc1a7, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xcb19, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xcb1a, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xc1a7, '=', 'Value', '', 1],
    ['AddSource', 'Mem', '8bit', 0xdf52, '*', 'Value', '', 100],
    ['AddSource', 'Mem', '8bit', 0xc1a2, '*', 'Value', '', 100],
    ['AddSource', 'Mem', '8bit', 0xc1a1, '*', 'Value', '', 1000],
    ['', 'Value', '', 0, '>=', 'Value', '', 3000],
  ),
})

export default set;
