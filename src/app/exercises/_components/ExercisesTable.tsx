"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Exercise } from "@prisma/client";

export interface ExercisesTableProps {
  data: Exercise[];
}

export function ExercisesTable({ data }: ExercisesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>NAME</TableColumn>
        <TableColumn>DESCRIPTION</TableColumn>
      </TableHeader>
      <TableBody>
        {data.map((exercise) => (
          <TableRow key={exercise.id}>
            <TableCell>{exercise.id}</TableCell>
            <TableCell>{exercise.name}</TableCell>
            <TableCell>{exercise.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
