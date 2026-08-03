import { flushSync } from 'react-dom'

type Direction = 'forward' | 'back'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Runs a screen change inside a view transition so the old screen crosses over
 * the new one instead of being cut away. The direction lands on <html> before
 * the snapshot is taken, which is what lets forward and back read differently.
 *
 * `flushSync` is what makes this work at all: the browser snapshots the DOM
 * the moment the callback returns, so React has to have committed by then.
 */
export default function navigate(
  update: () => void,
  direction: Direction = 'forward',
) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update()
    return
  }

  document.documentElement.dataset.nav = direction
  document.startViewTransition(() => flushSync(update))
}
