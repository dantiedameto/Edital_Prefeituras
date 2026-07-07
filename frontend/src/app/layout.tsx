import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Central de Editais Públicos',
  description: 'Monitore licitações e editais públicos por cidade, categoria e palavra-chave.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-surface-plane font-sans text-ink-primary antialiased">{children}</body>
    </html>
  );
}
