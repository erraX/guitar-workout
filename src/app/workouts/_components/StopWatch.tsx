"use client";

import { FC } from "react";

import { Button } from "@nextui-org/react";
import { RiPlayCircleLine, RiStopCircleLine } from "@remixicon/react";

import { Time } from "@/components/Time";

export interface StopWatchButtonProps {
  time: number;
  isRunning: boolean;
  onStop: () => void;
  onStart: () => void;
}

export default (function StopWatch({ time, isRunning, onStop, onStart }) {
  const button = isRunning ? (
    <Button isIconOnly color="danger" onClick={onStop}>
      <RiStopCircleLine />
    </Button>
  ) : (
    <Button isIconOnly color="success" onClick={onStart}>
      <RiPlayCircleLine color="white" />
    </Button>
  );
  return (
    <div>
      <Time className="mr-3" seconds={time} />
      {button}
    </div>
  );
} as FC<StopWatchButtonProps>);
