"use client";

import { FC } from "react";

import { CirclePlay, CircleStop } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { Time } from "@/components/ui/time";

export interface StopWatchButtonProps {
  time: number;
  isRunning: boolean;
  onStop: () => void;
  onStart: () => void;
}

export default (function StopWatch({ time, isRunning, onStop, onStart }) {
  const isMobile = useIsMobile();

  const buttonSize = isMobile ? "w-full" : "w-10";

  const button = isRunning ? (
    <Button
      className={cn(buttonSize)}
      size="icon"
      variant="destructive"
      onClick={onStop}
    >
      <CircleStop />
    </Button>
  ) : (
    <Button
      className={cn(buttonSize)}
      size="icon"
      variant="success"
      onClick={onStart}
    >
      <CirclePlay />
    </Button>
  );
  return (
    <div
      className={cn("flex items-center justify-center w-full", {
        "flex-col": isMobile,
      })}
    >
      <Time className="mr-3" seconds={time} />
      <div
        className={cn("flex", "items-center", {
          "w-full": isMobile,
          "mt-3": isMobile,
        })}
      >
        {button}
      </div>
    </div>
  );
} as FC<StopWatchButtonProps>);
