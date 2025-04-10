import { useCallback, useState } from "react";
import { Time } from "@/components/ui/time";
import { useClock } from "@/hooks/useClock";
import { useShortCuts } from "@/hooks/useShortCuts";
import { Button } from "@/components/ui/button";

export interface TrainerProps {
  exerciseName: string;
  onEnd?: (id: string, duration: string) => void;
  onStart?: () => void;
  onClose?: () => void;
  set?: {
    bpm: string;
    duration: string;
    id: string;
    setNo?: number;
  } | null;
}

// TODO: count down clock
export function Trainer({
  exerciseName,
  onEnd,
  onStart,
  onClose,
  set,
}: TrainerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const clock = useClock();

  const handleStart = useCallback(() => {
    setIsRunning(true);
    clock.start();
    onStart?.();
  }, [clock, onStart]);

  const handleEnd = useCallback(() => {
    setIsRunning(false);
    clock.stop();
    onEnd?.(set!.id, String(clock.time));
    onClose?.();
  }, [clock, onEnd, onClose, set]);

  const handleToggleRunning = useCallback(() => {
    if (isRunning) {
      handleEnd();
    } else {
      handleStart();
    }
  }, [isRunning, handleEnd, handleStart]);

  useShortCuts({
    shortcuts: {
      " ": () => {
        handleToggleRunning();
      },
    },
  });

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-2xl mb-3">{exerciseName}</div>
      {set?.duration && (
        <div
          className={`text-2xl mb-3 font-mono ${
            // TODO: send notification if time is reached the duration
            Number(clock.time) < Number(set.duration)
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          Target: {set?.duration}s
        </div>
      )}
      <Time className="mb-3" seconds={clock.time} />
      <div>
        {isRunning ? (
          <Button
            color="danger"
            onClick={handleEnd}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          >
            End
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleStart}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          >
            Start
          </Button>
        )}
        <Button variant="secondary" className="ml-3" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
