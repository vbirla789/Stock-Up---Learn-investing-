import type { LevelState } from '../types'

interface HexBadgeProps {
  number: number
  state?: LevelState
  large?: boolean
}

// Locked tiles are their own artwork in Figma, not a dimmed gold badge — a
// stack of seven layers with the padlock sandwiched between the rim and the
// highlight. Offsets are the Figma ones, in a 88 x 91 box.
function LockedHex() {
  return (
    <span className="hex-locked">
      <img src="/assets/lock-hex-1.svg" alt="" style={{ left: 1.45, top: 1.5, width: 85.093, height: 87.996 }} />
      <img src="/assets/lock-hex-2.svg" alt="" style={{ left: 1.45, top: 1.5, width: 85.093, height: 87.996 }} />
      <img src="/assets/lock-hex-3.svg" alt="" style={{ left: 1.45, top: 1.77, width: 85.094, height: 87.467 }} />
      <img src="/assets/icon-lock.svg" alt="" style={{ left: 29.96, top: 31.59, width: 28, height: 28 }} />
      <img src="/assets/lock-hex-4.svg" alt="" style={{ left: 0, top: 0, width: 88, height: 90.998 }} />
      <img src="/assets/lock-hex-union.svg" alt="" style={{ left: -2.31, top: -1.16, width: 92.61, height: 95.65 }} />
      <img src="/assets/lock-hex-union2.svg" alt="" style={{ left: -0.18, top: -0.37, width: 88.37, height: 57.71 }} />
    </span>
  )
}

export default function HexBadge({
  number,
  state = 'locked',
  large = false,
}: HexBadgeProps) {
  if (state === 'locked') {
    return (
      <span className="hex">
        <LockedHex />
      </span>
    )
  }

  return (
    <span className={large ? 'hex lg' : 'hex'}>
      <img
        className="hex-art"
        src={large ? '/assets/hex-badge-lg.svg' : '/assets/hex-badge.svg'}
        alt=""
      />
      <span className="hex-label">Level</span>
      <span className="hex-num">{number}</span>
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
