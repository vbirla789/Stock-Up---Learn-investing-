import { useEffect, useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import LevelScreen from './screens/LevelScreen'
import SuccessSheet from './screens/SuccessSheet'
import LeaderboardScreen from './screens/LeaderboardScreen'
import { XP_PER_LEVEL } from './data/levels'
import { rankFor } from './data/leaderboard'
import type { Progress, View } from './types'

const KEY = 'nocap-progress-v1'
const ONBOARDED = 'nocap-onboarded-v1'

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
  // Completion is a sheet over the lesson, so the level screen stays mounted
  // behind it rather than being swapped out for a success screen.
  const [sheetLevel, setSheetLevel] = useState<number | null>(null)
  // Onboarding runs once, on the first load of the site. `runId` bumps on
  // reset so replaying it remounts the screen and the animation starts over.
  const [onboarding, setOnboarding] = useState(
    () => !localStorage.getItem(ONBOARDED),
  )
  const [runId, setRunId] = useState(0)

  function finishOnboarding() {
    try {
      localStorage.setItem(ONBOARDED, '1')
    } catch {
      /* private mode — it'll just show again next visit */
    }
    setOnboarding(false)
  }

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
    setSheetLevel(id)
  }

  function go(next: View) {
    setSheetLevel(null)
    setView(next)
  }

  function reset() {
    setState(initial)
    try {
      localStorage.removeItem(ONBOARDED)
    } catch {
      /* ignore */
    }
    setOnboarding(true)
    setRunId((n) => n + 1)
    go({ name: 'home' })
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
          key={
            onboarding
              ? `onboarding-${runId}`
              : view.name + ('levelId' in view ? view.levelId : '')
          }
        >
          {onboarding && <OnboardingScreen onDone={finishOnboarding} />}

          {!onboarding && view.name === 'home' && (
            <HomeScreen
              state={{ ...state, rank: rankFor(state.xp) }}
              onOpenLevel={(id) => setView({ name: 'level', levelId: id })}
              onOpenLeaderboard={() => setView({ name: 'leaderboard' })}
            />
          )}

          {!onboarding && view.name === 'level' && (
            <>
              <LevelScreen
                levelId={view.levelId}
                onExit={() => go({ name: 'home' })}
                onComplete={completeLevel}
              />
              {sheetLevel !== null && (
                <SuccessSheet
                  levelId={sheetLevel}
                  onClose={() => go({ name: 'home' })}
                  onLeaderboard={() => go({ name: 'leaderboard' })}
                  onShare={() => share(sheetLevel)}
                />
              )}
            </>
          )}

          {!onboarding && view.name === 'leaderboard' && (
            <LeaderboardScreen onBack={() => go({ name: 'home' })} xp={state.xp} />
          )}
        </div>
      </div>

      <button className="reset-btn" onClick={reset}>
        Reset demo
      </button>
    </div>
  )
}
