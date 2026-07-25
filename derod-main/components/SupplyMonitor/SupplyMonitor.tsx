import { useEffect, useState } from 'react';
import styles from './SupplyMonitor.module.css';
import {
  DEC,
  NEXT_HALVING,
  TERMINAL_ATOMS,
  reward,
  supplyAtoms,
  curHeight,
  commas,
  fmtDero,
  cd,
} from './schedule';

/*
 * SupplyMonitor — live, node-independent DERO total-supply estimate.
 *
 * The supply is computed IN-BROWSER from the fixed emission schedule — no node
 * is contacted. Emission is deterministic, so the schedule figure is identical
 * for everyone and recomputable offline. This is the HERO number.
 *
 * The emission constants + pure functions live in ./schedule (single source of
 * truth, shared with the home-page SupplyRibbon).
 *
 * Honest seams (see the caption + note below, never overclaim):
 *  - Total SUPPLY is public + schedule-verifiable; individual OWNERSHIP and
 *    transfer AMOUNTS stay private. This is NOT "everything is auditable".
 *  - getinfo.total_supply is a per-node ESTIMATE (canonical linear vs fork
 *    CalcSupply) — that divergence is EXPECTED, not an error. The authoritative
 *    figure is the schedule recomputation shown here.
 *  - This live figure drifts slightly: it extrapolates height from a fixed
 *    anchor at 18s/block. It is NOT a live node feed.
 */

const TERMINAL_DERO = TERMINAL_ATOMS / DEC;

type Snapshot = {
  supplyWhole: string;
  supplyFrac: string;
  halving: string;
  reward: string;
  height: string;
  pctLabel: string;
  barWidth: string;
};

// Stable placeholder for SSR + first client render (avoids hydration mismatch,
// since Date.now() differs server vs client). Uses em dashes / zeroed bar.
const PLACEHOLDER: Snapshot = {
  supplyWhole: '—',
  supplyFrac: '',
  halving: '—',
  reward: '—',
  height: '—',
  pctLabel: '—',
  barWidth: '0%',
};

function compute(): Snapshot {
  const h = curHeight();
  const a = supplyAtoms(h);
  const [w, f] = fmtDero(a).split('.');
  const pct = (a / TERMINAL_ATOMS) * 100;
  return {
    supplyWhole: w,
    supplyFrac: f,
    halving: cd(NEXT_HALVING - h),
    reward: (reward(Math.floor(h)) / DEC).toFixed(4) + ' DERO',
    height: commas(Math.floor(h)),
    pctLabel: pct.toFixed(1) + '% of ' + commas(Math.round(TERMINAL_DERO)) + ' max',
    barWidth: pct + '%',
  };
}

export default function SupplyMonitor() {
  // mounted-guard: false during SSR + first client render so both match the
  // PLACEHOLDER. Only after mount do we start ticking with Date.now()-derived
  // values, which fixes the hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [snap, setSnap] = useState<Snapshot>(PLACEHOLDER);

  useEffect(() => {
    setMounted(true);
    const tick = () => setSnap(compute());
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, []);

  const s = mounted ? snap : PLACEHOLDER;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.top}>
          <div className={styles.kick}>Total supply · live estimate</div>
          <div className={styles.num}>
            {/* One concise static label for assistive tech; the rapidly
                ticking figure itself is hidden from screen readers so it
                doesn't spam them. */}
            <span className={styles.srOnly}>
              Total DERO supply, live estimate derived from the emission schedule
            </span>
            <span aria-hidden="true">
              {s.supplyWhole}
              {s.supplyFrac ? <span className={styles.dec}>.{s.supplyFrac}</span> : null}
            </span>
            <span className={styles.unit} aria-hidden="true">
              DERO
            </span>
          </div>
          <div className={styles.cap}>
            Derived from the fixed emission schedule — verifiable by anyone,
            trusted from no one.
          </div>
        </div>

        <div className={styles.foot} aria-hidden="true">
          <div className={styles.seg}>
            <div className={styles.l}>Next halving</div>
            <div className={`${styles.val} ${styles.amber}`}>{s.halving}</div>
          </div>
          <div className={styles.seg}>
            <div className={styles.l}>Block reward</div>
            <div className={`${styles.val} ${styles.accent}`}>{s.reward}</div>
          </div>
          <div className={styles.seg}>
            <div className={styles.l}>Height (est.)</div>
            <div className={styles.val}>{s.height}</div>
          </div>
        </div>

        <div className={styles.barrow} aria-hidden="true">
          <div className={styles.barhead}>
            <span>Minted so far</span>
            <span className={styles.r}>{s.pctLabel}</span>
          </div>
          <div className={styles.bar}>
            <span className={styles.barFill} style={{ width: s.barWidth }} />
          </div>
        </div>

        <div className={styles.cta}>
          <a
            className={styles.verify}
            href="#compute-it-yourself"
          >
            Verify this yourself →
          </a>
        </div>
      </div>
    </div>
  );
}
