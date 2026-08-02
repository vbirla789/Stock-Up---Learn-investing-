import { useRef, useState } from 'react'
import { StatusBar, HomeBar, ScreenBg } from '../components/Chrome'
import HexBadge from '../components/HexBadge'
import levels from '../data/levels'
import type { HomeState, LevelState } from '../types'

interface HomeScreenProps {
  state: HomeState
  onOpenLevel: (id: number) => void
  onOpenLeaderboard: () => void
}

interface Nudge {
  accent: string
  rest: string
}

// One nudge at a time, highest priority wins:
// 1. streak at risk  2. progress to the SIP  3. you're ready
function nudgeFor(completed: number, doneToday: boolean): Nudge {
  if (!doneToday)
    return { accent: 'One level today', rest: ' keeps your 5-day streak.' }
  const left = levels.length - completed
  if (left === 0)
    return { accent: 'You’re ready.', rest: ' Start your SIP below.' }
  if (left === 1)
    return { accent: 'One level left.', rest: ' Then you can start your SIP.' }
  return { accent: `${left} levels`, rest: ' to unlock your SIP.' }
}

export default function HomeScreen({
  state,
  onOpenLevel,
  onOpenLeaderboard,
}: HomeScreenProps) {
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  const { completed, xp, streak, rank, doneToday } = state
  const nudge = nudgeFor(completed, doneToday)

  // A locked tile is never a dead tap — it says what to finish first.
  function tapLocked() {
    setToast(`Finish level ${completed + 1} first.`)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }

  return (
    <>
      <ScreenBg />
      <StatusBar />

      <div className="home">
        <div className="home-inner">
          <div className="home-head">
            <div className="home-head-row">
              <div className="home-head-left">
                <div className="pill">
                  <img src="/assets/icon-fire.svg" alt="" width={13} height={16} />
                  {streak}
                </div>
                <div className="pill">
                  <img
                    src="/assets/icon-flash.svg"
                    alt=""
                    width={10}
                    height={16}
                  />
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
                    width={8}
                    height={4.5}
                    style={{ transform: 'rotate(90deg)' }}
                  />
                </span>
              </button>
            </div>

            <div className="nudge">
              <b>{nudge.accent}</b>
              {nudge.rest}
              <img className="nudge-glare" src="/assets/nudge-glare.svg" alt="" />
            </div>
          </div>

          <div className="level-grid">
            {levels.map((level) => {
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
      </div>

      {toast && <div className="toast">{toast}</div>}

      <HomeBar />
    </>
  )
}
