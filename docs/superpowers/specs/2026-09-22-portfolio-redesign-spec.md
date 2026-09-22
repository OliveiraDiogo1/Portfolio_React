# Spec — Redesign do portfólio pessoal e migração para devdiogo.pt

**Data:** 2026-09-22
**Autor:** Diogo Oliveira (decisões aprovadas na conversa de 2026-09-22)

## 1. Objetivo

O portfólio atual é um SPA React 19 + Vite 7 + Tailwind 3 com estética de 2021 (preto + blocos amarelos `#FDE048`, títulos a `8vw`, marquee de skills) e conteúdo desatualizado face ao CV de 2026 (falta a F.Rego, a Sistrade está duplicada e incompleta, não há educação nem línguas).

**Público:** hiring managers e tech leads (Portugal e internacional), e potenciais clientes.
**Trabalho principal da página:** provar rapidamente que o Diogo entrega software de ponta a ponta, em produção (ERP industrial, IoT, seguros, cloud), e tornar o contacto fácil.
**Resultado:** redesign completo, bilingue PT/EN, com temas claro/escuro, motion contido, feed de GitHub e domínio novo `devdiogo.pt`.

**Decisões do autor:** dark sofisticado + motion; manter amarelo como cor de marca; i18n PT/EN; dark/light toggle; feed GitHub; animações de scroll + timeline; single page com `/contact` separado; `devdiogo.pt` já registado na dominios.pt.

## 2. Direção de design

**Conceito:** *folha técnica* — o portfólio como documento de engenharia preciso e legível. Vem do domínio real do trabalho: ERP em chão de fábrica, telemetria IoT, seguros, cloud de defesa. O amarelo não é decoração: é sinalética (atenção/ação), como na indústria.

**Paleta (tokens, `:root` claro / `.dark` escuro):**

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `bg` | `#F6F6F3` | `#0F1115` | fundo da página |
| `surface` | `#FFFFFF` | `#161920` | painéis |
| `line` | `#E2E3E7` | `#262B35` | regras e bordas de 1px |
| `ink` | `#15161A` | `#F1F3F6` | texto principal |
| `muted` | `#5B6470` | `#98A0AD` | texto secundário |
| `accent` | `#FDE048` | `#FDE048` | ação/atenção (marca existente) |
| `accent-ink` | `#15171C` | `#15171C` | texto sobre amarelo |
| `focus` | `#B08D00` | `#FDE048` | anel de foco |

Regras: amarelo só em ações e estados ativos (um destaque por vista); texto amarelo nunca sobre branco; nada de gradientes decorativos.

**Tipografia:** uma família, Archivo Variable (self-hosted via `@fontsource-variable/archivo/standard.css`, eixos wght+wdth).
- `display-1` (nome): `clamp(3rem, 8vw, 6.25rem)`, peso 800, largura 115%, tracking −0.03em, leading 0.94.
- `display-2` (títulos de secção): `clamp(1.75rem, 3.4vw, 2.75rem)`, peso 700, largura 108%.
- Corpo: 17px / 1.65. Labels e datas: 13px, tracking 0.06em, `tabular-nums`. Sem fonte monoespaçada.

**Layout:** coluna única `max-w-container` (76rem), **alinhamento à esquerda**. Regra de 1px no topo de cada secção. Ritmo vertical 80/112px. Hero assimétrico 7/5 (nome + foco atual). Timeline de experiência com marcadores numerados (é uma sequência real). Cantos de 2px em botões/chips/painéis — nada de pílulas nem cartões arredondados.

**Movimento:** um único momento orquestrado no hero (reveal em stagger, ≤0.6s) + reveals de secção discretos (uma vez, 500ms) + progresso da linha da timeline ligado ao scroll. Tudo desativado com `prefers-reduced-motion` (conteúdo sempre visível). Sem animações em hover que escondam informação.

**Evitar:** hero centrado com avatar em círculo, eyebrows em MAIÚSCULAS por cima de cada título, gradientes de fundo, cartões todos iguais com sombra suave, numeração decorativa fora de sequências, marquee, pills, emojis.

## 3. Arquitetura técnica

- `src/theme/ThemeContext.jsx` — tema `dark` (default) / `light`, persistido em `localStorage:portfolio:theme`; script inline no `index.html` evita flash no primeiro paint.
- `src/i18n/LanguageContext.jsx` + `src/i18n/ui.js` — língua `pt`/`en`, persistida em `localStorage:portfolio:lang`, default pela língua do browser; `t(valor)` resolve strings ou objetos `{ en, pt }`.
- `src/data/` — `profile.js`, `experience.js`, `education.js`, `skills.js`, `projects.js`: conteúdo fora da apresentação.
- `src/hooks/useGithubRepos.js` — fetch público à API do GitHub com cache em `sessionStorage` (TTL 60 min) e fallback estático.
- `src/components/layout/` — `Navbar` (âncoras + secção ativa + toggles), `Footer`.
- `src/components/sections/` — `Hero`, `About`, `Experience`, `Skills`, `Projects`, `GithubProjects`, `ContactCta`.
- `src/components/ui/` — `Section`, `Chip`, `Reveal`, `LanguageToggle`, `ThemeToggle`, `motion.js`.
- Rotas: `/` (tudo) e `/contact`. A página `/skills` é removida; o formulário falso da Home é eliminado.

**Testes:** Vitest + Testing Library, colocalizados em `__tests__/`. Testes de integridade garantem que todo o conteúdo tem PT e EN.

## 4. Conteúdo (fonte: `documentation/resume_Diogo.pdf`)

- **F.Rego — Corretores de Seguros** (Gaia, híbrido) · Full-Stack Developer · Mar 2026 – Presente: ownership ponta-a-ponta; React/Python/.NET/SQL; DevOps em AWS e Cloud Run com Pulumi; quality gates Qodana/Semgrep; manutenção do portfólio de aplicações.
- **SISTRADE — Software Consulting S.A.** (Porto, híbrido) · Junior Full-Stack Developer · Jul 2024 – Mar 2026: ERP em Vue.js/.NET; modernização de ecrãs legados; performance em SQL Server; API REST de dados em tempo real de máquinas e sensores IoT; projeto EDOCC (cloud de defesa europeia); formulário e schema de RH.
- **Educação:** MSc Engenharia de Software, ISEP (pós-laboral, out 2024 – presente); BSc Ciências da Computação, Universidade Portucalense (concluída 2024).
- **Línguas:** Português (nativo), Inglês (C2), Espanhol (C2), Basco/Euskara (C2), Francês (B1).
- **Skills:** Linguagens (JS, C#, Python, SQL); Frontend (React, Vue); Backend (.NET, ASP.NET, Python, Java); Dados (SQL Server, PostgreSQL, MongoDB); DevOps/Cloud (AWS, Cloud Run, Pulumi, Docker, Kubernetes, Git, Bitbucket, Jira, Confluence); Qualidade/Segurança (Qodana, Semgrep, SonarQube).
- **Projetos:** EstiMate (Vue.js + Supabase, app privada de orçamentação — prospeto que virou cliente) + feed GitHub (`OliveiraDiogo1`) com repositórios selecionados: `Portfolio_React`, `GOFTS`, `estimates_project`, `git_test`.
- **Contactos:** `diogo.mto123@gmail.com`, LinkedIn `oliveiradiogo1`, GitHub `OliveiraDiogo1`. Telefone não é publicado no site (está no CV em PDF).

## 5. Migração de domínio (passos manuais do autor)

1. Vercel → projeto → Settings → Domains → adicionar `devdiogo.pt` e `www.devdiogo.pt`.
2. dominios.pt → zona DNS de `devdiogo.pt`: `A @ → 76.76.21.21`; `CNAME www → cname.vercel-dns.com` (confirmar valores no painel da Vercel).
3. Manter `devdiogo-portfolio.com` como domínio de redirect 301 para `devdiogo.pt` até expirar.
4. Vercel → Environment Variables: `VITE_PLAUSIBLE_DOMAIN=devdiogo.pt` (produção) e redeploy.
5. Verificar: `nslookup devdiogo.pt`, `curl -I https://devdiogo.pt`, preview de OG em opengraph.xyz.

## 6. Critérios de aceitação

- Home renders all sections (about, experience, skills, projects, contact) in PT and EN, both themes, without layout breakage em 360px, 768px, 1440px.
- Nenhum conteúdo desatualizado do CV (F.Rego presente, Sistrade consolidada, educação e línguas publicadas).
- `npm run lint`, `npx vitest run` e `npm run build` limpos.
- Sem flash de tema errado em hard reload; preferências persistem.
- Feed GitHub degrada para conteúdo estático quando a API falha ou está limitada.
- `index.html`, `robots.txt`, `sitemap.xml` e manifest apontam para `https://devdiogo.pt`.
- Acessibilidade: navegação por teclado, foco visível, `prefers-reduced-motion` respeitado, contraste AA.
