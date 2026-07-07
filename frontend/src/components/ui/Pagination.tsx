import Link from 'next/link';
import clsx from 'clsx';

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildHref(pageNumber)}
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium',
            pageNumber === page ? 'bg-primary-500 text-white' : 'text-ink-secondary hover:bg-surface-plane',
          )}
        >
          {pageNumber}
        </Link>
      ))}
    </div>
  );
}
