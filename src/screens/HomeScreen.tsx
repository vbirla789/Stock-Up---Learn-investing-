import { useRef, useState } from 'react'
import { StatusBar, HomeBar } from '../components/Chrome'
import HexBadge from '../components/HexBadge'
import levels, { sections } from '../data/levels'
import type { HomeState, LevelState } from '../types'

interface HomeScreenProps {
  state: HomeState
  onOpenLevel: (id: number) => void
  onOpenLeaderboard: () => void
}

// One nudge at a time, highest priority wins:
// 1. streak at risk  2. progress to the SIP  3. you're ready
function nudgeFor(completed: number, doneToday: boolean): string {
  if (!doneToday) return 'One level today keeps your 5-day streak.'
  const left = levels.length - completed
  if (left === 0) return 'You’re ready. Start your SIP below.'
  if (left === 1) return 'One level left. Then you can start your SIP.'
  return `${left} levels to unlock your SIP.`
}

export default function HomeScreen({
  state,
  onOpenLevel,
  onOpenLeaderboard,
}: HomeScreenProps) {
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  const { completed, xp, streak, rank, doneToday } = state

  // A locked tile is never a dead tap — it says what to finish first.
  function tapLocked() {
    setToast(`Finish level ${completed + 1} first.`)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }

  return (
    <>
      <div className="bg bg-home">
        <div className="bg-glow" />
        <div className="bg-grid" />
      </div>

      <StatusBar />

      <div className="home">
        <div className="home-inner">
          <div className="home-head-row">
            <div className="home-head-left">
              <div className="pill">
                <img src="/assets/icon-fire.svg" alt="" width={13} height={16} />
                {streak}
              </div>
              <div className="pill">
                <img src="/assets/icon-flash.svg" alt="" width={10} height={16} />
                {xp}
              </div>
            </div>

            <button className="rank-pill" onClick={onOpenLeaderboard}>
              <span className="rank-pill-body">
                <img
                  src="/assets/icon-trophy.svg"
                  alt=""
                  width={16}
                  height={14}
                />
                {rank}
              </span>
              <span className="rank-pill-chevron">
                <img
                  src="/assets/icon-arrow.svg"
                  alt=""
                  width={8.75}
                  height={4.4}
                  style={{ transform: 'rotate(90deg)' }}
                />
              </span>
            </button>
          </div>

          <div className="nudge">
            <img src="/assets/icon-info.svg" alt="" width={18} height={18} />
            <span>{nudgeFor(completed, doneToday)}</span>
            <img className="nudge-glare" src="/assets/nudge-glare.svg" alt="" />
          </div>

          <div className="home-sections">
            {sections.map((section) => (
              <div className="home-section" key={section.name}>
                <div className="divider">
                  <img className="divider-line" src="/assets/divider-sparkle.svg" alt="" />
                  <h2>{section.name}</h2>
                  <img
                    className="divider-line flip"
                    src="/assets/divider-sparkle.svg"
                    alt=""
                  />
                </div>

                <div className="level-grid">
                  {section.levels.map((level) => {
                    const done = level.id <= completed
                    const current = level.id === completed + 1
                    const st: LevelState = done
                      ? 'done'
                      : current
                        ? 'current'
                        : 'locked'
                    return (
                      <button
                        key={level.id}
                        className={`level-cell is-${st}`}
                        onClick={() =>
                          done || current ? onOpenLevel(level.id) : tapLocked()
                        }
                      >
                        <HexBadge number={level.id} state={st} />
                        <span className="level-name">{level.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <HomeBar />
    </>
  )
}
