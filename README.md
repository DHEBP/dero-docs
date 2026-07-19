# DERO Documentation

**The DERO ecosystem, documented for humans and shipped as an API for agents.**

Four production docs sites for [DERO](https://derod.org) — the privacy-first L1 with homomorphic-encrypted payments, DVM-BASIC smart contracts, and an on-chain web platform. Every page renders in your browser, mirrors itself as Markdown, indexes through `llms.txt`, and routes through a hosted MCP server so any LLM or agent can read it natively.

## Read the docs

| | Covers | Live at |
|---|---|---|
| **DERO** | Privacy suite, DVM-BASIC smart contracts, mining, wallets, daemon RPC | [derod.org](https://derod.org) |
| **TELA** | On-chain web platform — TELA apps, XSWD wallet protocol, CLI, templates | [tela.derod.org](https://tela.derod.org) |
| **Hologram** | Desktop client — wallet, TELA browser, explorer, Studio, simulator, telaHost Bridge API | [hologram.derod.org](https://hologram.derod.org) |
| **DeroPay** | Payments + auth — dero-pay SDK, payment router, escrow, dero-auth SDK | [pay.derod.org](https://deropay.derod.org) |

The sites are the product. This repo is just where they live.

## Agent-ready, by default

Same surfaces on every domain. Point any LLM, MCP client, or A2A runtime at them and skip the HTML.

| Path | What it is |
|---|---|
| `/llms.txt` | Link-list index of every public page |
| `/<page>.md` | Markdown twin of every URL |
| `/SKILL.md` | Skill descriptor for skill-aware agents |
| `/agents.md` | Discovery doc for AI-first crawlers |
| `/.well-known/agent-card.json` | A2A agent card |
| `/.well-known/mcp-server-card.json` | MCP descriptor — points at the hosted server |
| `/robots.txt` | AI-crawler-aware (GPTBot, ClaudeBot, PerplexityBot, …) |

The hosted MCP server lives at **[mcp.derod.org/mcp](https://mcp.derod.org/mcp)** — Streamable HTTP transport over DERO daemon RPC and the bundled docs index. Wire it into Claude Desktop, Cursor, or any MCP client and query the docs and chain directly.

```bash
curl https://mcp.derod.org/health       # liveness check
npx dero-mcp-server                     # run it yourself
```

Source: [`dero-mcp-server`](https://github.com/DHEBP/dero-mcp-server) · [npm](https://www.npmjs.com/package/dero-mcp-server)

## Contributing

Bug fixes, doc improvements, new guides — all welcome. Fork, branch, PR. Setup, scripts, and house rules live in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE) at the monorepo root; each site ships its own LICENSE alongside.

## Disclaimer

Community-maintained documentation, not officially affiliated with the DERO project. Verify critical information against the on-chain reality and official DERO sources.
