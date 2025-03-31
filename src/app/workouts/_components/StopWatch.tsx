"use client";

import { FC } from "react";

import { CirclePlay, CircleStop } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Time } from "@/components/ui/time";

export interface StopWatchButtonProps {
  time: number;
  isRunning: boolean;
  onStop: () => void;
  onStart: () => void;
}

export default (function StopWatch({ time, isRunning, onStop, onStart }) {
  // FIXME: alignment and icon size
  const button = isRunning ? (
    <Button size="icon" variant="destructive" onClick={onStop}>
      <CircleStop />
    </Button>
  ) : (
    <Button size="icon" variant="success" onClick={onStart}>
      <CirclePlay />
    </Button>
  );
  return (
    <div>
      <Time className="mr-3" seconds={time} />
      {button}
    </div>
  );
} as FC<StopWatchButtonProps>);
