export interface ExerciseSet {
  id: string
  bpm: string
  duration: string
  isFinished: boolean
}

export interface Exercise {
  id: string
  name: string
  description?: string
}

export interface ExerciseInWorkout {
  id: string;
  exerciseId: string;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string
  name: string
  duration: number
  exercises: ExerciseInWorkout[]
}

