import {AchievementSet, define as $} from '@cruncheevos/core';

const set = new AchievementSet({gameId: 2570, title: 'Spider-Man 3: Invasion of the Spider-Slayers'});

const stageId = 0x00ffcc;
const lives = 0x00d043;

const StageEnum = {
  Stage2_1: 0x05,
};

// const progression = (stage) => {
//   return [
//     // TODO
//     ['', 'Delta', '8bit', stage, '=', 'Value', '', stageId],
//     ['', 'Mem',   '8bit', stage, '=', 'Value', '', stageId],
//   ];
// };


/* ----------------------------- */


set.addAchievement({
  title: 'Marked for Death',
  description: 'Beat Stage 1-3',
  points: 5,
  type: 'progression',
  conditions: {
    core: $(
      ['', 'Delta', '8bit', stageId, '=', 'Value', '', 0],
      ['', 'Mem',   '8bit', stageId, '=', 'Value', '', StageEnum.Stage2_1],
      // TODO check lives? Or how to add condition?
    ),
  },
});


export default set;
