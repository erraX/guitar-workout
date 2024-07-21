export interface ExerciseSet {
  id: string
  bpm: string
  duration: string
  isFinished: boolean
}

export interface ExerciseInWorkout {
  id: string;
  exerciseId: number;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  name: string;
  duration: number;
  exercises: ExerciseInWorkout[];
}

