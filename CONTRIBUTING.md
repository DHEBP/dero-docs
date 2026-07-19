# Contributing to DERO Documentation

Bug fixes, doc improvements, new guides — all welcome. This repo is the source for four DERO ecosystem docs sites; the sites are the product.

## What's here

A monorepo of four [Nextra](https://nextra.site) (Next.js) documentation sites, wired together as npm workspaces:

| Workspace | Covers | Live at |
|---|---|---|
| `derod-main` | DERO blockchain — privacy suite, DVM-BASIC, mining, wallets, daemon RPC | [derod.org](https://derod.org) |
| `tela-main` | TELA on-chain web platform — apps, XSWD, CLI, templates | [tela.derod.org](https://tela.derod.org) |
| `hologram-main` | Hologram desktop client — wallet, TELA browser, explorer, Studio | [hologram.derod.org](https://hologram.derod.org) |
| `deropay-main` | DeroPay — payment router, escrow, dero-pay / dero-auth SDKs | [pay.derod.org](https://deropay.derod.org) |

## Prerequisites

- Node.js >= 18.0.0 (CI builds on Node 20)
- npm >= 9.0.0

## Development setup

### Install

This is an npm workspaces monorepo — install once from the root to set up all four sites:

```bash
npm install
```

### Run a dev server

Each site runs on its own. They all default to **http://localhost:3000**, so run one at a time — or pass a port (`npm run dev:tela -- -p 3001`) to run several side by side.

```bash
npm run dev:derod      # DERO docs
npm run dev:tela       # TELA docs
npm run dev:hologram   # Hologram docs
npm run dev:deropay    # DeroPay docs
```

### Build

```bash
npm run build:derod    # build one site
npm run build:tela
npm run build:hologram
npm run build:deropay

npm run build:all      # build all four
```

## Project structure

```
dero-docs/
├── derod-main/          # DERO docs site (Nextra)
│   ├── pages/           # MDX documentation + _meta.json ordering
│   ├── components/      # React components
│   ├── public/          # Static assets + generated llms.txt, agents.md, .well-known/
│   └── ...
├── tela-main/           # TELA docs site
├── hologram-main/       # Hologram docs site
├── deropay-main/        # DeroPay docs site
├── scripts/             # Repo tooling (link health, generators)
└── README.md
```

Each site follows Nextra's `pages/` convention: an `.mdx` file is a page, and a sibling `_meta.json` controls sidebar order and titles.

## How to contribute

### Reporting issues

- Check existing issues before opening a new one
- Give a clear description and steps to reproduce
- Include screenshots for anything visual

### Submitting changes

1. **Fork** the repository
2. **Branch** off `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** — follow existing style, test locally, update related pages
4. **Commit** with a clear message
5. **Push** to your fork
6. **Open a Pull Request** against `main` — describe the change and reference any related issues

CI builds the docs on every PR to `main`; make sure your branch builds cleanly first.

## Writing documentation

Pages are MDX (Markdown + JSX) with Nextra frontmatter:

```mdx
---
title: Your Page Title
description: Brief description for search and previews
---

# Your Page Title

Your content here...

<Callout type="info">
  Use callouts for important information
</Callout>
```

Guidelines:

- Clear, concise, technical — written for developers, no fluff
- Include working code examples; test them before submitting
- Use proper language tags on fenced code blocks for syntax highlighting
- Link to related pages
- Sentence case for headings

### Adding a page

1. Create the `.mdx` file under the site's `pages/` directory
2. Add it to the sibling `_meta.json` so it appears in the sidebar
3. Run the dev server to confirm it renders and the nav is correct

### Images

Place assets under the site's `public/assets/` and reference them with an absolute path:

```mdx
![Alt text](/assets/your-image.png)
```

## Agent-ready surfaces

Each site exposes machine-readable surfaces (`/llms.txt`, `/agents.md`, `/<page>.md` twins, `/.well-known/*`) so LLMs and agents can read the docs natively — see the [README](./README.md) for the full list.

These are **generated**, not hand-edited. If you add or rename pages, the link lists need regenerating so they don't drift:

```bash
node scripts/generate-llms-and-agents.mjs <site-dir>   # e.g. derod-main
```

## Before you submit

```bash
npm run build:derod          # build the site(s) you touched — must pass
npm run check:llms-links     # verify llms.txt links still resolve
```

1. Run the dev server and visually verify your changes
2. Build the affected site(s) — fix any errors
3. Check links and images resolve
4. Confirm code examples actually work

## Need help?

- Join the [DERO Discord](https://discord.gg/H95TJDp)
- Browse the existing docs
- Ask in a GitHub issue

## License

By contributing, you agree your contributions are licensed under the MIT License.
