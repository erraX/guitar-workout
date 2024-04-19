import { v4 as uuidv4 } from 'uuid';
import { useImmerReducer } from 'use-immer';
import { Workout, ExerciseInWorkout, ExerciseSet } from '@/types';
import { createEmptySet } from '@/utils/create-empty-set';
import { workoutsTemplates } from '@/dataset/workout-template';

export type WorkoutsState = Workout;

export type WorkoutsAction =
  | { type: 'RESET', payload?: {} }
  | { type: 'ADD_EXERCISE', payload: { exerciseId: string } }
  | { type: 'DELETE_EXERCISE', payload: { exerciseWorkoutId: string } }
  | { type: 'UPDATE_EXERCISE', payload: { exerciseWorkoutId: string, sets: ExerciseSet[] } };

const findExerciseById = (exercises: ExerciseInWorkout[], exerciseWorkoutId: string) =>
  exercises.findIndex(e => e.id === exerciseWorkoutId);

const createInitialWorkout = (): Workout => ({
  ...workoutsTemplates[0],
  id: uuidv4(),
});

export const useWorkoutsState = (initialState: Workout = {
  id: uuidv4(),
  name: 'Default',
  duration: 0,
  exercises: [],
}) => useImmerReducer(
  (draft, { type, payload }: WorkoutsAction) => {
    switch (type) {
      case 'RESET': {
        draft.name = workoutsTemplates[0].name;
        draft.duration = 0;
        draft.exercises = [...workoutsTemplates[0].exercises];
        draft.id = uuidv4();
        break;
      }

      case 'ADD_EXERCISE': {
        draft.exercises.push({
          id: uuidv4(),
          exerciseId: payload.exerciseId,
          sets: [createEmptySet()],
        });
        break;
      }

      case 'DELETE_EXERCISE': {
        const idx = findExerciseById(draft.exercises, payload.exerciseWorkoutId);
        if (idx > -1) {
          draft.exercises.splice(idx, 1);
        }
        break;
      }

      case 'UPDATE_EXERCISE': {
        const idx = findExerciseById(draft.exercises, payload.exerciseWorkoutId);
        if (idx > -1) {
          draft.exercises[idx].sets = payload.sets;
        }
        break;
      }
    }

    return draft;
  },
  initialState,
);
