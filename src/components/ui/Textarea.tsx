'use client';

import { forwardRef, useId } from 'react';
import brandTheme from '@/styles/brand-theme';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  textareaClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, textareaClassName, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const { textarea, input } = brandTheme.components;

    const textareaClasses = [
      textarea.base,
      error && textarea.error,
      textareaClassName,
    ].filter(Boolean).join(' ');

    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className={input.label}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={textareaClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className={input.errorText} role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${id}-helper`} className={input.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
