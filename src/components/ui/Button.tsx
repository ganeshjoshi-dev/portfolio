'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import brandTheme from '@/styles/brand-theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined;
  external?: undefined;
}

interface ButtonAsLink extends ButtonBaseProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  href: string;
  external?: boolean;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function getButtonClasses(variant: ButtonVariant, size: ButtonSize, className?: string): string {
  const { button } = brandTheme.components;
  const classes = [
    button.base,
    button[variant],
    button.sizes[size],
    className,
  ].filter(Boolean).join(' ');
  
  return classes;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const classes = getButtonClasses(variant, size, className);

    // External link - render as <a>
    if ('href' in props && props.href && props.external) {
      const { href, external, ...anchorProps } = props;
      void external; // Extracted to exclude from spread
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    // Internal link - render as Next.js Link
    if ('href' in props && props.href) {
      const { href, external, ...linkProps } = props;
      void external; // Extracted to exclude from spread
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...linkProps}
        >
          {children}
        </Link>
      );
    }

    // Default - render as button
    const { href, external, ...buttonProps } = props as ButtonAsButton & { href?: undefined; external?: undefined };
    void href; // Extracted to exclude from spread
    void external; // Extracted to exclude from spread
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
