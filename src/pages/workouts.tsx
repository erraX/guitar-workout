import { useState } from 'react';
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
        <Button className="mb-2" color="primary">Add exercise</Button>
      </div>
      <div className="w-full">
        <ExerciseCard
          className="mb-3"
          title="五品音阶模进"
          sets={[
            { bpm: '30', duration: '60', isFinished: true },
            { bpm: '60', duration: '80', isFinished: false },
          ]}
        />
      </div>
    </div>
  );
}
