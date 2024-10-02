import { prisma } from "@/prisma-client";

export const getWorkoutHistory = async () => {
  const workouts = await prisma.workout.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
      },
    },
  });

  return workouts.map((workout) => ({
    ...workout,
    exercises: workout.exercises.map((workoutExercise) => ({
      id: workoutExercise.exercise.id,
      name: workoutExercise.exercise.name,
      sets: workoutExercise.sets.map((set) => ({
        bpm: set.bpm,
        duration: set.duration,
      })),
    })),
  }));
};

export const getWorkoutById = async (workoutId: number) => {
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
      },
    },
  });

  return workout;
};
