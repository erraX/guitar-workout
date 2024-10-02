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
    return { success: false, error: error };
  }
};

export const updateExercise = async (
  id: number,
  exercise: { name?: string; description?: string; link?: string }
) => {
  try {
    const result = await prisma.exercise.update({
      where: { id },
      data: exercise,
    });
    revalidatePath("/exercises");
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error };
  }
};
