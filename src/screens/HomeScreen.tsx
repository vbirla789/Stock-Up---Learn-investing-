import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { StatusBar, HomeBar } from '../components/Chrome'
import levels from '../data/levels'
import type { HomeState, LevelState } from '../types'

interface HomeScreenProps {
  state: HomeState
  onOpenLevel: (id: number) => void
  onOpenLeaderboard: () => void
}

const STONE: Record<LevelState, string> = {
  done: '/assets/path/stone-done.svg',
  current: '/assets/path/stone-current.svg',
  locked: '/assets/path/stone-locked.png',
}

// The trail snakes as it climbs: right, middle, left, middle, repeat. Level 1
// starts on the right, so the lane falls out of the level's own number.
const LANES = ['is-right', 'is-center', 'is-left', 'is-center'] as const

function laneFor(id: number) {
  return LANES[(id - 1) % LANES.length]
}

function stateFor(id: number, completed: number): LevelState {
  if (id <= completed) return 'done'
  if (id === completed + 1) return 'current'
  return 'locked'
}

export default function HomeScreen({
  state,
  onOpenLevel,
  onOpenLeaderboard,
}: HomeScreenProps) {
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  const scroller = useRef<HTMLDivElement>(null)
  const current = useRef<HTMLButtonElement>(null)
  const { completed, xp, streak, rank } = state

  // The climb runs bottom-to-top — the SIP is the summit and the level you can
  // actually play is near the foot, so open the screen parked on it.
  useLayoutEffect(() => {
    const box = scroller.current
    const node = current.current
    if (!box || !node) return
    box.scrollTop = node.offsetTop - (box.clientHeight - node.offsetHeight) / 2
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  // A locked stone is never a dead tap — it says what to finish first.
  function tapLocked() {
    setToast(`Finish level ${completed + 1} first.`)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }

  const finished = completed >= levels.length

  return (
    <div className="light-screen home">
      <div className="dot-grid" />
      <StatusBar />

      <div className="home-head">
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

          <button className="pill rank-pill" onClick={onOpenLeaderboard}>
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
                src="/assets/path/arrow.svg"
                alt=""
                width={10.13}
                height={5.63}
                style={{ transform: 'rotate(90deg)' }}
              />
            </span>
          </button>
        </div>

        <div className="nudge">
          <p className="nudge-lead">
            {finished
              ? `All ${levels.length} levels done!`
              : `Level ${completed + 1} reached!`}
          </p>
          <p className="nudge-sub">
            {finished
              ? 'Start your SIP at the top'
              : `Complete to maintain your ${streak}-day streak`}
          </p>
        </div>
      </div>

      {/* Rendered summit-first, so the array is walked in reverse */}
      <div className="home-scroll" ref={scroller}>
        <ol className="path">
          {levels
            .slice()
            .reverse()
            .map((level) => {
              const st = stateFor(level.id, completed)
              return (
                <li className={`path-row ${laneFor(level.id)}`} key={level.id}>
                  <button
                    className={`path-node is-${st}`}
                    ref={st === 'current' ? current : undefined}
                    onClick={() =>
                      st === 'locked' ? tapLocked() : onOpenLevel(level.id)
                    }
                  >
                    <span className="stone">
                      <img src={STONE[st]} alt="" />
                    </span>
                    <span className="path-name">{level.title}</span>
                  </button>
                </li>
              )
            })}
        </ol>
      </div>

      {toast && <div className="toast">{toast}</div>}

      <HomeBar />
    </div>
  )
}
