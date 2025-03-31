"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmDisabled,
  cancelDisabled,
  open,
  setOpen,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription aria-describedby="description">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">{children}</div>
        <DialogFooter className="sm:justify-start">
          <Button
            disabled={confirmDisabled || loading}
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
              setOpen(false);
            }}
          >
            {loading ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              confirmText
            )}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={cancelDisabled}
              onClick={() => {
                onCancel?.();
                setOpen(false);
              }}
            >
              {cancelText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
