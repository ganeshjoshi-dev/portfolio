'use client';

import { forwardRef, useId } from 'react';
import brandTheme from '@/styles/brand-theme';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, inputClassName, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const { input } = brandTheme.components;

    const inputClasses = [
      input.base,
      error && input.error,
      inputClassName,
    ].filter(Boolean).join(' ');

    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className={input.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={inputClasses}
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

Input.displayName = 'Input';

export default Input;
