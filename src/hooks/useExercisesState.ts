import { v4 as uuidv4 } from 'uuid';
import { useImmerReducer } from 'use-immer';
import { ExerciseSet } from '@/components/ExerciseCard';

export type ExercisesState = ExerciseSet[];

export type ExercisesAction =
  | { type: 'DELETE_SET', payload: { setId: string } }
  | { type: 'ADD_SET' }
  | { type: 'UPDATE_SET', payload: { set: ExerciseSet } }
  | { type: 'FINISH_ALL' };

const createEmptySet = (): ExerciseSet => ({
  id: uuidv4(),
  bpm: '80',
  duration: '120',
  isFinished: false,
});

const findSetById = (sets: ExerciseSet[], setId: string) => sets.findIndex(s => s.id === setId);

export const useExercisesState = (initialState: ExercisesState = []) => {
  return useImmerReducer(
    (state: ExercisesState, action: ExercisesAction) => {
      switch (action.type) {
        case 'DELETE_SET': {
          const idx = findSetById(state, action.payload.setId);
          if (idx > -1) {
            state.splice(idx, 1);
          }
          break;
        }
        case 'ADD_SET': {
          state.push(createEmptySet());
          break;
        }
        case 'UPDATE_SET': {
          const idx = findSetById(state, action.payload.set.id);
          if (idx > -1) {
            state[idx] = action.payload.set;
          }
          break;
        }
        case 'FINISH_ALL': {
          state.forEach(s => {
            s.isFinished = true;
          });
          break;
        }
      }
      return state;
    },
    initialState,
  )
};
