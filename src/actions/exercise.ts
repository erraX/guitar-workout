'use server';

import { prisma } from '@/prisma-client';

export const createExercise = async (exercise: { name: string; description: string}) => {
  const result = await prisma.exercise.create({
    data: exercise,
  });
  console.log('createExercise', result);
}