import HexBadge from '../components/HexBadge'
import { XP_PER_LEVEL } from '../data/levels'

interface SuccessSheetProps {
  levelId: number
  onClose: () => void
  onLeaderboard: () => void
  onShare: () => void
}

// Level completion is a bottom sheet over the dimmed lesson, not its own
// screen. The card is the frame's 366 x 501: 48 above the badge, 27 below it,
// 48 between the copy and the buttons, 24 at the foot.
export default function SuccessSheet({
  levelId,
  onClose,
  onLeaderboard,
  onShare,
}: SuccessSheetProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      {/* grabber, card and indicator ride up as one piece */}
      <div className="sheet-stack">
        <div className="sheet-grabber">
          <span />
        </div>

        <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="cell-grid" />
        <img className="sheet-glare" src="/assets/success/glare.svg" alt="" />

        <div className="sheet-badge">
          <HexBadge number={levelId} />
        </div>

        <div className="success-rank">
          <div className="success-rank-line">
            <img src="/assets/success/sparkle-left.svg" alt="" />
            <p>You’ve completed Level {levelId}</p>
            <img src="/assets/success/sparkle-right.svg" alt="" />
          </div>
          <div className="success-xp">
            {/* 24 box, 13.5 glyph — so the 4px gap is measured off the box */}
            <span className="pill-icon" style={{ width: 24, height: 24 }}>
              <img
                src="/assets/success/icon-flash-lg.svg"
                alt=""
                width={13.5}
                height={21.5}
              />
            </span>
            {XP_PER_LEVEL}
          </div>
        </div>

        <div className="sheet-actions">
          <button className="btn-pill" onClick={onLeaderboard}>
            View leaderboard
          </button>
          <button className="btn-ghost" onClick={onShare}>
            <span className="pill-icon" style={{ width: 20, height: 20 }}>
              <img
                src="/assets/success/icon-upload.svg"
                alt=""
                width={14.01}
                height={13.95}
              />
            </span>
            Share with friends
          </button>
        </div>
        </div>

        <div className="sheet-home-indicator">
          <span />
        </div>
      </div>
    </div>
  )
}
