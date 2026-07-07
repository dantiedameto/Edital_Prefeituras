import { serverFetch } from '../../../lib/api-server';
import { FiltersManager } from '../../../components/filters/FiltersManager';
import { InterestFilter, UserProfile } from '../../../types';

export default async function FiltrosPage() {
  const [filters, user] = await Promise.all([
    serverFetch<InterestFilter[]>('/interest-filters'),
    serverFetch<UserProfile>('/users/me'),
  ]);

  return <FiltersManager initialFilters={filters} plan={user.plan} />;
}
