export interface ExerciseSet {
  id: string
  bpm: string
  duration: string
  isFinished: boolean
}

export interface ExerciseInWorkout {
  id: string;
  exerciseId: string;
  sets: ExerciseSet[];
  notes: string;
}

export interface Workout {
  id: string;
  name: string;
  duration: number;
  exercises: ExerciseInWorkout[];
}
