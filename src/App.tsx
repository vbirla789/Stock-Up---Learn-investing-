import { useEffect, useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import LevelScreen from './screens/LevelScreen'
import SuccessScreen from './screens/SuccessScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import { XP_PER_LEVEL } from './data/levels'
import { rankFor } from './data/leaderboard'
import type { Progress, View } from './types'

const KEY = 'nocap-progress-v1'

// Starting state matches the Figma home screen exactly: a 5-day streak,
// 100 XP already banked and rank 28 — with level 1 as the only one open.
const initial: Progress = {
  completed: 0,
  xp: 100,
  streak: 5,
  doneToday: false,
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    return { ...initial, ...(JSON.parse(raw) as Partial<Progress>) }
  } catch {
    return initial
  }
}

export default function App() {
  const [state, setState] = useState<Progress>(load)
  const [view, setView] = useState<View>({ name: 'home' })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* private mode — progress just won't persist */
    }
  }, [state])

  function completeLevel(id: number) {
    setState((s) => {
      const first = id > s.completed
      return {
        ...s,
        completed: first ? id : s.completed,
        xp: first ? s.xp + XP_PER_LEVEL : s.xp,
        doneToday: true,
      }
    })
    setView({ name: 'success', levelId: id })
  }

  function reset() {
    setState(initial)
    setView({ name: 'home' })
  }

  function share(levelId: number) {
    const text = `I just cleared level ${levelId} on nocap — learning the market before I risk a rupee.`
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else if (navigator.clipboard) navigator.clipboard.writeText(text)
  }

  return (
    <div className="stage">
      <div className="device">
        <div
          className="screen"
          key={view.name + ('levelId' in view ? view.levelId : '')}
        >
          {view.name === 'home' && (
            <HomeScreen
              state={{ ...state, rank: rankFor(state.xp) }}
              onOpenLevel={(id) => setView({ name: 'level', levelId: id })}
              onOpenLeaderboard={() => setView({ name: 'leaderboard' })}
            />
          )}

          {view.name === 'level' && (
            <LevelScreen
              levelId={view.levelId}
              onExit={() => setView({ name: 'home' })}
              onComplete={completeLevel}
            />
          )}

          {view.name === 'success' && (
            <SuccessScreen
              levelId={view.levelId}
              onClose={() => setView({ name: 'home' })}
              onLeaderboard={() => setView({ name: 'leaderboard' })}
              onShare={() => share(view.levelId)}
            />
          )}

          {view.name === 'leaderboard' && (
            <LeaderboardScreen
              onBack={() => setView({ name: 'home' })}
              xp={state.xp}
            />
          )}
        </div>
      </div>

      <button className="reset-btn" onClick={reset}>
        Reset demo
      </button>
    </div>
  )
}
