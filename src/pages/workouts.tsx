import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
} from '@nextui-org/react';
import {
  RiPlayCircleLine,
  RiStopCircleLine,
} from "@remixicon/react";
import { Time } from '@/components/Time';
import { ExerciseCard } from '@/components/ExerciseCard';
import { useStopWatch } from '@/hooks/useStopWatch';

export default function Workouts() {
  const [sets, setSets] = useState([
    { id: uuidv4(), bpm: '80', duration: '120', isFinished: false },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const stopWatch = useStopWatch();

  const handleStart = () => {
    setIsRunning(true);
    stopWatch.start();
  };

  const handleStop = () => {
    setIsRunning(false);
    stopWatch.stop();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center items-center mb-6 w-full">
        <Time className="mr-3" seconds={stopWatch.time} />
        {isRunning
          ? <Button isIconOnly color="danger" onClick={handleStop}>
            <RiStopCircleLine />
          </Button>
          : <Button isIconOnly color="success" onClick={handleStart}>
            <RiPlayCircleLine color="white" />
          </Button>
        }
      </div>
      <div className="flex flex-col w-full mb-6">
        <Button className="mb-2" color="primary">Add Exercise</Button>
      </div>
      <div className="w-full">
        <ExerciseCard
          className="mb-3"
          title="五品音阶模进"
          sets={sets}
          onExerciseDeleted={() => {
            console.log('onExerciseDeleted');
          }}
          onChange={setSets}
        />
      </div>
    </div>
  );
}
