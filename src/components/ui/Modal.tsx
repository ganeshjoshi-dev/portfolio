'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the user clicks the backdrop (if dismissible) */
  onClose?: () => void;
  /** Modal content (e.g. dialog body) */
  children: React.ReactNode;
  /** Optional class for the centered content container (e.g. max-w-sm, w-full) */
  contentClassName?: string;
  /** Whether clicking the backdrop closes the modal (default: true when onClose is provided) */
  dismissOnBackdrop?: boolean;
  /** Optional aria label for the dialog region */
  'aria-label'?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  contentClassName = '',
  dismissOnBackdrop = !!onClose,
  'aria-label': ariaLabel,
}: ModalProps) {
  const handleBackdropClick = dismissOnBackdrop && onClose ? onClose : undefined;

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      const prevBodyPosition = document.body.style.position;
      const prevBodyWidth = document.body.style.width;
      const prevBodyTop = document.body.style.top;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
        document.body.style.position = prevBodyPosition;
        document.body.style.width = prevBodyWidth;
        document.body.style.top = prevBodyTop;
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 min-h-screen bg-slate-900/90 backdrop-blur-sm"
            aria-hidden="true"
            onClick={handleBackdropClick}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 px-4 ${contentClassName || 'max-w-sm'}`.trim()}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            <div
              className="rounded-xl border border-slate-600 bg-slate-800 p-6 shadow-xl relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className={`overflow-y-auto min-h-0 flex-1 ${onClose ? 'pr-8' : ''}`.trim()}>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
