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
      currentBpm: workoutExercise.exercise.currentBpm,
      sets: workoutExercise.sets.map((set) => ({
        bpm: set.bpm,
        duration: set.duration,
      })),
    })),
  }));
};

export const getWorkouts = async (filters?: {
  startDate?: Date;
  endDate?: Date;
}) => {
  const workouts = await prisma.workout.findMany({
    where: {
      createdAt: {
        gte: filters?.startDate,
        lte: filters?.endDate,
      },
    },
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
      ...workoutExercise,
      sets: workoutExercise.sets.map((set) => ({ ...set })),
      topBpm: Math.max(...workoutExercise.sets.map((set) => set.bpm)),
      averageBpm:
        workoutExercise.sets.reduce((acc, set) => acc + set.bpm, 0) /
        workoutExercise.sets.length,
    })),
  }));
};

export type Workout = Awaited<ReturnType<typeof getWorkouts>>[number];

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
