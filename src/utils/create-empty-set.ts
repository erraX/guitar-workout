import { v4 as uuidv4 } from 'uuid';
import { ExerciseSet } from '@/types';

export const createEmptySet = (defaultSet?: ExerciseSet): ExerciseSet => ({
  bpm: '80',
  duration: '120',
  ...defaultSet,
  isFinished: false,
  id: uuidv4(),
});
