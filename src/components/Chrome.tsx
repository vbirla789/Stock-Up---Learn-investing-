// Shared screen chrome: iOS status bar, home indicator, the layered background
// and the chunky primary button. All lifted straight from the Figma frames.

import type { ReactNode } from 'react'

interface IconButtonProps {
  onClick: () => void
}

export function StatusBar() {
  return (
    <div className="statusbar">
      <span className="statusbar-time">9:41</span>
      <div className="statusbar-icons">
        <img src="/assets/sb-cellular.svg" alt="" width={17} height={11} />
        <img src="/assets/sb-wifi.svg" alt="" width={15.3} height={11} />
        <span
          style={{
            position: 'relative',
            width: 24.33,
            height: 11.33,
            display: 'inline-block',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 22,
              height: 11.33,
              border: '1px solid #fff',
              opacity: 0.35,
              borderRadius: 2.67,
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: 2,
              top: 2,
              width: 18,
              height: 7.33,
              background: '#fff',
              borderRadius: 1.33,
            }}
          />
          <img
            src="/assets/sb-cap.svg"
            alt=""
            style={{ position: 'absolute', right: 0, top: 3.67, width: 1.33 }}
          />
        </span>
      </div>
    </div>
  )
}

export function HomeBar() {
  return (
    <div className="homebar">
      <span />
    </div>
  )
}

// Same backdrop as home — a tall glow behind the faint grid — but with the
// glow centred at the top of the screen rather than the middle.
export function ScreenBg() {
  return (
    <div className="bg bg-screen">
      <div className="bg-glow" />
      <div className="bg-grid" />
    </div>
  )
}

interface PrimaryButtonProps {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: PrimaryButtonProps) {
  return (
    <button className="btn-primary" onClick={onClick} disabled={disabled}>
      <img src="/assets/btn-primary.svg" alt="" />
      <span>{children}</span>
    </button>
  )
}

export function BackButton({ onClick }: IconButtonProps) {
  return (
    <button className="icon-btn" onClick={onClick} aria-label="Back">
      <i>
        <img
          src="/assets/icon-arrow-light.svg"
          alt=""
          width={13.5}
          height={7.5}
          style={{ transform: 'rotate(-90deg)' }}
        />
      </i>
    </button>
  )
}

export function CloseButton({ onClick }: IconButtonProps) {
  return (
    <button className="icon-btn" onClick={onClick} aria-label="Close">
      <i>
        <img src="/assets/icon-cross.svg" alt="" width={11.5} height={11.5} />
      </i>
    </button>
  )
}
