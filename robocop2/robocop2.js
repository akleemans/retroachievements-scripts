import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 3669, title: 'RoboCop 2' })

set.addAchievement({
  id: 7057,
  badge: '10651',
  title: 'Officer OCP001, Come In!',
  description: 'Beat Stage 1',
  points: 5,
  type: 'progression',
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
  ),
})

set.addAchievement({
  id: 7058,
  badge: '10630',
  title: 'Machine Wars',
  description: 'Beat Stage 2',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 2]),
})

set.addAchievement({
  id: 7059,
  badge: '10631',
  title: 'Psychological Interference',
  description: 'Beat Stage 3',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 3]),
})

set.addAchievement({
  id: 7060,
  badge: '10633',
  title: 'Sewers Rampage',
  description: 'Beat Stage 4',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 4]),
})

set.addAchievement({
  id: 7061,
  badge: '10635',
  title: 'In the Nuke Factory...',
  description: 'Beat Stage 5',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 5]),
})

set.addAchievement({
  id: 7062,
  badge: '10630',
  title: 'ED209-Unit',
  description: 'Beat Stage 6',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 6]),
})

set.addAchievement({
  id: 7063,
  badge: '10637',
  title: 'Super-Flying Fighting Robot',
  description: 'Beat Stage 7',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 7]),
})

set.addAchievement({
  id: 7064,
  badge: '10638',
  title: 'Robotic Ninjas',
  description: 'Beat Stage 8',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 8]),
})

set.addAchievement({
  id: 7065,
  badge: '10639',
  title: 'Laboratory under Siege',
  description: 'Beat Stage 9',
  points: 5,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 9]),
})

set.addAchievement({
  id: 7066,
  badge: '10640',
  title: 'Civic Building',
  description: 'Beat Stage 10',
  points: 10,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 10]),
})

set.addAchievement({
  id: 7067,
  badge: '10643',
  title: 'Simple Guard Mash-up',
  description: 'Beat Stage 11',
  points: 10,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 11]),
})

set.addAchievement({
  id: 7068,
  badge: '10644',
  title: 'Being on the Top',
  description: 'Beat Stage 12',
  points: 10,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 12]),
})

set.addAchievement({
  id: 7069,
  badge: '10630',
  title: 'Armour Plating Enhancement',
  description: 'Beat Stage 13',
  points: 10,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 13]),
})

set.addAchievement({
  id: 7070,
  badge: '10646',
  title: 'Crazy Laboratory',
  description: 'Beat Stage 14',
  points: 10,
  type: 'progression',
  conditions: $(['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 14]),
})

set.addAchievement({
  id: 7071,
  badge: '10649',
  title: `"This will be your Ultimate Battle!"`,
  description: 'Beat the game',
  points: 25,
  type: 'win_condition',
  conditions: $(['', 'Mem', '8bit', 0x890f, '=', 'Value', '', 64]),
})

set.addAchievement({
  id: 10837,
  badge: '10650',
  title: 'Robo-Police',
  description: 'Arrest every Nuke smuggler in Stage 1',
  points: 5,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 149],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
  ),
})

set.addAchievement({
  id: 10838,
  badge: '10630',
  title: 'Invulnerable',
  description: 'Defeat Boss in Stage 2 without taking damage',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 1],
    ['', 'Mem', '8bit', 0xd2f9, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2fa, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2f7, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xd2f8, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 10839,
  badge: '10631',
  title: 'Memory Chess',
  description: 'Finish the Slide Puzzle 1 in 30 Seconds',
  points: 5,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 2],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xd2f6, '>=', 'Value', '', 3],
    ['ResetIf', 'Mem', '8bit', 0xd2f6, '<', 'Value', '', 3],
    ['ResetIf', 'Mem', '8bit', 0xd2f6, '>', 'Value', '', 6],
  ),
})

set.addAchievement({
  id: 10840,
  badge: '10632',
  title: 'Arrest-Maniac',
  description: 'Arrest every Nuke smuggler in Stage 4',
  points: 5,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 3],
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 150],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
  ),
})

set.addAchievement({
  id: 10841,
  badge: '10634',
  title: 'High-Arrest Rate',
  description: 'Arrest every Nuke smuggler in Stage 5',
  points: 5,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 4],
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 150],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
  ),
})

set.addAchievement({
  id: 10842,
  badge: '10630',
  title: 'Same-looking machine',
  description: 'Defeat Boss in Stage 6 without taking damage',
  points: 15,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 5],
    ['', 'Mem', '8bit', 0xd2f9, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2fa, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2f7, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xd2f8, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 10843,
  badge: '10636',
  title: 'Arrested from the sky',
  description: 'Arrest every Nuke smuggler in Stage 7',
  points: 5,
  conditions: $(
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 149],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 6],
  ),
})

set.addAchievement({
  id: 10844,
  badge: '10638',
  title: 'Investigate the Ninjas',
  description: 'Finish the Slide Puzzle 2 in 30 Seconds',
  points: 5,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 7],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xd2f6, '>=', 'Value', '', 3],
    ['ResetIf', 'Mem', '8bit', 0xd2f6, '<', 'Value', '', 3],
    ['ResetIf', 'Mem', '8bit', 0xd2f6, '>', 'Value', '', 6],
  ),
})

set.addAchievement({
  id: 10845,
  badge: '10641',
  title: 'Metal Hero',
  description: 'Arrest every Nuke smuggler in Stage 10',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 150],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 9],
  ),
})

set.addAchievement({
  id: 10846,
  badge: '10642',
  title: 'Oh!So many Nukers!',
  description: 'Arrest every Nuke smuggler in Stage 11',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 149],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 10],
  ),
})

set.addAchievement({
  id: 10847,
  badge: '10645',
  title: 'Role-Model',
  description: 'Arrest every Nuke smuggler in Stage 12',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 150],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 11],
  ),
})

set.addAchievement({
  id: 10848,
  badge: '10630',
  title: 'Armoured Piece of Crap',
  description: 'Defeat Boss in Stage 13 without taking damage',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 12],
    ['', 'Mem', '8bit', 0xd2f9, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2fa, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2f7, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xd2f8, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 10849,
  badge: '10647',
  title: 'Star of the entire police force',
  description: 'Arrest every Nuke smuggler in Stage 14',
  points: 10,
  conditions: $(
    ['', 'Mem', '8bit', 0xc082, '=', 'Value', '', 150],
    ['', 'Mem', '8bit', 0xd2b9, '=', 'Value', '', 255],
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 13],
  ),
})

set.addAchievement({
  id: 10850,
  badge: '10648',
  title: 'Ultimate PoliceMan',
  description: 'Defeat Boss in Stage 15 without taking damage',
  points: 15,
  conditions: $(
    ['', 'Mem', '8bit', 0xc084, '=', 'Value', '', 14],
    ['', 'Mem', '8bit', 0xd2f9, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2fa, '=', 'Value', '', 9],
    ['', 'Mem', '8bit', 0xd2f7, '=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xd2f8, '=', 'Value', '', 0],
  ),
})

set.addAchievement({
  id: 10851,
  badge: '10652',
  title: 'Kill-Frenzy',
  description: 'Be 3rd or higher in the HI-Score table',
  points: 25,
  conditions: $(
    ['', 'Mem', '8bit', 0xc08b, '=', 'Value', '', 1],
    ['', 'Mem', '8bit', 0xc08a, '>=', 'Value', '', 5],
    ['', 'Mem', '8bit', 0xc089, '>=', 'Value', '', 5],
    ['', 'Mem', '8bit', 0xc088, '>=', 'Value', '', 2],
    ['', 'Mem', '8bit', 0xc087, '>=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xc086, '>=', 'Value', '', 0],
    ['', 'Mem', '8bit', 0xc085, '>=', 'Value', '', 0],
  ),
})

export default set
