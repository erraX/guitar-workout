import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;

export interface FinishConfirmModalProps {
  modal: UseDisclosureReturn;
  onStop?: () => void;
}

export default function FinishConfirmModal({
  modal,
  onStop,
}: FinishConfirmModalProps) {
  return (
    <Modal isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Finish workout?
            </ModalHeader>
            <ModalBody>
              <p>This will stop the workout</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onClose();
                  onStop?.();
                }}
              >
                Stop
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
