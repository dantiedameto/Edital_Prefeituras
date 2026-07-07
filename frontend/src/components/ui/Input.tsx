import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-primary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx(
          'rounded-lg border border-line-baseline bg-white px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100',
          error && 'border-status-critical focus:border-status-critical focus:ring-status-critical/10',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-status-critical">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
