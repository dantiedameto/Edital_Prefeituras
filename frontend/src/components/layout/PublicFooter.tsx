export function PublicFooter() {
  return (
    <footer className="border-t border-line-hairline bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-ink-muted">
        <p>© {new Date().getFullYear()} Central de Editais Públicos. Projeto de demonstração (MVP) — dados fictícios.</p>
      </div>
    </footer>
  );
}
