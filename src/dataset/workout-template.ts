import { Workout } from '@/types';

export const workoutsTemplates: Workout[] = [
  {
    id: 'wot_1',
    name: '音阶基本功',
    duration: 0,
    exercises: [
      {
        id: 'exxx_1',
        exerciseId: 'ex_1',
        sets: [
          { id: 'ex_1_s_1', bpm: '80', duration: '120', isFinished: false },
        ],
      },
      {
        id: 'exxxx_2',
        exerciseId: 'ex_2',
        sets: [
          { id: 'ex_2_s_1', bpm: '80', duration: '120', isFinished: false },
          { id: 'ex_2_s_2', bpm: '100', duration: '120', isFinished: false },
          { id: 'ex_2_s_3', bpm: '120', duration: '120', isFinished: false },
        ],
      },
    ],
  },
];
