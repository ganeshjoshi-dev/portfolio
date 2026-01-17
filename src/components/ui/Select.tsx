'use client';

import { forwardRef, useId } from 'react';
import brandTheme from '@/styles/brand-theme';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  selectClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, className, selectClassName, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const { select, input } = brandTheme.components;

    const selectClasses = [
      select.base,
      error && select.error,
      selectClassName,
    ].filter(Boolean).join(' ');

    return (
      <div className={className}>
        {label && (
          <label htmlFor={id} className={input.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={selectClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${id}-error`} className={input.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
