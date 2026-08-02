// The gold hexagon level badge. One exported asset, three states:
// done (green tick), current (gold + gently bobbing), locked (dimmed + padlock).

import type { LevelState } from '../types'

interface HexBadgeProps {
  number: number
  state?: LevelState
  large?: boolean
}

export default function HexBadge({
  number,
  state = 'locked',
  large = false,
}: HexBadgeProps) {
  const locked = state === 'locked'
  return (
    <span className={large ? 'hex lg' : 'hex'}>
      <img
        className="hex-art"
        src={large ? '/assets/hex-badge-lg.svg' : '/assets/hex-badge.svg'}
        alt=""
      />
      <span className="hex-label">Level</span>
      <span className="hex-num">{number}</span>
      {locked && (
        <span className="hex-lock">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect
              x="4"
              y="10"
              width="16"
              height="11"
              rx="2.5"
              fill="rgba(255,255,255,0.55)"
            />
            <path
              d="M8 10V7a4 4 0 1 1 8 0v3"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
      {state === 'done' && (
        <span className="hex-tick">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5 10 17.5 19 7"
              stroke="#0d1a02"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  )
}
