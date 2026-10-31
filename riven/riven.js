import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 5304, title: 'Riven: The Sequel to Myst' })

set.addAchievement({
  id: 507676,
  badge: '00000',
  title: 'Meet the Ytram',
  description: 'Capture a poisonous Ytram',
  points: 0,
  conditions: $(
    ['AndNext', 'Mem', '32bit', 0x9d370, '=', 'Value', '', 0x801d5558],
    ['AndNext', 'Mem', '8bit', 0xa4eb0, '=', 'Value', '', 1],
    ['AndNext', 'Mem', '16bit', 0x6c784, '>=', 'Value', '', 117],
    ['', 'Mem', '16bit', 0x6c784, '<=', 'Value', '', 119],
  ),
})

export default set
