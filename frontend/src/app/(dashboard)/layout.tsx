import { serverFetch } from '../../lib/api-server';
import { DashboardSidebar } from '../../components/layout/DashboardSidebar';
import { DashboardTopbar } from '../../components/layout/DashboardTopbar';
import type { UserProfile } from '../../types';

export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const user = await serverFetch<UserProfile>('/users/me');

  return (
    <div className="flex min-h-screen bg-surface-plane">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar user={user} />
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
