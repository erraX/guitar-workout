'use server';

import { prisma } from '@/prisma-client';
import { revalidatePath } from "next/cache";

export const createExercise = async (exercise: {
  name: string;
  description: string;
}) => {
  try {
    const result = await prisma.exercise.create({
      data: exercise,
    });
    revalidatePath("/exercises");
    return { success: true, data: result };
  } catch (error) {
    console.log("create exercise error", error);
    return { success: false, error: error };
  }
};

export const archiveExercise = async (id: number) => {
  try {
    const result = await prisma.exercise.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
    revalidatePath("/exercises");
    return { success: true, data: result };
  } catch (error) {
    console.log("archive exercise error", error);
    return { success: false, error: error };
  }
};

export const updateExercise = async (
  id: number,
  exercise: {
    name?: string;
    description?: string;
    link?: string;
    targetBpm?: number | string | null;
    currentBpm?: number | string | null;
  }
) => {
  try {
    const result = await prisma.exercise.update({
      where: { id },
      data: {
        ...exercise,
        targetBpm: exercise.targetBpm ? Number(exercise.targetBpm) : undefined,
        currentBpm: exercise.currentBpm
          ? Number(exercise.currentBpm)
          : undefined,
      },
    });
    revalidatePath("/exercises");
    return { success: true, data: result };
  } catch (error) {
    console.log("update exercise error", error);
    return { success: false, error: error };
  }
};
