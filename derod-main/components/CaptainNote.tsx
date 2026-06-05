import React from 'react'
import styles from './CaptainNote.module.css'

type Variant = 'inline' | 'figure' | 'pullquote' | 'verified'

type CaptainNoteProps = {
  source: string
  date: string
  channel?: string
  variant?: Variant
  codeRef?: string
  children: React.ReactNode
}

export default function CaptainNote({
  source,
  date,
  channel,
  variant = 'inline',
  codeRef,
  children,
}: CaptainNoteProps) {
  const variantClass = styles[`variant_${variant}`] ?? ''
  // When used as a caption beneath a <figure>'s <img>, render as <figcaption>
  // (the figure provides semantic context, so the explicit landmark + aria-label
  // are dropped). All other variants render as <aside> with the landmark label.
  const Root = variant === 'figure' ? 'figcaption' : 'aside'
  const rootProps =
    variant === 'figure'
      ? { className: `${styles.note} ${variantClass}` }
      : {
          className: `${styles.note} ${variantClass}`,
          'aria-label': `Captain note from ${date}${channel ? ` in ${channel}` : ''}`,
        }
  return (
    <Root {...rootProps}>
      <div className={styles.body}>{children}</div>
      <footer className={styles.attribution}>
        <span className={styles.author}>— Captain</span>
        <span className={styles.sep} aria-hidden="true">·</span>
        <time className={styles.date} dateTime={date}>{date}</time>
        {channel && (
          <>
            <span className={styles.sep} aria-hidden="true">·</span>
            <span className={styles.channel}>{channel}</span>
          </>
        )}
        <a
          className={styles.source}
          href={source}
          target="_blank"
          rel="noopener noreferrer"
        >
          source ↗
        </a>
        {variant === 'verified' && codeRef && (
          <span className={styles.verified}>
            <span className={styles.verifiedBadge}>✓ verified · Release 142</span>
            <code className={styles.codeRef}>{codeRef}</code>
          </span>
        )}
      </footer>
    </Root>
  )
}
