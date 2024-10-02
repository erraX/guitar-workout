import { prisma } from "@/prisma-client";

export const getExercises = (status?: "ACTIVE" | "ARCHIVED") => {
  return prisma.exercise.findMany({
    where: {
      status: status ?? "ACTIVE",
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getExerciseById = (id: number) => {
  return prisma.exercise.findUnique({
    where: {
      id,
    },
  });
};
