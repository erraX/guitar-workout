import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface FinishConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAbort?: () => void;
  onStop?: () => void;
}

export default function FinishConfirmModal({
  open,
  onOpenChange,
  onAbort,
  onStop,
}: FinishConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-1">
          <DialogTitle>Finish workout?</DialogTitle>
        </DialogHeader>
        <p>This will stop the workout</p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Dismiss
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              onOpenChange(false);
              onAbort?.();
            }}
          >
            Abort
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onStop?.();
            }}
          >
            Stop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
