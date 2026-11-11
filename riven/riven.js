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

// Pattern: the player just arrived on a screen, from any other screen, one alt per region
const arrivedOnScreen = (screen, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  for (const region of regions) {
    conditions[region.alt] = $(
      ['', 'Delta', '32bit', region.screenPointer, '!=', 'Value', '', screenValue(region, screen)],
      ['', 'Mem',   '32bit', region.screenPointer, '=',  'Value', '', screenValue(region, screen)],
    );
  }
  return conditions;
};

// Hotspot click detection (USA): the index in the screen's hotspot list
const hoveredHotspotIndexUsa = 0x19e784;
const clickStateUsa = 0x09db68;

// Converts a USA address of an EXE global to the given region. Globals of the EXE shift like the screen pointer cell, save flags at 0x10000 don't shift.
const regionAddress = (region, usaAddress) => usaAddress + region.screenPointer - screenPointerUsa;

// Pattern: the player just clicked a hotspot on a screen (hotspotIndex = position in the screen's hotspot list), one alt per region
const clickedHotspot = (screen, hotspotIndex, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  for (const region of regions) {
    conditions[region.alt] = $(
      ['', 'Mem',   '32bit', region.screenPointer,                          '=', 'Value', '', screenValue(region, screen)],
      ['', 'Mem',   '16bit', regionAddress(region, hoveredHotspotIndexUsa), '=', 'Value', '', hotspotIndex],
      ['', 'Delta', '8bit',  regionAddress(region, clickStateUsa),          '=', 'Value', '', 0],
      ['', 'Mem',   '8bit',  regionAddress(region, clickStateUsa),          '=', 'Value', '', 1],
    );
  }
  return conditions;
};

const resetOnBoot = () => {
  return [
    ['AndNext', 'Delta', '16bit', orangeMarbleColumn, '=', 'Value', '', 0],
    ['AndNext', 'Mem',   '16bit', orangeMarbleColumn, '=', 'Value', '', 0xffff],
    ['AndNext', 'Delta', '16bit', purpleMarbleColumn, '=', 'Value', '', 0],
    ['ResetIf', 'Mem',   '16bit', purpleMarbleColumn, '=', 'Value', '', 0xffff],
  ];
};

// Pattern: the player has seen every screen in a list, in any order (each screen counts once), one alt per region
const seenAllScreens = (screens) => {
  const conditions = {
    core: $(
      ...resetOnBoot(),
    ),
  };
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

const MovieState = {
  Playing: 0x01,
  Ending: 0x02, // held for a few frames after the movie finishes
};

// Conditions for one of the given movies just finishing on a screen, for one region
const movieFinishedInRegion = (region, screen, movies) => {
  const altConditions = [
    ['', 'Mem',   '32bit', region.screenPointer, '=', 'Value', '', screenValue(region, screen)],
    ['', 'Delta', '8bit',  region.movieState,    '=', 'Value', '', MovieState.Playing],
    ['', 'Mem',   '8bit',  region.movieState,    '=', 'Value', '', MovieState.Ending],
  ];
  movies.forEach((movie, i) => {
    const flag = i === movies.length - 1 ? '' : 'OrNext';
    altConditions.push([flag, 'Mem', '16bit', region.movieIndex, '=', 'Value', '', movie]);
  });
  return altConditions;
};

// Pattern: one of the given movies just finished playing on a screen, one alt per region
const movieFinished = (screen, movies, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  for (const region of regions) {
    conditions[region.alt] = $(...movieFinishedInRegion(region, screen, movies));
  }
  return conditions;
};

// Pattern: like movieFinished, but for several routes ({screen, movies, conditions}), one alt per route and region.
// "conditions" are extra checks for that route only, e.g. a flag to tell apart screens that share a pointer value.
const anyMovieFinished = (routes, ...coreConditions) => {
  const conditions = {core: $(...coreConditions)};
  let altNumber = 1;
  for (const {screen, movies, conditions: routeConditions = []} of routes) {
    for (const region of regions) {
      conditions[`alt${altNumber++}`] = $(...movieFinishedInRegion(region, screen, movies), ...routeConditions);
    }
  }
  return conditions;
};

// Pattern: every movie in a list has finished playing, in any order (each counts once), one alt per region.
// "movie" can be a single ID or an array of IDs that all count for the same entry.
const seenAllMovies = (movies) => {
  const conditions = {core: $(...resetOnBoot())};
  for (const region of regions) {
    const altConditions = [];
    for (const {screen, movie} of movies) {
      // OrNext alternatives must come first: chains are evaluated strictly left to right
      const ids = [movie].flat();
      ids.forEach((id, i) => {
        const flag = i === ids.length - 1 ? 'AndNext' : 'OrNext';
        altConditions.push([flag, 'Mem', '16bit', region.movieIndex, '=', 'Value', '', id]);
      });
      altConditions.push(['AndNext', 'Mem', '32bit', region.screenPointer, '=', 'Value', '', screenValue(region, screen)]);
      altConditions.push(['AndNext', 'Delta', '8bit', region.movieState,   '=', 'Value', '', MovieState.Playing]);
      altConditions.push(['AddHits', 'Mem',   '8bit', region.movieState,   '=', 'Value', '', MovieState.Ending, 1]);
    }
    altConditions.push(['Measured', 'Value', '', 0, '=', 'Value', '', 1, movies.length]);
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
  GehnWatching: 0x801be0cc, // temple, plays movie 33 of Gehn watching the player
  MarblePress: 0x801ccefc, // tIslandExterior7500, fire marble press
  TempleLamps: 0x801be450,
  TelescopeView: 0x801c3e40, // looking through the eyepiece of the telescope
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
  GallowsWinch: 0x801cb610, // inside the gallows, facing the hanging winch handle. Plays 113 JVLGHNDL when pulled
  StonehengeTunnel: 0x801c4b30, // jRebelTunnelUp103, plays 51 JRTWATER when the stone puzzle is solved
  RebelCaveDoor: 0x801c3f18, // rotating door to the Moiety cave, plays 50 JRBTDROP when switched to the animal puzzle
  VillagerInHut: 0x801e254c, // disc2-id253-JVPCNKCS-ch2
  SubmarineHatchVillageDock: 0x801f0d98, // outside the closed hatch, ladder dock near village
  LumberCartToBoiler: 0x801e93d8, // inside the lumber cart, plays JLMBRJ2B (257) to Boiler Island
  MaglevToSurvey: 0x801d6b64, // inside the maglev, plays movie 158 to Survey Island
  WireframeVillage: 0x801e2190, // jVillage2725, wireframe render of the village, only reachable with the easter egg
  ThroneStairs: 0x801c1dfc, // jGThrone450, stairs up to the throne, lamp hotspot 9 (index 3) shows the sky walk
};

const BoilerScreenEnum = {
  LabNotesDesk: 0x801cc044, // Gehn's lab, the desk with his lab notes (the book opens on this screen)
  YtramTrapDown: 0x801d5558, // bYtram_TrapDown810
  BoilerInterior: 0x801bd080, // bBoilerInterior17
  YtramCave: 0x801d7ad0, // bYtramCave_S2250
  FireMarbleDome: 0x801de464, // bFMD_DROBG
  CrawlPipe: 0x801d61e0, // bCrawlPipe100
  BoilerDoor: 0x801bb808, // boiler door, plays movie 10 when it opens
  LabVentCover: 0x801d675c, // end of the crawl pipe, plays movie 125 when the vent cover falls into Gehn's Lab
  MaglevToSurvey: 0x801c837c, // inside the maglev, plays movie 39 to Survey Island. Same value as DomeScreenEnum.GateRoomArt1before!
};

const SurveyScreenEnum = {
  DetailedMap: 0x801c0490, // detailed map table, after choosing an island in the map room
  GoldElevator: 0x801ba62c, // inside the gold elevator, plays 8 GFELVDNC, 9 GELVRDU, 10 GELVDROP on the way down
  ScribeFlees: 0x801cacb4, // maglev platform, plays 98 GAMGTNLV when the Scribe escapes by maglev (only if followed in time)
  WahrkRoom: 0x801cd230, // gWharkRoomRARMDN700, plays GWHARK1-6 (111-116) when the wahrk is called
  WahrkRoomLeftScope: 0x801cdbb4, // gWharkRoomLeftScope, video feed to the town or Catherine's chamber
};

const Age233ScreenEnum = {
  BedsideJournal: 0x801c4514, // Gehn's bedroom, his journal on the bedside table
  CageArrival: 0x801b90bc, // inside Gehn's cage, where every fire marble dome book links to Gehn's study
  // E5: the same screen plays 24 (OGR_B, Gehn gives up after the third refusal) with Gehn State 3
  GehnTakesTrapBook: 0x801bf65c,
  // Black screen after touching the Prison Island book in Gehn's study. Plays 18 and 19 (GEHN.BIN, linking to Prison Island)
  PrisonBookLink: 0x801befe4,
};

const PrisonScreenEnum = {
  // Catherine's cage, after opening it. Plays 5, then 6 (Catherine is freed and links to Tay) while the cage state is 2
  CatherineCage: 0x801ba0dc,
};

// Star Fissure endings: each outcome has its own screen and movie
const DomeEndingScreenEnum = {
  // Fissure temple, after summoning Atrus with the linking book. Plays 65 (the final ending scene with Atrus)
  AtrusArrives: 0x801c4c28,
  FissureCatherineNotFreed: 0x801c4c8c, // E9, plays 66: Gehn trapped, Catherine still on Prison Island
  FissureGehnNotTrapped: 0x801c4cf0, // E6, plays 67: trap book retrieved, Gehn still free
  FissureAlone: 0x801c4d54, // E1, plays 68: Fissure opened without visiting Tay or Gehn
};

const TayScreenEnum = {
  // After linking to Tay: plays 24 (the Moiety captors approach) and 25 (night boat ride to the tree).
  // Tay's movies are in REBEL/MOVIE on disc 4, not in the disc's ID table (ID 25 there is Survey's GPINS2).
  BoatRide: 0x801bacc0,
  PrisonCell: 0x801b90dc, // first view inside the tree prison cell, after a black hand-over screen
  PrisonWindow: 0x801b9b88,
};

const EndingScreenEnum = {
  // E2: trap book used in Tay. Plays 28 (ATRAPBK, opening the book), then 1 on TrapBookTay
  // E8 (trap book used in Tay after trapping Gehn) uses the same screen with 0 (REBEL.BIN).
  TrapBookTay: 0x801b8f40,
  // E3, E4, E7
  TrapBookRiven: 0x801b9504,
};

const gehnState = 0x010140; // 1 at the start of the 233rd age scenes, 4 once Gehn is trapped
const prisonCage = 0x010070; // 0 = Closed, 1 = Opening, 2 = Catherine is free

const surveySelectedChunk = 0x0100a4; // 0 = no chunk selected on the detailed map

const craterSurveyMaglevLocation = 0x010022; // 0 = Survey, 1 = Crater
const surveyJungleMaglevLocation = 0x0100b0; // 0 = Survey, 1 = Jungle

/* ---------------------------------------------------------------------------------------- */

const orangeMarbleColumn = 0x010150;
const purpleMarbleColumn = 0x010158;

// On boot, the marble columns are set from 0x00 to 0xffff
set.addAchievement({
  id: 648931,
  badge: '743475',
  title: 'WARNING',
  description: 'Game always has to be started with Disc 1! Discs can be switched inside the game.',
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
  badge: '743476',
  title: 'Cho?',
  description: 'Find out what happened to the guard',
  points: 1,
  type: 'missable',
  conditions: movedToScreen(
    DomeScreenEnum.CliffBeforeCho,
    DomeScreenEnum.CliffCho,
    ['', 'Mem', '16bit', domeIslandChoState, '=', 'Value', '', 0],
  ),
});

set.addAchievement({
  id: 648933,
  badge: '743477',
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
  badge: '743478',
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
  badge: '743479',
  title: 'Jungle Island',
  description: 'Arrive at Jungle Island',
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
  badge: '743480',
  title: 'Meet the Scarab Beetle',
  description: 'Find a Scarab Beetle friend',
  points: 2,
  conditions: movieFinished(JungleScreenEnum.ScarabBeetle, [6]),
});

set.addAchievement({
  id: 650594,
  badge: '743481',
  title: 'Meet the Sunner',
  description: 'Get up close and personal with a giant Sunner',
  points: 3,
  conditions: movieFinished(JungleScreenEnum.SunnerLagoon, [279]),
});

set.addAchievement({
  id: 650595,
  badge: '743482',
  title: 'Knock, Knock',
  description: 'Check if someone\'s home at a villager\'s hut by knocking multiple times',
  points: 3,
  type: 'missable',
  conditions: movieFinished(JungleScreenEnum.VillagerInHut, [253]),
});

set.addAchievement({
  id: 650596,
  badge: '743483',
  title: 'Eye Spy',
  description: 'Find and rotate all 4 wooden animal eyes',
  points: 5,
  conditions: seenAllMovies([
    {screen: JungleScreenEnum.EyeYtramMaglevRoom, movie: 304},
    {screen: JungleScreenEnum.EyeLagoon, movie: 285},
    // Eye in village pool can be both inspected with and without water (forming a beetle)
    {screen: JungleScreenEnum.EyeVillagePool, movie: [292, 293]},
    {screen: JungleScreenEnum.EyeJungle, movie: 14},
  ]),
});

set.addAchievement({
  id: 650597,
  badge: '743484',
  title: 'Submarine',
  description: 'Get access to the submarine',
  points: 5,
  conditions: movieFinished(JungleScreenEnum.SubmarineHatchVillageDock, [289]),
});

set.addAchievement({
  id: 650598,
  badge: '743485',
  title: 'D\'ni Scholar', // TODO improve
  description: 'Make both players "win" in the Classroom', // TODO improve
  points: 5,
  conditions: seenAllMovies([
    {screen: JungleScreenEnum.Classroom, movie: 300},
    {screen: JungleScreenEnum.Classroom, movie: 298},
  ]),
});

set.addAchievement({
  id: 650599,
  badge: '743486',
  title: 'Boiler Island',
  description: 'Arrive at Boiler Island',
  points: 5,
  type: 'progression',
  conditions: movieFinished(JungleScreenEnum.LumberCartToBoiler, [257]),
});

set.addAchievement({
  id: 650600,
  badge: '743487',
  title: 'Boiler Puzzle',
  description: 'Complete the Boiler puzzle',
  points: 10,
  type: 'progression',
  conditions: movieFinished(BoilerScreenEnum.BoilerDoor, [10]),
});

set.addAchievement({
  id: 650601,
  badge: '743488',
  title: 'Meet the Ytram',
  description: 'Capture a poisonous Ytram',
  points: 5,
  conditions: movieFinished(BoilerScreenEnum.YtramTrapDown, [117, 118, 119, 120, 121]),
});

set.addAchievement({
  id: 650602,
  badge: '743489',
  title: 'Gehn\'s Lab',
  description: 'Find a way into Gehn\'s Lab',
  points: 10,
  type: 'progression',
  conditions: movieFinished(BoilerScreenEnum.LabVentCover, [125]),
});

set.addAchievement({
  id: 650603,
  badge: '743490',
  title: 'Survey Island',
  description: 'Arrive at Survey Island',
  points: 5,
  type: 'progression',
  conditions: anyMovieFinished([
    {
      screen: BoilerScreenEnum.MaglevToSurvey,
      movies: [39],
      conditions: [['', 'Mem', '16bit', craterSurveyMaglevLocation, '=', 'Value', '', 0]],
    },
    {
      screen: JungleScreenEnum.MaglevToSurvey,
      movies: [158],
      conditions: [['', 'Mem', '16bit', surveyJungleMaglevLocation, '=', 'Value', '', 0]],
    },
  ]),
});

set.addAchievement({
  id: 650604,
  badge: '743491',
  title: 'Gehn\'s Map', // TODO rename
  description: 'Interact with the relief map on Survey Island',
  points: 5,
  // Selecting a chunk on the detailed map is the first interaction, regardless of the chosen island
  conditions: onScreen(
    SurveyScreenEnum.DetailedMap,
    ['', 'Delta', '16bit', surveySelectedChunk, '=',  'Value', '', 0],
    ['', 'Mem',   '16bit', surveySelectedChunk, '!=', 'Value', '', 0],
  ),
});

set.addAchievement({
  id: 650605,
  badge: '743492',
  title: 'Deep into the Earth',
  description: 'Find a way into the underground of Survey Island',
  points: 3,
  // Last movie of the ride down: elevator door opens onto the underground corridor
  conditions: movieFinished(SurveyScreenEnum.GoldElevator, [10]),
});


set.addAchievement({
  id: 650606,
  badge: '743493',
  title: 'Unwelcome Visitor',
  description: 'Follow the Scribe to see him flee',
  points: 1,
  type: 'missable',
  // Not 97 GPTTY: that's the first glimpse of the Scribe, which also plays when following him too late
  conditions: movieFinished(SurveyScreenEnum.ScribeFlees, [98]),
});

set.addAchievement({
  id: 650607,
  badge: '743494',
  title: 'Meet the Wahrk',
  description: 'Finally meet one of Gehn\'s fearsome pets',
  points: 2,
  // The first call plays GWHARK1 (111); any wahrk clip counts in case a save starts further along
  conditions: movieFinished(SurveyScreenEnum.WahrkRoom, [111, 112, 113, 114, 115, 116]),
});

set.addAchievement({
  id: 650608,
  badge: '743495',
  title: 'Is That Glass Thick Enough?',
  description: 'Annoy the Wahrk',
  points: 2,
  // GWHARK6 (116): the wahrk charges at the glass. Played on the 4th call (0x1009c Wahrk Visit Count 3 -> 4)
  conditions: movieFinished(SurveyScreenEnum.WahrkRoom, [116]),
});

set.addAchievement({
  id: 650609,
  badge: '743496',
  title: 'Is that Catherine?', // TODO rename or move order
  description: 'Take a look into Catherine\'s chamber',
  points: 2,
  type: 'missable',
  // G6_ASCP (136): first look at Catherine's feed, she walks from the room (0x100be state 3) to left of the doorway
  conditions: movieFinished(SurveyScreenEnum.WahrkRoomLeftScope, [136]),
});

set.addAchievement({
  id: 650610,
  badge: '743497',
  title: 'Gehn Is Watching You',
  description: 'Find Gehn watching you in the Temple',
  points: 2,
  conditions: movieFinished(DomeScreenEnum.GehnWatching, [33]),
});

const domePower = 0x010068; // 0 = Off, 1 = Books are powered (set when the marble puzzle is solved)

set.addAchievement({
  id: 650611,
  badge: '743498',
  title: 'Marble Puzzle',
  description: 'Solve the Marble Puzzle',
  points: 25,
  type: 'progression',
  // Movie 90 plays after pressing with the correct marble placement + Dome Power (0 -> 1) is set at its start
  conditions: movieFinished(
    DomeScreenEnum.MarblePress,
    [90],
    ['', 'Mem', '16bit', domePower, '=', 'Value', '', 1],
  ),
});

// TODO test options
set.addAchievement({
  id: 650612,
  badge: '743499',
  title: 'Gehn\'s Realm',
  description: 'Find a way into Gehn\'s realm',
  points: 10,
  type: 'progression',
  // Arriving in Gehn's cage (every dome book links to the same screen)
  conditions: arrivedOnScreen(Age233ScreenEnum.CageArrival),
  // Other option: any dome book opening with the linking panel image (before the flyby, player hasn't linked yet).
  // Dome-Book State per dome: 0 = Closed, 1 = Opened but blank, 2 = Opened with image
  // conditions: $(
  //   ['OrNext', 'Mem', '16bit', 0x0100e8, '=', 'Value', '', 2], // Dome Island
  //   ['OrNext', 'Mem', '16bit', 0x010124, '=', 'Value', '', 2], // Jungle Island
  //   ['OrNext', 'Mem', '16bit', 0x010066, '=', 'Value', '', 2], // Crater Island
  //   ['OrNext', 'Mem', '16bit', 0x010094, '=', 'Value', '', 2], // Prison Island
  //   ['',       'Mem', '16bit', 0x0100ac, '=', 'Value', '', 2], // Survey Island
  // ),
});

const executionPlatformFloor = 0x0100fe; // 0 = Closed, 1 = Open

set.addAchievement({
  id: 650613,
  badge: '743500',
  title: 'The Wahrk Gallows',
  description: 'Find a way up to the prison ledge',
  points: 5,
  conditions: movieFinished(
    JungleScreenEnum.GallowsWinch,
    [113],
    ['',  'Mem', '16bit', executionPlatformFloor, '=', 'Value', '', 0],
  ),
});

const rebelCaveDoor = 0x010114; // 0 = Path leads to ocean, 1 = Path leads to animal puzzle
const tayAgeBookState = 0x010116; // 0 = Hidden, 1 = Revealing, 2 = Revealed and interactable

set.addAchievement({
  id: 650614,
  badge: '743501',
  title: 'Find the Moiety Cave',
  description: 'Locate the Moiety\'s hidden cavern',
  points: 10,
  // Switching the door to the animal puzzle plays 50 (JRBTDROP); the door state flips 0 -> 1 at its start
  conditions: movieFinished(
    JungleScreenEnum.RebelCaveDoor,
    [50],
    ['', 'Mem', '16bit', rebelCaveDoor, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 650615,
  badge: '743502',
  title: 'Secrets of Stonehenge',
  description: 'Solve the Moiety\'s hardest puzzle',
  points: 25,
  // The correct last stone sets the book state to 1 (Revealing), then 51 (JRTWATER) floods the room.
  conditions: movieFinished(
    JungleScreenEnum.StonehengeTunnel,
    [51],
    ['', 'Mem', '16bit', tayAgeBookState, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 650616,
  badge: '743503',
  title: 'The New Great Tree',
  description: 'Enter the Moiety\'s new stronghold in Tay',
  points: 3,
  conditions: movieFinished(TayScreenEnum.BoatRide, [25]),
  // TODO Other idea: first screen in the tree prison cell, probably too late
  // conditions: arrivedOnScreen(TayScreenEnum.PrisonCell),
});

set.addAchievement({
  id: 650617,
  badge: '743504',
  title: 'Captive Audience',
  description: 'Not quite a prisoner, not quite welcome - watch the rebels of Tay go about their lives in 4 different scenes from your prison cell',
  points: 5,
  type: 'missable',
  conditions: seenAllMovies([
    {screen: TayScreenEnum.PrisonWindow, movie: 10},
    {screen: TayScreenEnum.PrisonWindow, movie: 21},
    {screen: TayScreenEnum.PrisonWindow, movie: 22},
    // Middle house windows play several variants (IDs from REBEL.BIN, see docs/movie-extract/disc4-rebel-*)
    {screen: TayScreenEnum.PrisonWindow, movie: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]},
  ]),
});


set.addAchievement({
  id: 650618,
  badge: '743505',
  title: 'Not Prepared Enough',
  description: 'Trap Gehn',
  points: 10,
  conditions: movieFinished(
    Age233ScreenEnum.GehnTakesTrapBook,
    [26],
    ['', 'Mem', '16bit', gehnState, '=', 'Value', '', 4],
  ),
});

set.addAchievement({
  id: 650619,
  badge: '743506',
  title: 'Visit the Once Great Tree',
  description: 'Arrive on Prison Island',
  points: 5,
  conditions: movieFinished(Age233ScreenEnum.PrisonBookLink, [19]),
});

set.addAchievement({
  id: 650620,
  badge: '743507',
  title: 'Music to Her Ears',
  description: 'Free Catherine',
  points: 10,
  conditions: movieFinished(
    PrisonScreenEnum.CatherineCage,
    [6],
    ['', 'Mem', '16bit', prisonCage, '=', 'Value', '', 2],
  ),
});

const telescopeHeight = 0x0100d2; // 1 = lowest position above the glass, goes up from there
const telescopeHatch = 0x0100d4; // 0 = Closed, 1 = Open

set.addAchievement({
  id: 650804,
  badge: '743524',
  title: 'The Abyss Will Gaze Back',
  description: 'Look into the Star Fissure through the telescope without breaking the glass',
  points: 2,
  // The fissure only shows through the open hatch with the telescope one step above the glass (2 and up is a blur)
  conditions: arrivedOnScreen(
    DomeScreenEnum.TelescopeView,
    ['', 'Mem', '16bit', telescopeHatch,  '=', 'Value', '', 1],
    ['', 'Mem', '16bit', telescopeHeight, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 650621,
  badge: '743508',
  title: 'The Ending Can Never Truly Be Written',
  description: 'Trap Gehn, save Catherine, and get home - safely?',
  points: 25,
  type: 'win_condition',
  conditions: movieFinished(
    DomeEndingScreenEnum.AtrusArrives,
    [65],
    ['', 'Mem', '16bit', gehnState,  '=', 'Value', '', 4],
    ['', 'Mem', '16bit', prisonCage, '=', 'Value', '', 2],
  ),
});

// Pause while no region has a screen loaded (during boot and while loading a save). Screens are 0x801xxxxx,
// other regions' pointer addresses can hold junk like 0x8001004e (Japan) or 0x94c698c6 (France).
// In-game loads keep the pointer (load-state-france-in-game) and aren't caught, accepted as the player's own save.
const pauseIfNoScreen = () => {
  return [
    ['AddSource', 'Mem',   '32bit', screenPointerUsa,           '/',  'Value', '', 0x100000],
    ['AndNext',   'Value', '',      0,                          '!=', 'Value', '', 0x801],
    ['AddSource', 'Mem',   '32bit', screenPointerEuropeGermany, '/',  'Value', '', 0x100000],
    ['AndNext',   'Value', '',      0,                          '!=', 'Value', '', 0x801],
    ['AddSource', 'Mem',   '32bit', screenPointerFrance,        '/',  'Value', '', 0x100000],
    ['AndNext',   'Value', '',      0,                          '!=', 'Value', '', 0x801],
    ['AddSource', 'Mem',   '32bit', screenPointerJapan,         '/',  'Value', '', 0x100000],
    ['PauseIf',   'Value', '',      0,                          '!=', 'Value', '', 0x801],
  ];
};

// Golden Dome states, Bit0 = open. Temple and Prison close again when the player steps inside
const templeDome = 0x01001a;
const boilerDome = 0x010064;
const prisonDome = 0x01006e;
const surveyDome = 0x0100a2;
const jungleDome = 0x0100f4;

// Test: Save state 9b: Jungle -> Survey -> Boiler -> 233, Trap Gehn -> Prison Island -> Temple
set.addAchievement({
  id: 650622,
  badge: '743509',
  title: 'Full Coverage',
  description: 'Restore Gehn\'s transportation network by opening all five Golden Domes across Riven in a single session',
  points: 10,
  conditions: {
    core: $(
      ...pauseIfNoScreen(),
      // Add 1 hit each on opening a dome
      ['AndNext',  'Delta', 'Bit0', templeDome, '=', 'Value', '', 0],
      ['AddHits',  'Mem',   'Bit0', templeDome, '=', 'Value', '', 1, 1],
      ['AndNext',  'Delta', 'Bit0', boilerDome, '=', 'Value', '', 0],
      ['AddHits',  'Mem',   'Bit0', boilerDome, '=', 'Value', '', 1, 1],
      ['AndNext',  'Delta', 'Bit0', prisonDome, '=', 'Value', '', 0],
      ['AddHits',  'Mem',   'Bit0', prisonDome, '=', 'Value', '', 1, 1],
      ['AndNext',  'Delta', 'Bit0', surveyDome, '=', 'Value', '', 0],
      ['AddHits',  'Mem',   'Bit0', surveyDome, '=', 'Value', '', 1, 1],
      ['AndNext',  'Delta', 'Bit0', jungleDome, '=', 'Value', '', 0],
      ['AddHits',  'Mem',   'Bit0', jungleDome, '=', 'Value', '', 1, 1],
      ['Measured', 'Value', '',     0,          '=', 'Value', '', 1, 5],
    ),
    // In an alt, as core is still paused when the boot signal fires (no screen loaded yet) and a paused group skips its ResetIf
    alt1: $(
      ...resetOnBoot(),
    ),
  },
});

// Shortcuts, persistent (only their switch/handle writes them). 0 = Closed, 1 = Open
const junglePrisonLedgeLadder = 0x010122;
const boilerHatchShortcut = 0x010052;
const boilerGehnsLabFrontDoorLock = 0x01002a; // 1 once opened from inside, then opens from outside too
const boilerToDomeBridge = 0x010018; // toggled by handles on both ends
const templeSteamDomeInnerBridge = 0x010084; // 0 = Retracted, 1 = Extended, reset to 0 by the endgame
const templeSteamDomeToBeetleTempleOuterDoor = 0x010080; // toggled at handle outside, reset to 0 only by the endgame
const templeBeetleRoomInnerGate = 0x010082; // Rotation Room Shortcut Gate, 1 = Down, set for free by the endgame

set.addAchievement({
  id: 650623,
  badge: '743510',
  title: 'Gehn\'s Secret Paths',
  description: 'Open all seven permanent shortcuts across Riven before Gehn is caught',
  points: 10,
  type: 'missable',
  // Last of seven just opened (6 -> 7), so loading a save doesn't count.
  // Paused once Gehn is trapped, as the endgame closes both steam dome paths and opens the inner gate.
  conditions: {
    core: $(
      ...pauseIfNoScreen(),
      ['PauseIf',   'Mem',   '16bit', gehnState,                              '=', 'Value', '', 4],
      ['AddSource', 'Delta', 'Bit0',  boilerToDomeBridge],
      ['AddSource', 'Delta', 'Bit0',  boilerHatchShortcut],
      ['AddSource', 'Delta', 'Bit0',  junglePrisonLedgeLadder],
      ['AddSource', 'Delta', 'Bit0',  templeSteamDomeToBeetleTempleOuterDoor],
      ['AddSource', 'Delta', 'Bit0',  templeSteamDomeInnerBridge],
      ['AddSource', 'Delta', 'Bit0',  templeBeetleRoomInnerGate],
      ['',          'Delta', 'Bit0',  boilerGehnsLabFrontDoorLock,            '=', 'Value', '', 6],
      ['AddSource', 'Mem',   'Bit0',  boilerToDomeBridge],
      ['AddSource', 'Mem',   'Bit0',  boilerHatchShortcut],
      ['AddSource', 'Mem',   'Bit0',  junglePrisonLedgeLadder],
      ['AddSource', 'Mem',   'Bit0',  templeSteamDomeToBeetleTempleOuterDoor],
      ['AddSource', 'Mem',   'Bit0',  templeSteamDomeInnerBridge],
      ['AddSource', 'Mem',   'Bit0',  templeBeetleRoomInnerGate],
      ['Measured',  'Mem',   'Bit0',  boilerGehnsLabFrontDoorLock,            '=', 'Value', '', 7],
    ),
  },
});

// Open page of a journal, on the stack (two cells each)
const bedsideJournalPage = 0x1ffd2c; // Gehn's journal in his bedroom in the 233rd Age
const bedsideJournalPage2 = 0x1ffd6c;
const labNotesPage = 0x1ffe1c; // Gehn's lab notes
const labNotesPage2 = 0x1ffe5c;
const menuJournalPage = 0x1ffea4; // Atrus's and Catherine's journal, opened from the menu
const menuJournalPage2 = 0x1ffee4;
const atrusJournalSavedPage = 0x0101aa; // written when the journal is closed

const bedsideJournalLastPage = 0x15;
const labNotesLastPage = 0x24;
const atrusJournalLastPage = 0x1d;
const catherineJournalLastPage = 0x3d;

set.addAchievement({
  id: 651157,
  badge: '743526',
  title: 'Scholar of the Ages',
  description: 'Read through all 4 Journals in one session',
  points: 10,
  // One hit per journal on its last page is open
  conditions: (() => {
    const conditions = {
      core: $(
        ...resetOnBoot(),
      ),
    };
    for (const region of regions) {
      conditions[region.alt] = $(
        ['AndNext',  'Mem',   '32bit', region.screenPointer,  '=', 'Value', '', screenValue(region, Age233ScreenEnum.BedsideJournal)],
        ['AndNext',  'Mem',   '32bit', bedsideJournalPage2,   '=', 'Value', '', bedsideJournalLastPage],
        ['AddHits',  'Mem',   '32bit', bedsideJournalPage,    '=', 'Value', '', bedsideJournalLastPage,                               1],
        ['AndNext',  'Mem',   '32bit', region.screenPointer,  '=', 'Value', '', screenValue(region, BoilerScreenEnum.LabNotesDesk)],
        ['AndNext',  'Mem',   '32bit', labNotesPage2,         '=', 'Value', '', labNotesLastPage],
        ['AddHits',  'Mem',   '32bit', labNotesPage,          '=', 'Value', '', labNotesLastPage,                                     1],
        ['AndNext',  'Mem',   '16bit', atrusJournalSavedPage, '=', 'Value', '', atrusJournalLastPage],
        ['AndNext',  'Delta', '32bit', menuJournalPage,       '=', 'Value', '', atrusJournalLastPage],
        ['AddHits',  'Mem',   '32bit', menuJournalPage2,      '=', 'Value', '', atrusJournalLastPage,                                 1],
        ['AndNext',  'Mem',   '32bit', menuJournalPage,       '=', 'Value', '', catherineJournalLastPage],
        ['AddHits',  'Mem',   '32bit', menuJournalPage2,      '=', 'Value', '', catherineJournalLastPage,                             1],
        ['Measured', 'Value', '',      0,                     '=', 'Value', '', 1,                                                    4],
      );
    }
    return conditions;
  })(),
});

/* -------------------- Easter Eggs ------------------ */

const easterEggUnlock = 0x01003e; // 0 = Locked, 1 = Unlocked (set on the last step)
const easterEggProgress = 0x010008; // Steps done in the unlock chain, 0-5

set.addAchievement({
  id: 650805,
  badge: '743525',
  title: 'Egg Hunt',
  description: 'Unlock the Easter Eggs',
  points: 10,
  type: 'missable',
  // Click all 5 spots, with indicator. Loading a save with the eggs unlocked doesn't count. Paused during boot.
  conditions: {
    core: $(
      ...pauseIfNoScreen(),
      ['',         'Delta', '16bit', easterEggProgress, '=', 'Value', '', 4],
      ['Measured', 'Mem',   '16bit', easterEggProgress, '=', 'Value', '', 5],
    ),
  },
});

set.addAchievement({
  id: 650624,
  badge: '743511',
  title: 'Commercial Break',
  description: 'Watch an Ad on Gehn\'s CCTV',
  points: 3,
  type: 'missable',
  // Left scope in Wahrk Room plays movie 145 (Silly Putty ad) instead of the feed if the egg is unlocked
  conditions: movieFinished(
    SurveyScreenEnum.WahrkRoomLeftScope,
    [145],
    ['',  'Mem', '16bit', easterEggUnlock, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 650625,
  badge: '743512',
  title: 'Deck the Halls',
  description: 'Decorate the Temple in Green and Red',
  points: 3,
  type: 'missable',
  // The lights only appear after clicking the lamp: hotspot 8 shows picture 3 if the egg is unlocked
  conditions: clickedHotspot(
    DomeScreenEnum.TempleLamps,
    3,
    ['', 'Mem', '16bit', easterEggUnlock, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 650626,
  badge: '743513',
  title: 'The Wireframe',
  description: 'See the Jungle Village before it was Rendered',
  points: 3,
  type: 'missable',
  // Turning right on jVillage2710 leads to jVillage2725 instead of jVillage2700 if the egg is unlocked
  conditions: arrivedOnScreen(
    JungleScreenEnum.WireframeVillage,
    ['', 'Mem', '16bit', easterEggUnlock, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  id: 650627,
  badge: '743514',
  title: 'A Walk in the Sky',
  description: 'Enjoy the view on the sky walk',
  points: 3,
  type: 'missable',
  // Clicking the lamp on jGThrone450 (hotspot 9) shows picture 3, the stairs in a blue sky if egg unlocked
  conditions: clickedHotspot(
    JungleScreenEnum.ThroneStairs,
    3,
    ['', 'Mem', '16bit', easterEggUnlock, '=', 'Value', '', 1],
  ),
});

/* -------------------- Bad Endings ------------------ */

set.addAchievement({
  id: 650628,
  badge: '743515',
  title: 'Alone in the Dark',
  description: 'Open the Star Fissure without ever visiting Tay or Gehn', // E1
  points: 5,
  type: 'missable',
  conditions: movieFinished(DomeEndingScreenEnum.FissureAlone, [68]),
});

set.addAchievement({
  id: 650629,
  badge: '743516',
  title: 'What Does This Do Again?',
  description: 'Retrieve the Trap Book and use it in Tay', // E2
  points: 3,
  conditions: movieFinished(EndingScreenEnum.TrapBookTay, [1]),
});

set.addAchievement({
  id: 650630,
  badge: '743517',
  title: 'You Have My Sympathy',
  description: 'Retrieve the Trap Book before visiting Gehn and use it on Riven', // E3
  points: 5,
  type: 'missable',
  conditions: movieFinished(EndingScreenEnum.TrapBookRiven, [0]),
});

set.addAchievement({
  id: 650631,
  badge: '743518',
  title: 'Trap Book in Riven after Gehn',
  description: 'Visit Gehn, then retrieve the Trap Book and use it on Riven', // E4
  points: 5,
  conditions: movieFinished(EndingScreenEnum.TrapBookRiven, [2]),
});

set.addAchievement({
  id: 650632,
  badge: '743519',
  title: 'No Thanks, After You',
  description: 'Refuse Gehn\'s invitation of entering the Trap Book three times', // E5
  points: 10,
  conditions: movieFinished(
    Age233ScreenEnum.GehnTakesTrapBook,
    [24],
    ['', 'Mem', '16bit', gehnState, '=', 'Value', '', 3],
  ),
});

set.addAchievement({
  id: 650633,
  badge: '743520',
  title: 'Gehn\'s Victory',
  description: 'Retrieve the Trap Book without capturing Gehn and open the Star Fissure', // E6
  points: 10,
  type: 'missable',
  conditions: movieFinished(DomeEndingScreenEnum.FissureGehnNotTrapped, [67]),
});

set.addAchievement({
  id: 650634,
  badge: '743521',
  title: 'Pity for the Old Man',
  description: 'Capture Gehn, then use the Trap Book on Riven', // E7
  points: 5,
  conditions: movieFinished(EndingScreenEnum.TrapBookRiven, [1]),
});

set.addAchievement({
  id: 650635,
  badge: '743522',
  title: 'Betraying the Moiety',
  description: 'Capture Gehn, return to Tay, and use the Trap Book there', // E8
  points: 10,
  conditions: movieFinished(EndingScreenEnum.TrapBookTay, [0]),
});

set.addAchievement({
  id: 650636,
  badge: '743523',
  title: 'We Will Never Know Her Fate',
  description: 'Capture Gehn and open the Star Fissure without freeing Catherine', // E9
  points: 10,
  type: 'missable',
  conditions: movieFinished(DomeEndingScreenEnum.FissureCatherineNotFreed, [66]),
});
export default set;
