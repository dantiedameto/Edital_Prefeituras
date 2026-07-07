import { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-ink-primary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            'rounded-lg border border-line-baseline bg-white px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100',
            error && 'border-status-critical',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-status-critical">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
