import Link from 'next/link';
import { Button } from '../ui/Button';
import { DocumentIcon } from '../ui/icons';

export function PublicNavbar() {
  return (
    <header className="border-b border-line-hairline bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-white">
            <DocumentIcon className="h-5 w-5" />
          </span>
          Central de Editais Públicos
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-secondary md:flex">
          <Link href="/#beneficios" className="hover:text-ink-primary">
            Benefícios
          </Link>
          <Link href="/planos" className="hover:text-ink-primary">
            Planos
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm">Criar conta grátis</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
