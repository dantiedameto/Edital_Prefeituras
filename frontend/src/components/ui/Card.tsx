import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-xl2 border border-line-hairline bg-surface p-5 shadow-card', className)}
      {...props}
    />
  );
}
