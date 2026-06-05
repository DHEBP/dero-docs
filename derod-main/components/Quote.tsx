import React from 'react'
import styles from './Quote.module.css'

type QuoteProps = {
  channel: string
  date: string
  source?: string
  archival?: boolean
  author?: string
  children: React.ReactNode
}

export default function Quote({
  channel,
  date,
  source,
  archival = false,
  author = 'Captain',
  children,
}: QuoteProps) {
  return (
    <figure
      className={styles.quote}
      aria-label={`Quote from ${author} in ${channel} on ${date}`}
    >
      <header className={styles.header}>
        <span className={styles.channel}>{channel}</span>
        <span className={styles.sep} aria-hidden="true">·</span>
        <time className={styles.date} dateTime={date}>{date}</time>
        {archival && (
          <>
            <span className={styles.sep} aria-hidden="true">·</span>
            <span className={styles.archival}>archival</span>
          </>
        )}
        {source && (
          <a
            className={styles.source}
            href={source}
            target="_blank"
            rel="noopener noreferrer"
          >
            source ↗
          </a>
        )}
      </header>
      <blockquote className={styles.body}>{children}</blockquote>
      <figcaption className={styles.author}>— {author}</figcaption>
    </figure>
  )
}
