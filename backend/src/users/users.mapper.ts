import { Plan, User } from '@prisma/client';

type UserWithPlan = User & { plan: Plan };

export function userToProfile(user: UserWithPlan) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city,
    state: user.state,
    companyType: user.companyType,
    createdAt: user.createdAt,
    plan: {
      id: user.plan.id,
      name: user.plan.name,
      slug: user.plan.slug,
      maxFilters: user.plan.maxFilters,
      maxFavorites: user.plan.maxFavorites,
      maxTenderResults: user.plan.maxTenderResults,
      emailAlertsEnabled: user.plan.emailAlertsEnabled,
    },
  };
}

export type UserProfile = ReturnType<typeof userToProfile>;
