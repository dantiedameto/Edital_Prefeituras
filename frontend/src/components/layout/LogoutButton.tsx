'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { LogoutIcon } from '../ui/icons';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={isLoading}>
      <LogoutIcon className="h-4 w-4" />
      Sair
    </Button>
  );
}
