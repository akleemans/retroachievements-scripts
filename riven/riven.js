import {AchievementSet, define as $} from '@cruncheevos/core';
const set = new AchievementSet({gameId: 5304, title: 'Riven: The Sequel to Myst'});

const screenPointer = 0x09d370;

const DomeScreenEnum = {
  CliffBeforeCho: 0x801c1eec,
  CliffCho: 0x801c1fe8,
  GateRoomArt1before: 0x801c837c,
  GateRoomArt1: 0x801c8428,
  GateRoomArt2before: 0x801d1414,
  GateRoomArt2: 0x801d14c0,
  GateRoomArt3before: 0x801d0dd8,
  GateRoomArt3: 0x801d0e84,
  GateRoomArt4before: 0x801cbd10,
  GateRoomArt4: 0x801cbdbc,
  GateRoomArt5before: 0x801cb53c,
  GateRoomArt5: 0x801cb5e8,
};

const domeIslandChoState = 0x0100c8;

set.addAchievement({
  title: 'Find Cho',
  description: 'Find out what happened to the guard',
  points: 1,
  conditions: $(
    ['', 'Delta', '32bit', screenPointer,      '=', 'Value', '', DomeScreenEnum.CliffBeforeCho],
    ['', 'Mem',   '32bit', screenPointer,      '=', 'Value', '', DomeScreenEnum.CliffCho],
    ['', 'Mem',   '16bit', domeIslandChoState, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  title: 'The Chapel',
  description: 'Inspect all art displays in the Gate Room at Dome Island',
  points: 2,
  conditions: $(
    ['AndNext',  'Delta', '32bit', screenPointer, '!=', 'Value', '', DomeScreenEnum.GateRoomArt1before],
    ['AddHits',  'Mem',   '32bit', screenPointer, '=',  'Value', '', DomeScreenEnum.GateRoomArt1,       1],
    ['AndNext',  'Delta', '32bit', screenPointer, '!=', 'Value', '', DomeScreenEnum.GateRoomArt2before],
    ['AddHits',  'Mem',   '32bit', screenPointer, '=',  'Value', '', DomeScreenEnum.GateRoomArt2,       1],
    ['AndNext',  'Delta', '32bit', screenPointer, '!=', 'Value', '', DomeScreenEnum.GateRoomArt3before],
    ['AddHits',  'Mem',   '32bit', screenPointer, '=',  'Value', '', DomeScreenEnum.GateRoomArt3,       1],
    ['AndNext',  'Delta', '32bit', screenPointer, '!=', 'Value', '', DomeScreenEnum.GateRoomArt4before],
    ['AddHits',  'Mem',   '32bit', screenPointer, '=',  'Value', '', DomeScreenEnum.GateRoomArt4,       1],
    ['AndNext',  'Delta', '32bit', screenPointer, '!=', 'Value', '', DomeScreenEnum.GateRoomArt5before],
    ['AddHits',  'Mem',   '32bit', screenPointer, '=',  'Value', '', DomeScreenEnum.GateRoomArt5,       1],
    ['Measured', 'Value', '',      0,             '=',  'Value', '', 1,                                 5],
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
