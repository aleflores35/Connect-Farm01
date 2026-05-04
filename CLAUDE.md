# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Escopo do trabalho neste repo

**Obralivre faz código + push no GitHub + deploy.**

- GitHub é o save canônico (cada mudança vira commit antes do deploy)
- Vercel auto-deploya `main` — sem necessidade de `vercel deploy` manual a cada push
- Conta Vercel: Obralivre (`alessandroflores16-1924`); URL atual `connect-farm01.vercel.app`
- Custom domain / DNS / migração de conta Vercel: alinhar com Alessandro antes

## Stack

- **Frontend:** Vite 6 + React 19 + TypeScript + Tailwind 4 + Motion + lucide-react + react-markdown
- **Backend:** dual — Express (`server.ts`) em dev local, serverless functions Vercel (`api/*.js`) em prod
- **Auth + DB:** Firebase Auth (Google sign-in) + Firestore (`posts` + `users`)
- **Email:** Resend (Canal de Denúncias → `rodrigo@connectfarm.com.br`)
- **AI:** Gemini (`@google/genai`) — **server-only**, nunca no client (ver "Pontos de cuidado")
- **Origem:** bootstrapped no Google AI Studio; manifest em `firebase-blueprint.json`

## Comandos

```bash
npm install              # 375 pacotes; ~30-40s
npm run dev              # Express :3000 com Vite middleware + endpoints API locais
npm run build            # Vite build → dist/
npm run preview          # serve o build
npm run lint             # tsc --noEmit (sem ESLint configurado)
npm run clean            # rm -rf dist
```

`npm run dev` precisa de `.env.local` com `RESEND_API_KEY` e `GEMINI_API_KEY` se for testar os endpoints `/api/denuncia` e `/api/generate-post`. Se faltar, retornam 503 (Gemini) ou simulam silenciosamente (Resend, com log).

## Arquitetura — big picture

### Roteamento "fake" (SPA sem react-router)

Não há URL routing real. `App` (raiz) mantém `activePage` no state e despacha um de 5 componentes:

| `activePage` | Componente | Path conceitual |
|---|---|---|
| `home` | Hero + 10 sections + BlogPreview + AboutSection + Final CTA | `/` |
| `blog` | `BlogPage` | `/blog` |
| `post` | `BlogPostPage` (recebe `selectedPost`) | `/post` |
| `admin` | `AdminPanel` | `/admin` |
| `integridade` | `WhistleblowingChannel` | `/integridade` |

`window.location` nunca muda — todos os "paths" vivem em `/`. Consequência: blog inteiro é invisível pro Google e share de post não funciona. Endereçamento previsto via migração pra Next.js na fase Funil/LP (não agora).

### Backend dual (dev vs prod)

Mesma lógica de endpoint vive em **dois lugares** que precisam ficar em sync:

| Endpoint | Dev (`server.ts`) | Prod (`api/*.js`) |
|---|---|---|
| `/api/denuncia` | linha ~18 | `api/denuncia.js` |
| `/api/generate-post` | linha ~62 | `api/generate-post.js` |

Quando mexer num, **mexer no outro**. Em dev o Express roda Vite via middleware (`createViteServer({ middlewareMode: true })`) e atende as rotas `/api/*` antes de cair no SPA.

### Firestore — listeners live concorrentes

4 componentes abrem `onSnapshot` em `posts` independentemente: `BlogPage`, `BlogPreview`, `BlogPostPage` (related), `AdminPanel` (sem filtro). Sem cache compartilhado. Não é problema com volume baixo, mas vale lembrar antes de adicionar Context React ou refatorar.

### Bundle splitting

`vite.config.ts` configura `rollupOptions.output.manualChunks` separando Firebase, Gemini, Motion e React em chunks próprios. App-code edits não invalidam os ~470 KB de Firebase em cache. **Não consolidar em um único bundle** — anula o ganho.

## Pontos de cuidado (gotchas multi-arquivo)

### 1. Gemini API key NUNCA no client

A geração IA do `AdminPanel` faz `fetch('/api/generate-post', ...)`. **Não importar `@google/genai` em código client-side** — só em `server.ts` e `api/generate-post.js`. Antes a key era injetada via `vite.config.ts` `define` e vazava no bundle público (qualquer um pegava no DevTools). Mantenha assim.

### 2. Admin allowlist duplicado em 2 lugares (precisa sync manual)

- `src/lib/admins.ts` — `ADMIN_EMAILS` + `isAdminEmail()` usado pelo client
- `firestore.rules:isAdmin()` — checagem hardcoded no servidor

Firestore rules **não importam TypeScript**, então adicionar/remover admin exige editar **os dois**. O comentário em `firestore.rules` aponta pro source TS.

### 3. Honeypot em `/api/denuncia`

O form tem um campo escondido `website` (offscreen + `aria-hidden` + `tabIndex=-1`). Bots auto-preenchem; servidor retorna 200 silencioso se vier preenchido (não revela detecção). **Não remover** — é a única proteção anti-spam atualmente. Validação server-side também faz `trim` + cap em message (5000), name (200), phone (50).

### 4. `firebase-applet-config.json` ≠ secret

O arquivo está commitado no repo. Firebase web config (apiKey, projectId, etc) é seguro de expor — quem controla acesso é `firestore.rules` + Firebase Auth. **Não confundir** com `RESEND_API_KEY` / `GEMINI_API_KEY` que **são** secrets server-side.

### 5. App.tsx é monolítico (~2050 linhas)

21 componentes em um arquivo. Strings de `Edit` precisam ser únicas — use ancoragem com classe Tailwind ou JSX adjacente em vez de tentar match em strings genéricas. Decompor em arquivos próprios é refator grande, fora de escopo até a migração Next.js.

### 6. tsconfig path alias

`@/*` resolve a partir do raiz do repo (não `src/`). Logo `import { cn } from '@/src/lib/utils'` é correto, NÃO `'@/lib/utils'`.

## Convenções

- Linguagem da UI: **PT-BR** (formal mas não rebuscado). `lang="pt-BR"` no `index.html`.
- Cores hex hardcoded em alguns lugares legados (`#064A17`, `#F7C424`, `#868C14`); o resto usa tokens Tailwind do design system (`primary`, `tertiary`, `secondary`, `surface`, `on-surface-variant`).
- Tipografia: `font-headline` (Sora) para títulos, `font-body`/`font-label` (Outfit) para texto. Ver `index.html` para preconnect das fontes Google.
- Imagens below-the-fold: sempre `loading="lazy"` + `decoding="async"`. Hero e header de blog post ficam eager.

## AGENTS.md (regras herdadas do bootstrap)

- Canal de Denúncias **prioriza anonimato e segurança** dos dados
- Form é **componente funcional** (não `mailto:`) para garantir sigilo

## Backlog conhecido (precisa decisão antes de executar)

- **Rate limit** em `/api/denuncia` — exige Vercel KV ou Upstash Redis (conta nova)
- **Captcha** Cloudflare Turnstile — exige conta CF
- **Custom domain Resend** (`from:` ainda no sandbox `onboarding@resend.dev`) — exige DNS do `connectfarm.com.br`, alinhar com Rodrigo
- **Migração Next.js** + custom domain Vercel — fase Funil/LP, leva o Firestore→Neon junto (1 post hoje, lock-in baixo)
- **Bug related posts** ([App.tsx](src/App.tsx#L1518)): ✅ corrigido em commit `2ea6831`
- **Lazy import** `AdminPanel` + `BlogPostPage` — exige extrair do App.tsx primeiro
