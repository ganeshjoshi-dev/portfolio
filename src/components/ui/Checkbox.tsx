'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  /** Optional label shown next to the checkbox */
  label?: React.ReactNode;
  /** Optional description shown below the label (small, muted) */
  description?: React.ReactNode;
  /** Wrapper className (e.g. for layout) */
  className?: string;
  /** ClassName for the label text */
  labelClassName?: string;
  /** ClassName for the description text */
  descriptionClassName?: string;
}

/**
 * Shared checkbox with custom theme styling (dark slate box, cyan when checked).
 * Replaces default browser checkbox appearance across the site.
 */
const Checkbox = ({
  id: providedId,
  label,
  description,
  className = '',
  labelClassName = '',
  descriptionClassName = '',
  ...props
}: CheckboxProps) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-desc` : undefined;

  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer ${className}`}
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          id={id}
          aria-describedby={descriptionId}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        {/* Custom box - theme colors (slate when unchecked, darker cyan when checked) */}
        <span
          className="pointer-events-none absolute inset-0 rounded border-2 border-slate-500 bg-slate-700 transition-colors peer-checked:border-cyan-500 peer-checked:bg-cyan-700 peer-disabled:opacity-50 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900"
          aria-hidden
        />
        {/* Checkmark - visible when checked */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity peer-checked:opacity-100"
          aria-hidden
        >
          <Check className="h-3 w-3 text-white stroke-[3]" />
        </span>
      </span>
      {(label != null || description != null) && (
        <span className="flex flex-col min-w-0">
          {label != null && (
            <span className={`text-sm font-medium text-slate-300 ${labelClassName}`}>
              {label}
            </span>
          )}
          {description != null && (
            <span
              id={descriptionId}
              className={`text-slate-500 text-xs mt-0.5 ${descriptionClassName}`}
            >
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

Checkbox.displayName = 'Checkbox';

export default Checkbox;
