import { prisma } from "@/prisma-client";

export const getExercises = () => {
  return prisma.exercise.findMany();
};
