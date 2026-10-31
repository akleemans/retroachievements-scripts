import { AchievementSet, define as $ } from '@cruncheevos/core'
const set = new AchievementSet({ gameId: 5304, title: 'Riven: The Sequel to Myst' })

const screenPointer = 0x09d370;

const DomeScreenEnum = {
  CliffBeforeCho: 0x801c1eec,
  CliffCho: 0x801c1fe8,
}

const domeIslandChoState = 0x0100c8;

set.addAchievement({
  title: 'Find Cho',
  description: 'Find out what happened to the guard',
  points: 2,
  conditions: $(
    ['', 'Delta', '32bit', screenPointer, '=', 'Value', '', DomeScreenEnum.CliffBeforeCho],
    ['', 'Mem', '32bit', screenPointer, '=', 'Value', '', DomeScreenEnum.CliffCho],
    ['', 'Mem', '16bit', domeIslandChoState, '=', 'Value', '', 0],
  ),
});



// set.addAchievement({
//   title: 'Meet the Ytram',
//   description: 'Capture a poisonous Ytram',
//   points: 0,
//   conditions: $(
//     ['', 'Mem', '32bit', 0x9d370, '=', 'Value', '', 0x801d5558],
//     ['', 'Mem', '8bit', 0xa4eb0, '=', 'Value', '', 1],
//     ['', 'Mem', '16bit', 0x6c784, '>=', 'Value', '', 117],
//     ['', 'Mem', '16bit', 0x6c784, '<=', 'Value', '', 119],
//   ),
// });

export default set;
