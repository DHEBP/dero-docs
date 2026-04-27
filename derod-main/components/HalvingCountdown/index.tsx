import React, { useEffect, useState, useCallback } from 'react';
import styles from './HalvingCountdown.module.css';

// DERO Emission Constants from source code
const HALVING_BLOCK = 7_000_000;
const BLOCK_TIME_SECONDS = 18;

// Community node RPC endpoints (primary first, fallback second)
const RPC_ENDPOINTS = [
  'https://community-pools.mysrv.cloud/json_rpc',
  'https://dero.osx.fr/json_rpc',
  'https://dero-node-ch4k1pu.mysrv.cloud/json_rpc'
];

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface HalvingCountdownProps {
  className?: string;
  showDetails?: boolean;
}

const HalvingCountdown: React.FC<HalvingCountdownProps> = ({
  className = '',
  showDetails = true
}) => {
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [blocksRemaining, setBlocksRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [halvingComplete, setHalvingComplete] = useState(false);

  // Fetch current block height from DERO node
  const fetchHeight = useCallback(async () => {
    try {
      let lastError: unknown = null;

      for (const endpoint of RPC_ENDPOINTS) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: '1',
              method: 'DERO.GetInfo'
            })
          });

          if (!response.ok) throw new Error('Network response was not ok');

          const data = await response.json();

          if (data.result && typeof data.result.topoheight === 'number') {
            setCurrentHeight(data.result.topoheight);
            setError(null);
            return;
          }

          throw new Error('Invalid response format');
        } catch (err) {
          lastError = err;
        }
      }

      throw lastError ?? new Error('All RPC endpoints failed');
    } catch (err) {
      console.error('Failed to fetch block height:', err);
      setError('Unable to connect to node');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchHeight();
    const interval = setInterval(fetchHeight, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchHeight]);

  // Calculate time remaining
  useEffect(() => {
    if (currentHeight === null) return;

    const remaining = HALVING_BLOCK - currentHeight;
    
    if (remaining <= 0) {
      setHalvingComplete(true);
      setBlocksRemaining(0);
      return;
    }

    setBlocksRemaining(remaining);
    
    const updateCountdown = () => {
      const now = Date.now();
      const targetTime = now + (remaining * BLOCK_TIME_SECONDS * 1000);
      const diff = targetTime - Date.now();
      
      if (diff <= 0) {
        setHalvingComplete(true);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(countdownInterval);
  }, [currentHeight]);

  // Calculate progress percentage
  const progressPercentage = currentHeight 
    ? Math.min(100, (currentHeight / HALVING_BLOCK) * 100)
    : 0;

  // Estimate halving date
  const estimatedDate = timeRemaining 
    ? new Date(Date.now() + (blocksRemaining * BLOCK_TIME_SECONDS * 1000))
    : null;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (halvingComplete) {
    return (
      <div className={`${styles.container} ${styles.complete} ${className}`}>
        <div className={styles.celebrationEmoji}>🎉</div>
        <h3 className={styles.title}>First Halving Complete!</h3>
        <p className={styles.subtitle}>Block reward has been reduced to ~0.31 DERO</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.icon}>⏱️</div>
        <h3 className={styles.title}>First Emission Halving</h3>
      </div>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Connecting to network...</span>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <span>⚠️ {error}</span>
          <button onClick={fetchHeight} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : timeRemaining && (
        <>
          <div className={styles.countdown}>
            <div className={styles.timeUnit}>
              <span className={styles.value}>{timeRemaining.days}</span>
              <span className={styles.label}>Days</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeUnit}>
              <span className={styles.value}>{String(timeRemaining.hours).padStart(2, '0')}</span>
              <span className={styles.label}>Hours</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeUnit}>
              <span className={styles.value}>{String(timeRemaining.minutes).padStart(2, '0')}</span>
              <span className={styles.label}>Min</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeUnit}>
              <span className={styles.value}>{String(timeRemaining.seconds).padStart(2, '0')}</span>
              <span className={styles.label}>Sec</span>
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className={styles.progressLabels}>
              <span>Genesis</span>
              <span>{progressPercentage.toFixed(1)}%</span>
              <span>7M</span>
            </div>
          </div>

          {showDetails && (
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Current Height</span>
                <span className={styles.detailValue}>
                  {currentHeight?.toLocaleString()}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Target Block</span>
                <span className={styles.detailValue}>
                  {HALVING_BLOCK.toLocaleString()}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Blocks Remaining</span>
                <span className={styles.detailValue}>
                  {blocksRemaining.toLocaleString()}
                </span>
              </div>
              {estimatedDate && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Est. Date</span>
                  <span className={styles.detailValue}>
                    ~{formatDate(estimatedDate)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className={styles.footer}>
            <span className={styles.footerNote}>
              Block reward will reduce from ~0.615 to ~0.31 DERO
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default HalvingCountdown;

