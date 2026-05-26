import cn from 'clsx'

// Framed figure for screenshots / explorer captures.
// Pass the image as a child (markdown ![]() works thanks to staticImage);
// `caption` renders a subtle figcaption beneath the frame.
export function Screenshot({ children, caption, className }) {
  return (
    <figure className="my-6">
      <div
        className={cn(
          'flex justify-center overflow-hidden rounded-lg border',
          'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900',
          className
        )}
      >
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
