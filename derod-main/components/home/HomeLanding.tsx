import styles from './HomeLanding.module.css';
import SupplyRibbon from './SupplyRibbon';

/*
 * HomeLanding — the derod.org home page.
 *
 * Intent-based landing (build / verify / agents). The Nextra chrome (top nav
 * and theme toggle) is supplied by the theme.
 *
 * Accents are locked: cyan #52c8db primary, magenta #b959b6 secondary, amber
 * only for the halving countdown. Theme-aware via SupplyRibbon + the CSS module
 * (light defaults, :global(html.dark) overrides).
 */

export default function HomeLanding() {
  return (
    <div className={styles.home}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <h1 className={styles.h1}>
          DERO — a <span className={styles.accent}>private</span> Layer-1
          blockchain.
        </h1>
        <p className={styles.lead}>
          <b>Documented for humans, shipped as an API for agents.</b> Encrypted
          balances, private DVM-BASIC smart contracts, and an on-chain web, with
          a supply anyone can recompute for themselves.
        </p>
        <div className={styles.ctaRow}>
          <a className={styles.btnPrimary} href="/dvm/dero-virtual-machine">
            Start Building →
          </a>
          <a className={styles.btnGhost} href="/integrity/verify-the-supply">
            Verify the supply →
          </a>
        </div>
        <div className={styles.statstrip}>
          <span>
            Mainnet since <b>2017</b>
          </span>
          <span>
            <b>18s</b> blocks
          </span>
          <span>PoW</span>
          <span>
            <b>20,890,694</b> hard cap
          </span>
          <span>encrypted balances</span>
        </div>
      </header>

      {/* ── START HERE ROUTER ────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.secTitle}>Start here</div>
        <div className={styles.grid3}>
          <div className={styles.routerCard}>
            <div className={styles.tag}>For developers</div>
            <h3 className={styles.rcH3}>Build on DERO</h3>
            <p className={styles.rcP}>
              Write DVM-BASIC smart contracts and drive the chain over JSON-RPC.
            </p>
            <div className={styles.rlinks}>
              <a href="/dvm/dero-virtual-machine">DVM smart contracts</a>
              <a href="/rpc-api/daemon-rpc-api">Daemon &amp; wallet RPC API</a>
            </div>
          </div>

          <div className={styles.routerCard}>
            <div className={styles.tag}>For auditors</div>
            <h3 className={styles.rcH3}>Verify the chain</h3>
            <p className={styles.rcP}>
              Recompute the supply offline and inspect the transaction proof
              system.
            </p>
            <div className={styles.rlinks}>
              <a href="/integrity">Protocol integrity</a>
              <a href="/integrity/verify-the-supply">Verify the supply</a>
            </div>
          </div>

          <div className={styles.routerCard}>
            <div className={styles.tag}>For AI agents</div>
            <h3 className={styles.rcH3}>Read the chain and docs</h3>
            <p className={styles.rcP}>
              A hosted MCP server and a Markdown mirror of every page.
            </p>
            <div className={styles.rlinks}>
              <a href="/tools/mcp-server">MCP server</a>
              <a href="/llms.txt">llms.txt</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF BAND (treatment C — compact ribbon) ────────────────────── */}
      <section className={styles.proof}>
        <SupplyRibbon />
      </section>

      {/* ── CAPABILITY STRIP ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.secTitle}>What DERO gives you</div>
        <div className={styles.caps}>
          <a className={styles.capCard} href="/privacy/homomorphic-encryption">
            <div className={styles.capName}>Homomorphic encryption</div>
            <div className={styles.capFact}>
              Balances are stored as homomorphic commitments; sender, receiver,
              and amount are hidden inside a ring of accounts.
            </div>
            <div className={styles.go}>Privacy model →</div>
          </a>
          <a className={styles.capCard} href="/dvm/dero-virtual-machine">
            <div className={styles.capName}>DVM-BASIC contracts</div>
            <div className={styles.capFact}>
              A deterministic on-chain VM. Contract calls execute inside
              encrypted transactions, so state changes settle without exposing
              the caller.
            </div>
            <div className={styles.go}>Smart contracts →</div>
          </a>
          <a className={styles.capCard} href="/rpc-api/daemon-rpc-api">
            <div className={styles.capName}>RPC API</div>
            <div className={styles.capFact}>
              One JSON-RPC surface spans the daemon and the wallet, so nodes,
              wallets, and integrations share the same call shape.
            </div>
            <div className={styles.go}>RPC API →</div>
          </a>
          <a className={styles.capCard} href="/tools/tela">
            <div className={styles.capName}>TELA</div>
            <div className={styles.capFact}>
              Application code and assets are stored on-chain and served
              directly from it — no origin server to host or trust.
            </div>
            <div className={styles.go}>TELA platform →</div>
          </a>
          <a className={styles.capCard} href="/tools/xswd">
            <div className={styles.capName}>XSWD</div>
            <div className={styles.capFact}>
              A permissioned WebSocket bridge between apps and wallets. The
              wallet approves each method the app is allowed to call.
            </div>
            <div className={styles.go}>XSWD protocol →</div>
          </a>
          <a className={styles.capCard} href="/tools/mcp-server">
            <div className={styles.capName}>MCP</div>
            <div className={styles.capFact}>
              A Model Context Protocol server that exposes chain queries and docs
              as tools an AI agent can call directly.
            </div>
            <div className={styles.go}>MCP server →</div>
          </a>
        </div>
      </section>

      {/* ── DON'T TRUST, VERIFY ──────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.secTitle}>Don&apos;t trust, verify</div>
        <div className={styles.grid2}>
          <a className={styles.flatCard} href="/integrity/verify-the-supply">
            <h4 className={styles.fcH4}>Verifiable supply</h4>
            <p className={styles.fcP}>
              Total supply is a deterministic function of block height. Recompute
              it offline from the emission schedule and compare against any node.
            </p>
            <div className={styles.go}>Verify the supply →</div>
          </a>
          <a className={styles.flatCard} href="/integrity">
            <h4 className={styles.fcH4}>Six bound proofs per transaction</h4>
            <p className={styles.fcP}>
              Each transaction carries six cryptographic proofs bound to a single
              challenge hash. Forging any one invalidates the binding, so the
              whole transaction is rejected.
            </p>
            <div className={styles.go}>Protocol integrity →</div>
          </a>
        </div>
      </section>

      {/* ── BUILT FOR AI AGENTS ──────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.secTitle}>Built for AI agents</div>
        <div className={styles.grid2}>
          <div className={styles.term}>
            <div className={styles.termH}>Hosted MCP server</div>
            <code className={styles.termCode}>mcp.derod.org/mcp</code>
            <code className={styles.termCode}>npx dero-mcp-server</code>
            <div className={styles.termGo}>
              Query chain state and docs from any MCP client, hosted or run
              locally.
            </div>
          </div>
          <div className={styles.term}>
            <div className={styles.termH}>Machine-readable docs</div>
            <code className={styles.termCode}>/llms.txt</code>
            <code className={styles.termCode}>&lt;any-page-url&gt;.md</code>
            <div className={styles.termGo}>
              An index of every documentation surface, plus a Markdown mirror of
              each page.
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICKSTART ───────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.secTitle}>Quickstart</div>
        <div className={styles.qs}>
          <div className={styles.qsH}>Run the simulator and query the daemon</div>
          <pre className={styles.qsPre}>
            <span className={styles.c}>
              # 1 — start a local chain (22 pre-funded wallets, auto-mines)
            </span>
            {'\n'}
            <span className={styles.k}>./simulator</span>
            {'\n\n'}
            <span className={styles.c}># 2 — query the daemon over JSON-RPC</span>
            {'\n'}
            <span className={styles.k}>curl</span>
            {' http://127.0.0.1:20000/json_rpc -H '}
            {"'Content-Type: application/json' \\"}
            {'\n'}
            {'  -d \'{"jsonrpc":"2.0","id":"1","method":"DERO.GetInfo"}\''}
          </pre>
        </div>
        <p className={styles.sibling}>
          <b>Next:</b>{' '}
          <a href="/dvm/create-deploy-use-smart-contract">
            deploy a DVM-BASIC contract →
          </a>
        </p>
        <p className={styles.sibling}>
          <b>Build on the ecosystem:</b>{' '}
          <a href="https://tela.derod.org">TELA</a> (on-chain web) ·{' '}
          <a href="https://hologram.derod.org">Hologram</a> (wallet + browser +
          explorer) · <a href="https://deropay.derod.org">DeroPay / DeroAuth</a>{' '}
          (accept &amp; sign in with DERO).
        </p>
      </section>

      {/* ── FOOTER STRIP ─────────────────────────────────────────────────── */}
      <div className={styles.footstrip}>
        <div className={styles.footL}>Resources &amp; Community</div>
        <div className={styles.footRow}>
          <a href="/basics/wallets">Wallets &amp; downloads</a>
          <span>·</span>
          <a href="https://github.com/deroproject/derohe">GitHub</a>
          <span>·</span>
          <a href="https://derofoundation.org">derofoundation.org</a>
          <span>·</span>
          <a href="https://discord.com/invite/H95TJDp">Discord</a>
          <span>·</span>
          <a href="https://matrix.to/#/#general:matrix.dero.live">Matrix</a>
          <span>·</span>
          <a href="https://forum.dero.io/">Forum</a>
        </div>
      </div>
    </div>
  );
}
