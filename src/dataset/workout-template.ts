import { v4 as uuidv4 } from 'uuid';
import { Workout } from '@/types';

export const workoutsTemplates: Workout[] = [
  {
    id: uuidv4(),
    name: "音阶基本功",
    duration: 0,
    exercises: [
      {
        id: uuidv4(),
        exerciseId: 1,
        sets: [
          { id: "ex_1_s_1", bpm: "80", duration: "120", isFinished: false },
        ],
      },
      {
        id: uuidv4(),
        exerciseId: 2,
        sets: [
          { id: "ex_2_s_1", bpm: "80", duration: "120", isFinished: false },
          { id: "ex_2_s_2", bpm: "100", duration: "120", isFinished: false },
          { id: "ex_2_s_3", bpm: "120", duration: "120", isFinished: false },
        ],
      },
    ],
  },
];
