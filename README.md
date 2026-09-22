# Portfolio — devdiogo.pt

Portfólio pessoal de Diogo Oliveira, full-stack developer. SPA em React 19 + Vite 7 + Tailwind 3, bilingue (PT/EN), com temas claro e escuro, timeline de experiência, case study de projeto e feed de repositórios GitHub.

## Comandos

```bash
npm install        # dependências
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run og         # regenera a imagem Open Graph (public/og-cover.png)
npm run lint       # ESLint
npx vitest run     # testes
npm run coverage   # cobertura
```

## Estrutura

- `src/data/` — conteúdo (perfil, experiência, educação, skills, projetos) em PT e EN.
- `src/i18n/` — provider de idioma e copy da interface.
- `src/theme/` — provider de tema (dark por omissão).
- `src/components/sections/` — secções da página.
- `docs/domain-migration.md` — runbook da migração de domínio.
- `docs/superpowers/` — spec e plano deste redesign.

## Deploy

Vercel. Domínio principal: `devdiogo.pt` (ver `docs/domain-migration.md`).
