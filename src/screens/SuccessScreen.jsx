import {
  StatusBar,
  HomeBar,
  PrimaryButton,
  CloseButton,
} from '../components/Chrome'
import HexBadge from '../components/HexBadge'
import levels, { XP_PER_LEVEL } from '../data/levels'

export default function SuccessScreen({
  levelId,
  onClose,
  onLeaderboard,
  onShare,
}) {
  const last = levelId >= levels.length

  return (
    <>
      <div className="success-grain" />
      <img className="success-glare" src="/assets/success-glare.svg" alt="" />
      <StatusBar />

      <div className="success">
        <div style={{ padding: '0 20px', display: 'flex' }}>
          <CloseButton onClick={onClose} />
        </div>

        <div className="success-body">
          <div className="success-badge">
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

          <p className="success-note">
            {last ? (
              <>
                Every level done. <em>Your SIP is unlocked.</em>
              </>
            ) : (
              <>
                You need {XP_PER_LEVEL} more XP to reach{' '}
                <em>Level {levelId + 1}</em>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="footer">
        <PrimaryButton onClick={onLeaderboard}>View leaderboard</PrimaryButton>
        <button className="btn-secondary" onClick={onShare}>
          Share
          <img src="/assets/icon-upload.svg" alt="" width={20} height={20} />
        </button>
      </div>

      <HomeBar />
    </>
  )
}
