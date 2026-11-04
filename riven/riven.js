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
  VillagerInHut: 0x801e254c, // disc2-id253-JVPCNKCS-ch2
  SubmarineHatchVillageDock: 0x801f0d98, // outside the closed hatch, ladder dock near village
  LumberCartToBoiler: 0x801e93d8, // inside the lumber cart, plays JLMBRJ2B (257) to Boiler Island
  MaglevToSurvey: 0x801d6b64, // inside the maglev, plays movie 158 to Survey Island
};

const BoilerScreenEnum = {
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

const surveySelectedChunk = 0x0100a4; // 0 = no chunk selected on the detailed map

const craterSurveyMaglevLocation = 0x010022; // 0 = Survey, 1 = Crater
const surveyJungleMaglevLocation = 0x0100b0; // 0 = Survey, 1 = Jungle

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
  title: 'Meet the Scarab Beetle',
  description: 'Find a Scarab Beetle friend',
  points: 2,
  conditions: movieFinished(JungleScreenEnum.ScarabBeetle, [6]),
});

set.addAchievement({
  title: 'Meet the Sunner',
  description: 'Get up close and personal with a giant Sunner',
  points: 3,
  conditions: movieFinished(JungleScreenEnum.SunnerLagoon, [279]),
});

set.addAchievement({
  title: 'Knock, Knock',
  description: 'Check if someone\'s home at a villager\'s hut by knocking multiple times',
  points: 3,
  type: 'missable',
  conditions: movieFinished(JungleScreenEnum.VillagerInHut, [253]),
});

set.addAchievement({
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
  title: 'Submarine',
  description: 'Get access to the submarine',
  points: 5,
  conditions: movieFinished(JungleScreenEnum.SubmarineHatchVillageDock, [289]),
});

set.addAchievement({
  title: 'D\'ni Scholar',
  description: 'Make both players "win" in the Classroom',
  points: 5,
  conditions: seenAllMovies([
    {screen: JungleScreenEnum.Classroom, movie: 300},
    {screen: JungleScreenEnum.Classroom, movie: 298},
  ]),
});

set.addAchievement({
  title: 'Boiler Island',
  description: 'Arrive at Boiler Island',
  points: 5,
  type: 'progression',
  conditions: movieFinished(JungleScreenEnum.LumberCartToBoiler, [257]),
});

set.addAchievement({
  title: 'Boiler Puzzle',
  description: 'Complete the Boiler puzzle',
  points: 10,
  type: 'progression',
  conditions: movieFinished(BoilerScreenEnum.BoilerDoor, [10]),
});

set.addAchievement({
  title: 'Meet the Ytram',
  description: 'Capture a poisonous Ytram',
  points: 5,
  conditions: movieFinished(BoilerScreenEnum.YtramTrapDown, [117, 118, 119, 120, 121]),
});

set.addAchievement({
  title: 'Gehn\'s Lab',
  description: 'Find a way into Gehn\'s Lab',
  points: 10,
  type: 'progression',
  conditions: movieFinished(BoilerScreenEnum.LabVentCover, [125]),
});

set.addAchievement({
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
  title: 'Gehn\'s Map',
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
  title: 'Deep Into the Earth',
  description: 'Find a way into the underground of Survey Island',
  points: 3,
  // Last movie of the ride down: elevator door opens onto the underground corridor
  conditions: movieFinished(SurveyScreenEnum.GoldElevator, [10]),
});


set.addAchievement({
  title: 'Unwelcome Visitor',
  description: 'Follow the Scribe to see him flee',
  points: 1,
  type: 'missable',
  // Not 97 GPTTY: that's the first glimpse of the Scribe, which also plays when following him too late
  conditions: movieFinished(SurveyScreenEnum.ScribeFlees, [98]),
});

set.addAchievement({
  title: 'Meet the Wahrk',
  description: 'Finally meet one of Gehn\'s fearsome pets',
  points: 2,
  // The first call plays GWHARK1 (111); any wahrk clip counts in case a save starts further along
  conditions: movieFinished(SurveyScreenEnum.WahrkRoom, [111, 112, 113, 114, 115, 116]),
});

set.addAchievement({
  title: 'Is that glass thick enough?',
  description: 'Annoy the Wahrk',
  points: 2,
  // GWHARK6 (116): the wahrk charges at the glass. Played on the 4th call (0x1009c Wahrk Visit Count 3 -> 4)
  conditions: movieFinished(SurveyScreenEnum.WahrkRoom, [116]),
});

set.addAchievement({
  title: 'Is that Catherine?',
  description: 'Take a look into Catherine\'s chamber',
  points: 2,
  type: 'missable',
  // G6_ASCP (136): first look at Catherine's feed, she walks from the room (0x100be state 3) to left of the doorway (1).
  // The first look always starts "in room", so later variants (other *_ASCP clips) shouldn't be needed.
  conditions: movieFinished(SurveyScreenEnum.WahrkRoomLeftScope, [136]),
});

set.addAchievement({
  title: 'Gehn Is Watching You',
  description: 'Find Gehn watching you in the Temple',
  points: 2,
  conditions: movieFinished(DomeScreenEnum.GehnWatching, [33]),
});

export default set;
