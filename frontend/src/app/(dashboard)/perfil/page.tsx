import Link from 'next/link';
import { serverFetch } from '../../../lib/api-server';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProfileForm } from '../../../components/profile/ProfileForm';
import { UserProfile } from '../../../types';

export default async function PerfilPage() {
  const user = await serverFetch<UserProfile>('/users/me');

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-primary">Perfil do usuário</h1>
        <p className="text-sm text-ink-secondary">Gerencie seus dados de cadastro e veja seu plano atual.</p>
      </div>

      <Card className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-secondary">Plano atual</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge tone={user.plan.slug === 'premium' ? 'good' : 'neutral'}>{user.plan.name}</Badge>
            {user.plan.slug === 'free' && (
              <span className="text-xs text-ink-muted">
                até {user.plan.maxFilters} filtros · até {user.plan.maxFavorites} favoritos
              </span>
            )}
          </div>
        </div>
        <Link href="/planos">
          <Button variant="secondary" size="sm">
            Ver planos
          </Button>
        </Link>
      </Card>

      <Card>
        <ProfileForm user={user} />
      </Card>
    </div>
  );
}
