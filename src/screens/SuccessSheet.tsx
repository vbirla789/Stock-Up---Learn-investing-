import { PrimaryButton } from '../components/Chrome'
import HexBadge from '../components/HexBadge'
import { XP_PER_LEVEL } from '../data/levels'

interface SuccessSheetProps {
  levelId: number
  onClose: () => void
  onLeaderboard: () => void
  onShare: () => void
}

// Level completion is a bottom sheet over the dimmed lesson, not its own
// screen. Vertical rhythm is the Figma frame's: 48 above the badge, 47 below
// it, 48 before the buttons, 24 at the foot.
export default function SuccessSheet({
  levelId,
  onClose,
  onLeaderboard,
  onShare,
}: SuccessSheetProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber">
          <span />
        </div>

        <div className="sheet-body">
          <img className="sheet-glare" src="/assets/success-glare.svg" alt="" />

          <div className="sheet-badge">
            <HexBadge number={levelId} state="current" large />
          </div>

          <div className="success-rank">
            <div className="success-rank-line">
              <img
                src="/assets/sparkle-left.svg"
                alt=""
                width={40}
                height={15}
              />
              <p>You’ve completed Level {levelId}</p>
              <img
                src="/assets/sparkle-right.svg"
                alt=""
                width={40}
                height={15}
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
            <div className="success-xp">
              <img
                src="/assets/icon-flash-lg.svg"
                alt=""
                width={16}
                height={26}
              />
              {XP_PER_LEVEL}
            </div>
          </div>

          <div className="sheet-actions">
            <PrimaryButton onClick={onLeaderboard}>
              View leaderboard
            </PrimaryButton>
            <button className="btn-secondary" onClick={onShare}>
              Share
              <img src="/assets/icon-upload.svg" alt="" width={20} height={20} />
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
