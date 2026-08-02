// Shared screen chrome: iOS status bar, home indicator, the layered background
// and the chunky primary button. All lifted straight from the Figma frames.

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

export function ScreenBg() {
  return (
    <div className="bg">
      <div className="bg-glow" />
      <img className="bg-texture" src="/assets/bg-texture.png" alt="" />
      <div className="bg-swoosh">
        <img src="/assets/bg-swoosh.svg" alt="" />
      </div>
      <div className="bg-fade" />
    </div>
  )
}

export function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button className="btn-primary" onClick={onClick} disabled={disabled}>
      <img src="/assets/btn-primary.svg" alt="" />
      <span>{children}</span>
    </button>
  )
}

export function BackButton({ onClick, size = 'sm' }) {
  return (
    <button
      className={size === 'lg' ? 'icon-btn lg' : 'icon-btn'}
      onClick={onClick}
      aria-label="Back"
    >
      <img
        src="/assets/icon-arrow-light.svg"
        alt=""
        width={13.5}
        height={7.5}
        style={{ transform: 'rotate(-90deg)' }}
      />
    </button>
  )
}

export function CloseButton({ onClick }) {
  return (
    <button className="icon-btn lg" onClick={onClick} aria-label="Close">
      <img src="/assets/icon-cross.svg" alt="" width={12} height={12} />
    </button>
  )
}
