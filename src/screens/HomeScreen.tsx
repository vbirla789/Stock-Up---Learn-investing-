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
                <span className="pill-icon" style={{ width: 16, height: 16 }}>
                  <img
                    src="/assets/icon-fire.svg"
                    alt=""
                    width={11.81}
                    height={15.99}
                  />
                </span>
                {streak}
              </div>
              <div className="pill">
                <span className="pill-icon" style={{ width: 18, height: 18 }}>
                  <img
                    src="/assets/icon-flash.svg"
                    alt=""
                    width={10.13}
                    height={16.13}
                  />
                </span>
                {xp}
              </div>
            </div>

            <button className="rank-pill" onClick={onOpenLeaderboard}>
              <span className="rank-pill-body">
                <span className="pill-icon" style={{ width: 16, height: 16 }}>
                  <img
                    src="/assets/icon-trophy.svg"
                    alt=""
                    width={14.5}
                    height={13.71}
                  />
                </span>
                {rank}
              </span>
              <span className="rank-pill-chevron">
                <img
                  src="/assets/icon-arrow-light.svg"
                  alt=""
                  width={10.13}
                  height={5.63}
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
                  <span className="divider-line">
                    <img src="/assets/divider-sparkle.svg" alt="" />
                  </span>
                  <h2>{section.name}</h2>
                  <span className="divider-line flip">
                    <img src="/assets/divider-sparkle-right.svg" alt="" />
                  </span>
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
