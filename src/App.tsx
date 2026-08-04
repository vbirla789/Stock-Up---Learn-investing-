import { useEffect, useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import LevelScreen from './screens/LevelScreen'
import SuccessSheet from './screens/SuccessSheet'
import LeaderboardScreen from './screens/LeaderboardScreen'
import { XP_PER_LEVEL } from './data/levels'
import { rankFor } from './data/leaderboard'
import navigate from './lib/navigate'
import type { Progress, View } from './types'

const KEY = 'nocap-progress-v1'

// Level 1 always starts cleared, so anyone opening the app sees a done stone,
// a current stone and the locked climb above — the three states at once rather
// than an untouched path. The 100 XP is that one level's worth.
const FLOOR = 1

const initial: Progress = {
  completed: FLOOR,
  xp: 100,
  streak: 5,
  doneToday: false,
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    const saved = { ...initial, ...(JSON.parse(raw) as Partial<Progress>) }
    // a floor, not a default — it also lifts anyone holding older saved state
    return { ...saved, completed: Math.max(FLOOR, saved.completed) }
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
  // This is a walkthrough, not a product install: onboarding plays on every
  // load so the pitch is always the first thing anyone sees. `runId` bumps on
  // reset so replaying it remounts the screen and the animation starts over.
  const [onboarding, setOnboarding] = useState(true)
  const [runId, setRunId] = useState(0)

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

  // Home is the root of the map, so anything heading back to it reads as a
  // reverse move; everything else pushes forward.
  function go(next: View) {
    navigate(
      () => {
        setSheetLevel(null)
        setView(next)
      },
      next.name === 'home' ? 'back' : 'forward',
    )
  }

  // Onboarding hands over to the path, not to a lesson — the climb is the
  // thing the four cards were arguing for, so it should be what you land on.
  // 'up' so the path rises the way the deck was being pulled.
  function finishOnboarding() {
    navigate(() => {
      setOnboarding(false)
      setView({ name: 'home' })
    }, 'up')
  }

  function reset() {
    navigate(() => {
      setState(initial)
      setOnboarding(true)
      setRunId((n) => n + 1)
      setSheetLevel(null)
      setView({ name: 'home' })
    }, 'back')
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
              onOpenLevel={(id) => go({ name: 'level', levelId: id })}
              onOpenLeaderboard={() => go({ name: 'leaderboard' })}
            />
          )}

          {!onboarding && view.name === 'level' && (
            <>
              <LevelScreen
                levelId={view.levelId}
                streak={state.streak}
                xp={state.xp}
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
