"use server";

import { prisma } from "@/prisma-client";
import { revalidatePath } from "next/cache";

interface SetInput {
  bpm: number;
  duration: number;
}

interface ExerciseInput {
  id: number;
  sets: SetInput[];
  notes: string;
}

interface WorkoutInput {
  id?: number;
  duration: number;
  exercises: ExerciseInput[];
}

export async function createWorkout(workoutData: WorkoutInput) {
  try {
    const workout = await prisma.workout.create({
      data: {
        duration: workoutData.duration,
        exercises: {
          create: workoutData.exercises.map((exercise) => ({
            exerciseId: exercise.id,
            notes: exercise.notes,
            sets: {
              create: exercise.sets.map((set) => ({
                bpm: set.bpm,
                duration: set.duration,
              })),
            },
          })),
        },
      },
      include: {
        exercises: {
          include: {
            sets: true,
            exercise: true,
          },
        },
      },
    });

    revalidatePath("/historys");
    return { success: true, data: workout };
  } catch (error) {
    console.error("Error creating workout:", error);
    return { success: false, error: error };
  }
}

export async function deleteWorkout(workoutId: number) {
  try {
    // Delete related sets and workout exercises first
    // Delete related sets first
    await prisma.set.deleteMany({
      where: {
        workoutExercise: {
          workoutId: workoutId,
        },
      },
    });

    // Delete workout exercises
    await prisma.workoutExercise.deleteMany({
      where: { workoutId: workoutId },
    });

    // Now delete the workout
    await prisma.workout.delete({
      where: { id: workoutId },
    });

    revalidatePath("/historys");
    return { success: true };
  } catch (error) {
    console.error("Error deleting workout:", error);
    return { success: false, error: error };
  }
}
