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
  MarblePress: 0x801ccefc, // tIslandExterior7500, fire marble press. Plays 90 on a correct solution, 91/93 otherwise
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

const Age233ScreenEnum = {
  CageArrival: 0x801b90bc, // inside Gehn's cage, where every fire marble dome book links to
  // Gehn's study, after handing him the trap book. Plays 26 (O6_10Z, Gehn opens the book and links into it),
  // while Gehn State (0x10140) goes 1 -> 4 at the movie start
  GehnTakesTrapBook: 0x801bf65c,
  // Black screen after touching the Prison Island book in Gehn's study. Plays 18 and 19 (GEHN.BIN, linking to Prison Island)
  PrisonBookLink: 0x801befe4,
};

const PrisonScreenEnum = {
  // Catherine's cage, after opening it. Plays 5, then 6 (Catherine is freed and links to Tay) while the cage state is 2
  CatherineCage: 0x801ba0dc,
};

const DomeEndingScreenEnum = {
  // Fissure temple, after summoning Atrus with the linking book. Plays 65 (the final ending scene with Atrus)
  AtrusArrives: 0x801c4c28,
};

const TayScreenEnum = {
  // After linking to Tay: plays 24 (R3_5R, the Moiety captors approach) and 25 (R3_8, night boat ride to the tree).
  // Tay's movies are in REBEL/MOVIE on disc 4, not in the disc's ID table (ID 25 there is Survey's GPINS2).
  BoatRide: 0x801bacc0,
  PrisonCell: 0x801b90dc, // first view inside the tree prison cell, after a black hand-over screen
  // Looking out of the prison cell window at the village, where 4 scenes of moving people play:
  // 10 upper right walkway, 21 lower right, 22 far left, 11-20 middle house windows (all count as one scene)
  PrisonWindow: 0x801b9b88,
};

const EndingScreenEnum = {
  // E2: trap book used in Tay. Plays 28 (ATRAPBK, opening the book), then 1 on TrapBookTay
  // (Tay's own table in REBEL.BIN on disc 4: R6_18 channel 1). ID 1 on Survey is GELCRHDL, the screen tells them apart.
  TrapBookTay: 0x801b8f40,
  // E4: trap book used on Riven after visiting Gehn. Plays 308 (ATRAPBK) on the jungle disc, then the game loads disc 5
  // and plays 2 (GEHN.BIN: O6_15X, Gehn picks up the trap book in front of the cage) on TrapBookRiven.
  // Not checked yet: the trap book on Riven before visiting Gehn (E3) might use the same screen with another movie.
  TrapBookRiven: 0x801b9504,
  // E7 (trap book used after trapping Gehn) uses the same screen with 1 (GEHN.BIN: O6_16X channel 1),
  // whether the book is opened in the 233rd age (ATRAPBK 69) or on Prison Island (ATRAPBK 46)
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

const domePower = 0x010068; // 0 = Off, 1 = Books are powered (set when the marble puzzle is solved)

set.addAchievement({
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
  title: 'Gehn\'s Realm',
  description: 'Find a way into Gehn\'s realm',
  points: 10,
  type: 'progression',
  // Arriving in Gehn's cage (every dome book links to the same screen)
  conditions: arrivedOnScreen(Age233ScreenEnum.CageArrival),
  // TODO Other option: any dome book opening with the linking panel image (before the flyby, player hasn't linked yet).
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
  title: 'Secrets of Stonehenge',
  description: 'Solve the Moiety\'s hardest puzzle',
  points: 25,
  // The correct last stone sets the book state to 1 (Revealing), then 51 (JRTWATER) floods the room.
  // The book state becomes 2 (Revealed) shortly after the movie ends.
  conditions: movieFinished(
    JungleScreenEnum.StonehengeTunnel,
    [51],
    ['', 'Mem', '16bit', tayAgeBookState, '=', 'Value', '', 1],
  ),
});

set.addAchievement({
  title: 'The New Great Tree',
  description: 'Enter the Moiety\'s new stronghold in Tay',
  points: 3,
  conditions: movieFinished(TayScreenEnum.BoatRide, [25]),
  // TODO Other idea: first screen in the tree prison cell, probably too late
  // conditions: arrivedOnScreen(TayScreenEnum.PrisonCell),
});

set.addAchievement({
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
  title: 'Visit the Once Great Tree',
  description: 'Arrive on Prison Island',
  points: 5,
  conditions: movieFinished(Age233ScreenEnum.PrisonBookLink, [19]),
});

set.addAchievement({
  title: 'Music to Her Ears',
  description: 'Free Catherine',
  points: 10,
  conditions: movieFinished(
    PrisonScreenEnum.CatherineCage,
    [6],
    ['', 'Mem', '16bit', prisonCage, '=', 'Value', '', 2],
  ),
});

set.addAchievement({
  title: 'The Ending Can Never Truly Be Written',
  description: 'Trap Gehn, save Catherine, and get home - safely?',
  points: 25,
  type: 'win_condition',
  conditions: movieFinished(
    DomeEndingScreenEnum.AtrusArrives,
    [65],
    ['', 'Mem', '16bit', gehnState, '=', 'Value', '', 4],
    ['', 'Mem', '16bit', prisonCage, '=', 'Value', '', 2],
  ),
});


/* -------------------- Bad Endings ------------------ */

set.addAchievement({
  title: 'What Does This Do Again?',
  description: 'Retrieve the Trap Book and use it in Tay (E2)',
  points: 3,
  conditions: movieFinished(EndingScreenEnum.TrapBookTay, [1]),
});

set.addAchievement({
  title: 'Trap Book in Riven after Gehn',
  description: 'Visit Gehn, then retrieve the Trap Book and use it on Riven (E4)',
  points: 5,
  conditions: movieFinished(EndingScreenEnum.TrapBookRiven, [2]),
});

// set.addAchievement({
//   title: 'No Thanks, After You\t',
//   description: 'Refuse to enter Gehn\'s Prison Book three times (E5)',
//   points: 10,
//   // conditions: TODO
// });

set.addAchievement({
  title: 'Pity for the old man',
  description: 'Capture Gehn, then use the Trap Book on Riven (E7)',
  points: 5,
  conditions: movieFinished(EndingScreenEnum.TrapBookRiven, [1]),
});

export default set;
