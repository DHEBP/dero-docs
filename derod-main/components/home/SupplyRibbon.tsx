import { useEffect, useState } from 'react';
import styles from './SupplyRibbon.module.css';
import {
  NEXT_HALVING,
  TERMINAL_ATOMS,
  reward,
  supplyAtoms,
  curHeight,
  fmtDero,
  cd,
  DEC,
} from '../SupplyMonitor/schedule';

/*
 * SupplyRibbon — the home-page compact supply ribbon.
 *
 * Same schedule-derived, node-independent figure as SupplyMonitor, in a slim
 * container-responsive strip. Constants + math come from the shared
 * ../SupplyMonitor/schedule so the height anchor lives in one place.
 */

type Snapshot = {
  supplyWhole: string;
  supplyFrac: string;
  halving: string;
  reward: string;
  pct: string;
};

// Stable placeholder for SSR + first client render (Date.now() differs server
// vs client — render this until mounted, then start ticking).
const PLACEHOLDER: Snapshot = {
  supplyWhole: '—',
  supplyFrac: '',
  halving: '—',
  reward: '—',
  pct: '—',
};

function compute(): Snapshot {
  const h = curHeight();
  const a = supplyAtoms(h);
  const [w, f] = fmtDero(a).split('.');
  return {
    supplyWhole: w,
    supplyFrac: f,
    halving: cd(NEXT_HALVING - h),
    reward: (reward(Math.floor(h)) / DEC).toFixed(4) + ' DERO',
    pct: ((a / TERMINAL_ATOMS) * 100).toFixed(1) + '%',
  };
}

export default function SupplyRibbon() {
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
    <div className={styles.cq}>
      <div className={styles.ribbon}>
        <div className={styles.main}>
          <div className={styles.rl}>Total supply · estimate</div>
          <div className={styles.rnum}>
            <span className={styles.srOnly}>
              Total DERO supply, live estimate derived from the emission schedule
            </span>
            <span aria-hidden="true">
              {s.supplyWhole}
              {s.supplyFrac ? (
                <span className={styles.dec}>.{s.supplyFrac}</span>
              ) : null}
            </span>
            <span className={styles.unit} aria-hidden="true">
              DERO
            </span>
          </div>
        </div>
        <div className={styles.stats} aria-hidden="true">
          <div className={styles.stat}>
            <div className={styles.sl}>Next halving</div>
            <div className={`${styles.sv} ${styles.amber}`}>{s.halving}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.sl}>Reward</div>
            <div className={`${styles.sv} ${styles.acc}`}>{s.reward}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.sl}>Minted</div>
            <div className={styles.sv}>{s.pct}</div>
          </div>
        </div>
      </div>
      <p className={styles.cCap}>
        Deterministic from block height —{' '}
        <a className={styles.link} href="/integrity/verify-the-supply">
          recompute from the schedule →
        </a>{' '}
        &nbsp;·&nbsp; supply public, balances encrypted.
      </p>
    </div>
  );
}
