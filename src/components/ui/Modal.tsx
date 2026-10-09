import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className}`}
    >
      <div className="bg-panel border border-edge rounded-xl w-full max-w-sm flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="p-4 border-b border-edge flex justify-between items-center"
        >
          ✕
        </button>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">{children}</div>

        <div className="p-4 border-t border-edge bg-tile rounded-b-xl">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-panel border border-line rounded-lg px-3 py-2 text-sm min-h-[44px]"
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-[#5b34e8] text-white font-bold rounded-lg px-3 py-2 text-sm min-h-[44px] disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.displayName = 'Modal';