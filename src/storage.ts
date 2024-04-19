import { stringify, parse } from '@/utils/safe-json';
import { Workout } from '@/types';

const WORKOUTS_KEY = 'WORKOUTS';

export const storage = {
  writeWorkouts(workouts: Workout[]) {
    window.localStorage.setItem(WORKOUTS_KEY, stringify(workouts));
  },

  readWorkouts() {
    const data = window.localStorage.getItem(WORKOUTS_KEY);
    if (data) {
      return parse(data);
    }
    return;
  },

  copyWorkouts() {
    navigator.clipboard.writeText(
      window.localStorage.getItem(WORKOUTS_KEY) || ''
    );
  },

  pushWorkout(workout: Workout) {
    let workouts = storage.readWorkouts();
    if (workouts) {
      workouts.push(workout);
    } else {
      workouts = [workout];
    }
    storage.writeWorkouts(workouts);
  },
};
