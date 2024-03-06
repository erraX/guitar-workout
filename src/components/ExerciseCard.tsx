import { FC } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
} from '@nextui-org/react';
import {
  RiDeleteBinLine,
  RiCheckboxLine,
  RiCheckboxBlankLine,
} from "@remixicon/react";

export interface ExerciseSets {
  bpm: string;
  duration: string;
  isFinished: boolean;
}

export interface ExerciseCardProps {
  title: string;
  className?: string;
  sets?: ExerciseSets[];
}

export const ExerciseCard: FC<ExerciseCardProps> = ({
  className,
  title,
  sets,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <span>{title}</span>
        <Button isIconOnly className="ml-2" color="danger" size="sm"><RiDeleteBinLine size="18" /></Button>
      </CardHeader>
      <CardBody>
        <Table aria-label="exercise-table" className="mb-3">
          <TableHeader>
            <TableColumn>SET</TableColumn>
            <TableColumn>BPM</TableColumn>
            <TableColumn>DURATION(s)</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {
              (sets || []).map((set, index) => (
                <TableRow key={`${set.bpm}_${set.duration}_${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {set.isFinished
                      ? set.bpm
                      : <Input
                        aria-label="bpm"
                        type="text"
                        value={set.bpm}
                        size="sm"
                      />
                    }
                  </TableCell>
                  <TableCell>
                    {set.isFinished
                      ? set.duration
                      : <Input
                        aria-label="duration"
                        type="text"
                        value={set.duration}
                        size="sm"
                      />
                    }
                  </TableCell>
                  <TableCell>
                    {set.isFinished
                      ? <Button isIconOnly color="success" size="sm"><RiCheckboxLine color="white" size="18" /></Button>
                      : <Button isIconOnly color="success" size="sm"><RiCheckboxBlankLine color="white" size="18" /></Button>
                    }
                    <Button isIconOnly className="ml-2" color="danger" size="sm"><RiDeleteBinLine size="18" /></Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <div className="flex">
          <Button className="flex-1" variant="flat" size="sm">Add set</Button>
          <Button className="flex-1 ml-3" variant="flat" size="sm" color="danger">Complete All</Button>
        </div>
      </CardBody>
    </Card>
  );
};
