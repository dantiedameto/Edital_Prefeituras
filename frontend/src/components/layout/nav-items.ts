import { DocumentIcon, BellIcon, FilterIcon, StarIcon, UserIcon, BuildingIcon } from '../ui/icons';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: BuildingIcon },
  { href: '/editais', label: 'Editais', icon: DocumentIcon },
  { href: '/filtros', label: 'Meus filtros', icon: FilterIcon },
  { href: '/alertas', label: 'Meus alertas', icon: BellIcon },
  { href: '/favoritos', label: 'Favoritos', icon: StarIcon },
  { href: '/perfil', label: 'Perfil', icon: UserIcon },
];
