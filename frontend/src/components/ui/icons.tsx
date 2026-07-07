import { SVGProps } from 'react';

const base = (props: SVGProps<SVGSVGElement>) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeWidth: 1.75,
  stroke: 'currentColor',
  ...props,
});

export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h1M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
  </svg>
);

export const BellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.25" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 1.75" />
  </svg>
);

export const StarIcon = ({ filled, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg {...base(props)} fill={filled ? 'currentColor' : 'none'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L12 16.9l-5.21 2.61 1-5.79-4.21-4.1 5.82-.85L12 3.5z" />
  </svg>
);

export const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M7 10h10M10 15h4" />
  </svg>
);

export const LogoutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H6a1 1 0 00-1 1v12a1 1 0 001 1h3m4-14l5 5-5 5m5-5H9" />
  </svg>
);

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="12" cy="8" r="3.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c1.2-3.5 4-5.25 7-5.25S17.8 16.5 19 20" />
  </svg>
);

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
  </svg>
);

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 12a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7h12z" />
  </svg>
);

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="11" cy="11" r="6.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-4.35-4.35" />
  </svg>
);

export const RobotIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <rect x="4" y="8" width="16" height="11" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3M9 13.5h.01M15 13.5h.01M9 17h6" />
  </svg>
);

export const ArchiveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <rect x="4" y="4" width="16" height="4" rx="1" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8v10a1 1 0 001 1h12a1 1 0 001-1V8M10 13h4" />
  </svg>
);

export const ExternalLinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5L10 14m-1-9H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3" />
  </svg>
);

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const BuildingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 21V5a1 1 0 011-1h6a1 1 0 011 1v16M13 21V9a1 1 0 011-1h4a1 1 0 011 1v12M9 7h.01M9 10h.01M9 13h.01M17 13h.01M17 16h.01" />
  </svg>
);
