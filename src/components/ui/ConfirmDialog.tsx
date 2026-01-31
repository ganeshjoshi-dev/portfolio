'use client';

import Button from './Button';
import Modal from './Modal';

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the user cancels or clicks the backdrop */
  onClose: () => void;
  /** Called when the user confirms */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Optional description or message body */
  description?: string;
  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** Button variant for the confirm button (default: "secondary") */
  confirmVariant?: 'primary' | 'secondary' | 'ghost';
  /** Optional class for the dialog container (e.g. max-w-sm) */
  className?: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'secondary',
  className = '',
}: ConfirmDialogProps) {
  const dialogId = `confirm-dialog-${title.replace(/\s/g, '-').toLowerCase()}`;
  const descId = description ? `${dialogId}-desc` : undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentClassName={className}
      aria-label={title}
    >
      <>
        <h3 id={dialogId} className="text-lg font-semibold text-white">
          {title}
        </h3>
        {description && (
          <p id={descId} className="mt-2 text-slate-400 text-sm">
            {description}
          </p>
        )}
        <div className="mt-5 flex gap-3 justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </>
    </Modal>
  );
}
