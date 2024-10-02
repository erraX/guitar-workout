import { workoutsTemplates } from "@/dataset/workout-template";
import { ExerciseInWorkout, ExerciseSet, Workout } from "@/types";
import { createEmptySet } from "@/utils/create-empty-set";
import { useImmerReducer } from "use-immer";
import { v4 as uuidv4 } from "uuid";

export type WorkoutsState = Workout;

export type WorkoutsAction =
  | { type: "RESET"; payload?: {} }
  | { type: "ADD_EXERCISE"; payload: { exerciseId: number } }
  | { type: "DELETE_EXERCISE"; payload: { exerciseWorkoutId: string } }
  | {
      type: "UPDATE_EXERCISE";
      payload: { exerciseWorkoutId: string; sets: ExerciseSet[] };
    };

const findExerciseById = (
  exercises: ExerciseInWorkout[],
  exerciseWorkoutId: string
) => exercises.findIndex((e) => e.id === exerciseWorkoutId);

export const useWorkoutsState = (initialExercises: ExerciseInWorkout[] = []) =>
  useImmerReducer(
    (draft, { type, payload }: WorkoutsAction) => {
      switch (type) {
        case "RESET": {
          draft.name = workoutsTemplates[0].name;
          draft.duration = 0;
          // draft.exercises = [...workoutsTemplates[0].exercises];
          draft.exercises = [];
          draft.id = uuidv4();
          break;
        }

        case "ADD_EXERCISE": {
          draft.exercises.push({
            id: uuidv4(),
            exerciseId: payload.exerciseId,
            sets: [createEmptySet()],
          });
          break;
        }

        case "DELETE_EXERCISE": {
          const idx = findExerciseById(
            draft.exercises,
            payload.exerciseWorkoutId
          );
          if (idx > -1) {
            draft.exercises.splice(idx, 1);
          }
          break;
        }

        case "UPDATE_EXERCISE": {
          const idx = findExerciseById(
            draft.exercises,
            payload.exerciseWorkoutId
          );
          if (idx > -1) {
            draft.exercises[idx].sets = payload.sets;
          }
          break;
        }
      }

      return draft;
    },
    {
      id: uuidv4(),
      name: "Default",
      duration: 0,
      exercises: initialExercises || [],
    }
  );
