import { useCallback, useState } from "react";
import { Button, Code } from "@nextui-org/react";
import { Time } from "@/components/Time";
import { useClock } from "@/hooks/useClock";
import { useShortCuts } from "@/hooks/useShortCuts";

export interface TrainerProps {
  exerciseName: string;
  onEnd?: (id: string, duration: string) => void;
  onStart?: () => void;
  onClose?: () => void;
  set?: {
    bpm: string;
    duration: string;
    id: string;
    setNo: number;
  } | null;
}

// TODO: SPACE shorcuts
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
      <div className="text-2xl mb-3">
        {exerciseName} | No.{set?.setNo}
      </div>
      {set?.duration && (
        <Code
          className="text-2xl mb-3"
          color={
            Number(clock.time) < Number(set.duration) ? "danger" : "success"
          }
        >
          Target: {set?.duration}s
        </Code>
      )}
      <Time className="mb-3" seconds={clock.time} />
      <div>
        {isRunning ? (
          <Button color="danger" onClick={handleEnd}>
            End
          </Button>
        ) : (
          <Button color="success" onClick={handleStart}>
            Start
          </Button>
        )}
      </div>
      <div className="mt-3">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
