"use client";

import { FC } from "react";

import { Button } from "@nextui-org/react";
import { RiPlayCircleLine, RiStopCircleLine } from "@remixicon/react";

export interface StopWatchButtonProps {
  isRunning: boolean;
  onStop: () => void;
  onStart: () => void;
}

export default (function StopWatchButton({ isRunning, onStop, onStart }) {
  return isRunning ? (
    <Button isIconOnly color="danger" onClick={onStop}>
      <RiStopCircleLine />
    </Button>
  ) : (
    <Button isIconOnly color="success" onClick={onStart}>
      <RiPlayCircleLine color="white" />
    </Button>
  );
} as FC<StopWatchButtonProps>);
