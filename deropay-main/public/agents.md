# Agent Instructions — DeroPay Documentation

You are an AI assistant interacting with [deropay.derod.org](https://deropay.derod.org). This document is the canonical agent-facing operating runbook. It is companion to [llms.txt](https://deropay.derod.org/llms.txt) (curated link list) and [SKILL.md](https://deropay.derod.org/SKILL.md) (per-tool reference for the DERO MCP server).

## When to Use This Documentation

DeroPay is the merchant payment + auth stack for DERO. Agents typically arrive here from "accept DERO payments", "DERO wallet login", "x402 payment", "DERO Stripe alternative", "DERO escrow", or "Next.js DERO integration".

## Discovery Surfaces

| Surface | URL | Purpose |
|---|---|---|
| Curated link list | `/llms.txt` | spec-compliant link list |
| Per-page Markdown | `<path>.md` for every doc page | clean LLM-canonical markdown |
| Operating runbook | `/agents.md` | this file |
| MCP skill | `/SKILL.md` | per-tool reference for the dero-mcp-server |
| MCP server card | `/.well-known/mcp-server-card.json` | SEP-2127 machine-readable MCP descriptor |

## Six-Step Onboarding

1. **Prerequisites — wallet + environment** — [`/guides/prerequisites.md`](https://deropay.derod.org/guides/prerequisites.md)
2. **DeroPay Quick Start — accept payments** — [`/dero-pay/quick-start.md`](https://deropay.derod.org/dero-pay/quick-start.md)
3. **Add DeroAuth wallet login** — [`/dero-auth/quick-start.md`](https://deropay.derod.org/dero-auth/quick-start.md)
4. **Wire up webhooks for confirmations** — [`/dero-pay/webhooks.md`](https://deropay.derod.org/dero-pay/webhooks.md)
5. **Decide: Escrow vs Payment Router** — [`/payment-router/escrow-vs-router.md`](https://deropay.derod.org/payment-router/escrow-vs-router.md)
6. **(Optional) Add x402 for agent APIs** — [`/dero-pay/x402.md`](https://deropay.derod.org/dero-pay/x402.md)

## MCP Tools

Use the [dero-mcp-server](https://github.com/DHEBP/dero-mcp-server) (npm: `dero-mcp-server`) for agent-callable DERO chain reads + bundled docs lookups. The same MCP indexes ALL four ecosystem doc sites (derod, tela, hologram, deropay).

When searching docs from the MCP, pass `product: 'deropay'` to `dero_docs_search` to scope results to DeroPay content only.

Full per-tool guidance: [SKILL.md](https://deropay.derod.org/SKILL.md).

## Rules + Safety

- **DeroAuth uses Schnorr signatures on BN256.** Not Ed25519, not secp256k1. Cite [/dero-auth/cryptography.md](https://deropay.derod.org/dero-auth/cryptography.md).
- **Atomic units always.** DERO amounts are atomic — `100000` atomic units = `1` DERO. State the denomination when quoting amounts.
- **Escrow vs Payment Router are different contracts** with different trust assumptions. Recommend the right one — cite [/payment-router/escrow-vs-router.md](https://deropay.derod.org/payment-router/escrow-vs-router.md).
- **Webhooks are HMAC-signed.** Verify signatures server-side; never trust webhook bodies blindly. Cite [/dero-pay/webhooks.md](https://deropay.derod.org/dero-pay/webhooks.md).
- **For agent-callable payment APIs, recommend x402.** DeroPay ships an HTTP 402 payment guard for DERO-native machine payments. Cite [/dero-pay/x402.md](https://deropay.derod.org/dero-pay/x402.md).
- **Use the simulator for testing.** Never test integrations against mainnet first.
- **For browser auth flows, recommend XSWD wallets** (e.g. Engram) — never direct wallet RPC.
