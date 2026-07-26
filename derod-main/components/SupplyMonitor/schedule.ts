/*
 * schedule — DERO emission schedule: the single source of truth for the
 * total-supply estimate shown on the home page and the verify-the-supply page.
 *
 * The supply is a deterministic function of block height, computed in-browser
 * from the fixed schedule — no node is contacted. Both SupplyMonitor and
 * SupplyRibbon import from here so the height anchor lives in ONE place.
 *
 * ANCHOR: refresh ANCHOR_HEIGHT/ANCHOR_TIME each deploy to bound drift.
 *
 * Supply constants match DEROFDN/derohe (community-dev), the current node code:
 *   CalcSupply + launch credit -> blockchain/supply.go
 *   CalcBlockReward            -> blockchain/transaction_execute.go
 *   PREMINE                    -> config/config.go
 */

export const BASE = 123000; // atomic base reward; derohe derives this as (41*100000*BLOCK_TIME)/600 with BLOCK_TIME=18
export const RRI = 7_000_000; // reward reduction interval (blocks)
export const PREMINE = 1_228_125_400_000; // atomic (= 12,281,254 DERO)
export const CREDIT = 271_739_600; // one-time launch credit: 0.002 DERO × 1,358,698 accounts < block 144,000
export const DEC = 100_000; // 5 decimals: atomic / DEC = DERO
export const BLOCK_TIME = 18; // seconds

export const NEXT_HALVING = 14_000_000; // block of the next reward halving
// Terminal / true finite max supply = 20,893,411 DERO — the CalcSupply cap: 20,890,694
// of scheduled emission (premine + every FLOORED epoch reward, reward → 0 near block ~112M)
// + the one-time 271,739,600-atomic launch credit. Matches what a current node reports.
export const TERMINAL_ATOMS = 2_089_341_139_600; // = 20,893,411.396 DERO (emission cap + launch credit)

// ── Height anchor ─────────────────────────────────────────────────────────────
// Tip 7,380,505 observed 2026-07-25. REFRESH THIS ANCHOR AT EACH DEPLOY so the
// extrapolation stays close to the real tip.
export const ANCHOR_HEIGHT = 7_380_505;
export const ANCHOR_TIME = Date.parse('2026-07-25T16:00:00Z');

// CalcBlockReward(h) = 123000 >> ((h + RRI) / RRI), integer math.
export const reward = (h: number) =>
  Math.floor(BASE / 2 ** Math.floor((h + RRI) / RRI));

// Total atomic supply at (possibly fractional) height hF (= derohe CalcSupply):
// premine + one-time launch credit + sum of CalcBlockReward(h) over [0, floor(hF)) + partial block.
export function supplyAtoms(hF: number): number {
  const hI = Math.floor(hF);
  let s = PREMINE + CREDIT;
  let rem = hI;
  let st = 0;
  while (rem > 0) {
    const n = Math.min(rem, RRI);
    s += reward(st) * n;
    rem -= n;
    st += RRI;
  }
  return s + reward(hI) * (hF - hI);
}

export const curHeight = () =>
  ANCHOR_HEIGHT + (Date.now() - ANCHOR_TIME) / 1000 / BLOCK_TIME;

export const commas = (n: number) => n.toLocaleString('en-US');

// Format atomic -> "12,345,678.12345" (whole with commas + d fractional digits).
export const fmtDero = (a: number, d = 5) => {
  const x = a / DEC;
  const w = Math.floor(x);
  return commas(w) + '.' + (x - w).toFixed(d).slice(2);
};

// Countdown string from a number of blocks (blocks * 18s) -> "Nd HH:MM:SS".
export function cd(bl: number): string {
  let s = Math.max(0, Math.floor(bl * BLOCK_TIME));
  const D = Math.floor(s / 86400);
  s -= D * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return `${commas(D)}d ${String(h).padStart(2, '0')}:${String(m).padStart(
    2,
    '0'
  )}:${String(s).padStart(2, '0')}`;
}
