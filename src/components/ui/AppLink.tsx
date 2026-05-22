import NextLink from 'next/link';
import { SxProps } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

interface AppLinkProps {
  href: string;
  children: React.ReactNode;
  sx?: SxProps;
}

export default function AppLink({ href, children }: AppLinkProps) {
  return (
    <NextLink
      href={href}
      style={{ fontWeight: 600, color: '#2563EB', textDecoration: 'none' }}
    >
      {children}
    </NextLink>
  );
}
