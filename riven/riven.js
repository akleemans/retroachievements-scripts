import {AchievementSet, define as $} from '@cruncheevos/core';
const set = new AchievementSet({gameId: 5304, title: 'Riven: The Sequel to Myst'});

// Screen constants used in achievements are USA "disc 1" values.
// Currently only booting disc 1 is supported (booting another disk changes pointer location)
const screenPointerUsa = 0x09d370;
const screenPointerEuropeGermany = 0x09d1a4;
const screenPointerFrance = 0x09db68;
const screenPointerJapan = 0x09d324;

const movieIndexUsa = 0x06c784;
const movieIndexEuropeGermany = 0x06c5b8;
const movieIndexFrance = 0x06cf7c;
const movieIndexJapan = 0x06c738;

const movieStateUsa = 0x0a4eb0;
const movieStateEuropeGermany = 0x0a4ce4;
const movieStateFrance = 0x0a56a8;
const movieStateJapan = 0x0a4e64;

const regions = [
  {alt: 'alt1', name: 'USA', screenPointer: screenPointerUsa, screenShift: 0, movieIndex: movieIndexUsa, movieState: movieStateUsa},
  {alt: 'alt2', name: 'Europe, Germany', screenPointer: screenPointerEuropeGermany, screenShift: -0x1cc, movieIndex: movieIndexEuropeGermany, movieState: movieStateEuropeGermany},
  {alt: 'alt3', name: 'France', screenPointer: screenPointerFrance, screenShift: +0x7fc, movieIndex: movieIndexFrance, movieState: movieStateFrance},
  {alt: 'alt4', name: 'Japan', screenPointer: screenPointerJapan, screenShift: -0x4c, movieIndex: movieIndexJapan, movieState: movieStateJapan},
];

// Converts a USA screen constant to its value in the given region
const screenValue = (region, screen) => screen + region.screenShift;

// Pattern: the player is on a screen, one alt per region
const onScreen = (screen, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  for (const region of regions) {
    conditions[region.alt] = $(
      ['', 'Mem', '32bit', region.screenPointer, '=', 'Value', '', screenValue(region, screen)],
    );
  }
  return conditions;
};

// Pattern: the player just moved from one screen to another, one alt per region
const movedToScreen = (fromScreen, toScreen, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  for (const region of regions) {
    conditions[region.alt] = $(
      ['', 'Delta', '32bit', region.screenPointer, '=', 'Value', '', screenValue(region, fromScreen)],
      ['', 'Mem',   '32bit', region.screenPointer, '=', 'Value', '', screenValue(region, toScreen)],
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
      altConditions.push(['AndNext', 'Delta', '32bit', region.screenPointer, '!=', 'Value', '', screenValue(region, before)]);
      altConditions.push(['AddHits', 'Mem',   '32bit', region.screenPointer, '=',  'Value', '', screenValue(region, screen), 1]);
    }
    altConditions.push(['Measured', 'Value', '', 0, '=', 'Value', '', 1, screens.length]);
    conditions[region.alt] = $(...altConditions);
  }
  return conditions;
};

// Pattern: one of the given movies is playing on a screen, one alt per region
const moviePlaying = (screen, movies, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  for (const region of regions) {
    const altConditions = [
      ['', 'Mem', '32bit', region.screenPointer, '=', 'Value', '', screenValue(region, screen)],
      ['', 'Mem', '8bit',  region.movieState,    '=', 'Value', '', 1],
    ];
    movies.forEach((movie, i) => {
      const flag = i === movies.length - 1 ? '' : 'OrNext';
      altConditions.push([flag, 'Mem', '16bit', region.movieIndex, '=', 'Value', '', movie]);
    });
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
  MaglevToJungleForward: 0x801bcf98,
};

const JungleScreenEnum = {
  EyeYtramMaglevRoom: 0x801f8290, // jYtramMagCarRm100
  EyeLagoon: 0x801ec9a8, // jLagoon2100
  EyeVillagePool: 0x801f2ad0, // jVlgBtlPoolEmpty720
  EyeJungle: 0x801be754, // jIsJungle3800
  SunnerLagoon: 0x801ebd20, // jLagoon1500
  ScarabBeetle: 0x801bcbf0, // jClearCutArea1090
  Classroom: 0x801f4494, // jSchoolRoom280
  GallowsLedge: 0x801ccc50, // jVillageGehnsArea1575
  StonehengeTunnel: 0x801c4b30, // jRebelTunnelUp103
};

/* ---------------------------------------------------------------------------------------- */

const orangeMarbleColumn = 0x010150;
const purpleMarbleColumn = 0x010158;

// On boot, the marble columns are set from 0x00 to 0xffff
set.addAchievement({
  id: 648931,
  title: 'WARNING',
  description: 'Game always has to be started with Disc 1! (Discs can be switched inside the game.)',
  points: 0,
  conditions: $(
    ['', 'Delta', '16bit', orangeMarbleColumn, '=', 'Value', '', 0],
    ['', 'Mem',   '16bit', orangeMarbleColumn, '=', 'Value', '', 0xffff],
    ['', 'Delta', '16bit', purpleMarbleColumn, '=', 'Value', '', 0],
    ['', 'Mem',   '16bit', purpleMarbleColumn, '=', 'Value', '', 0xffff],
  ),
});


const domeIslandChoState = 0x0100c8;

set.addAchievement({
  id: 648932,
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
  id: 648933,
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
  id: 648934,
  title: 'Outsmart the Gate',
  description: 'Solve the rotating Gate Room puzzle',
  points: 10,
  type: 'progression',
  conditions: onScreen(
    DomeScreenEnum.GateRoomEntry,
    ['', 'Delta', '8bit',  rotationRoomPosition, '=', 'Value', '', 5],
    ['', 'Mem',   '8bit',  rotationRoomPosition, '=', 'Value', '', 1],
    ['', 'Mem',   '16bit', rotationRoomMainGate, '=', 'Value', '', 1],
  ),
});

const domeJungleMaglevLocation = 0x0100ca; // 0 = Dome, 1 = Jungle

set.addAchievement({
  id: 648935,
  title: 'Jungle Island',
  description: 'Set off for Jungle Island',
  points: 5,
  type: 'progression',
  conditions: onScreen(
    DomeScreenEnum.MaglevToJungleForward,
    ['', 'Delta', '16bit', domeJungleMaglevLocation, '=', 'Value', '', 0],
    ['', 'Mem',   '16bit', domeJungleMaglevLocation, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 648936,
  title: 'Meet the Scarab Beetle',
  description: 'Find a Scarab Beetle friend',
  points: 2,
  type: 'missable',
  conditions: moviePlaying(JungleScreenEnum.ScarabBeetle, [6]),
});

set.addAchievement({
  title: 'Meet the Sunner',
  description: 'Get up close and personal with a giant Sunner',
  points: 3,
  conditions: moviePlaying(JungleScreenEnum.SunnerLagoon, [279]),
});


export default set;
