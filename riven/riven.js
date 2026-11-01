import {AchievementSet, define as $} from '@cruncheevos/core';
const set = new AchievementSet({gameId: 5304, title: 'Riven: The Sequel to Myst'});

// Screen constants below are USA "disc 1" values.
// Currently only booting disc 1 is supported (booting another disk changes pointer location)
const screenPointerUsa = 0x09d370;
const screenPointerEuropeGermany = 0x09d1a4;
const screenPointerFrance = 0x09db68;
const screenPointerJapan = 0x09d324;

const regions = [
  {alt: 'alt1', name: 'USA', screenPointer: screenPointerUsa, screenShift: 0},
  {alt: 'alt2', name: 'Europe, Germany', screenPointer: screenPointerEuropeGermany, screenShift: -0x1cc},
  {alt: 'alt3', name: 'France', screenPointer: screenPointerFrance, screenShift: +0x7fc},
  {alt: 'alt4', name: 'Japan', screenPointer: screenPointerJapan, screenShift: -0x4c},
];

// One condition comparing the screen pointer with a screen, in one region
const screenIs = (region, screen, {type = 'Mem', flag = '', cmp = '=', hits} = {}) => {
  const screenValue = screen + region.screenShift;
  const condition = [flag, type, '32bit', region.screenPointer, cmp, 'Value', '', screenValue];
  if (hits) {
    condition.push(hits);
  }
  return condition;
};

// Pattern: the player just moved from one screen to another, one alt per region
const movedToScreen = (fromScreen, toScreen, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  for (const region of regions) {
    conditions[region.alt] = $(
      screenIs(region, fromScreen, {type: 'Delta'}),
      screenIs(region, toScreen),
    );
  }
  return conditions;
};

// Pattern: the player has seen every screen in a list, in any order (each screen counts once), one alt per region
const seenAllScreens = (screens) => {
  const conditions = {core: $()};
  for (const region of regions) {
    const altConditions = [];
    for (const {before, screen} of screens) {
      altConditions.push(screenIs(region, before, {type: 'Delta', flag: 'AndNext', cmp: '!='}));
      altConditions.push(screenIs(region, screen, {flag: 'AddHits', hits: 1}));
    }
    altConditions.push(['Measured', 'Value', '', 0, '=', 'Value', '', 1, screens.length]);
    conditions[region.alt] = $(...altConditions);
  }
  return conditions;
};

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
  GateRoomEntry: 0x801c6ca0,
};

const domeIslandChoState = 0x0100c8;

set.addAchievement({
  title: 'Find Cho',
  description: 'Find out what happened to the guard',
  points: 1,
  conditions: movedToScreen(
    DomeScreenEnum.CliffBeforeCho,
    DomeScreenEnum.CliffCho,
    ['', 'Mem', '16bit', domeIslandChoState, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  title: 'The Chapel',
  description: 'Inspect all art displays in the Gate Room at Dome Island',
  points: 2,
  conditions: seenAllScreens([
    {before: DomeScreenEnum.GateRoomArt1before, screen: DomeScreenEnum.GateRoomArt1},
    {before: DomeScreenEnum.GateRoomArt2before, screen: DomeScreenEnum.GateRoomArt2},
    {before: DomeScreenEnum.GateRoomArt3before, screen: DomeScreenEnum.GateRoomArt3},
    {before: DomeScreenEnum.GateRoomArt4before, screen: DomeScreenEnum.GateRoomArt4},
    {before: DomeScreenEnum.GateRoomArt5before, screen: DomeScreenEnum.GateRoomArt5},
  ]),
});

const rotationRoomPosition = 0x010076; // 1-5
const rotationRoomMainGate = 0x01007a; // 0 = Up, 1 = Down

set.addAchievement({
  title: 'Outsmart the Gate',
  description: 'Solve the Gate Room puzzle',
  points: 5,
  type: "progression",
  conditions: $(
    ['', 'Mem', '32bit', screenPointerUsa, '=', 'Value', '', DomeScreenEnum.GateRoomEntry],
    ['', 'Delta', '8bit', rotationRoomPosition, '=', 'Value', '', 5],
    ['', 'Mem', '8bit', rotationRoomPosition, '=', 'Value', '', 1],
    ['', 'Mem', '16bit', rotationRoomMainGate, '=', 'Value', '', 1],
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
