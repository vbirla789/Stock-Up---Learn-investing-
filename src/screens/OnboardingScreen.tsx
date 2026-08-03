import { useEffect, useRef, useState } from 'react'
import { StatusBar, HomeBar, ScreenBg, PrimaryButton } from '../components/Chrome'

interface OnboardingScreenProps {
  onDone: () => void
}

/**
 * ₹2,000 a month, compounded monthly at ~12.9% a year — the rate implied by
 * the frame's ₹4,65,000 at ten years. `spent` is simply what you handed over.
 */
const PERIODS = [
  { years: 20, spent: 480000, invested: 2027000, note: '(~4×)' },
  { years: 10, spent: 240000, invested: 465000, note: '(~double)' },
  { years: 5, spent: 120000, invested: 164000, note: '(~1.4×)' },
]
const DEFAULT_PERIOD = 1

/** Tallest bar in px; the grey one is scaled off the same rupee-per-px. */
const MAX_BAR = 328

const SPENT_DELAY = 150
const SPENT_DURATION = 700
const INVESTED_DELAY = 400
const INVESTED_DURATION = 900

const inr = new Intl.NumberFormat('en-IN')

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Counts 0 -> target on the same curve and clock as the bar it labels.
 * rAF gets throttled in background tabs, so a timer guarantees the final
 * value lands even if frames stop arriving.
 */
function useCountUp(target: number, delay: number, duration: number) {
  const [value, setValue] = useState(0)
  const frame = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    setValue(0)
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }

    const startTimer = window.setTimeout(() => {
      frame.current = requestAnimationFrame(tick)
    }, delay)
    const settleTimer = window.setTimeout(() => {
      if (frame.current) cancelAnimationFrame(frame.current)
      setValue(target)
    }, delay + duration + 80)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(settleTimer)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, delay, duration])

  return value
}

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [periodIndex, setPeriodIndex] = useState(DEFAULT_PERIOD)
  const period = PERIODS[periodIndex]

  const spent = useCountUp(period.spent, SPENT_DELAY, SPENT_DURATION)
  const invested = useCountUp(period.invested, INVESTED_DELAY, INVESTED_DURATION)

  const spentHeight = Math.round((period.spent / period.invested) * MAX_BAR)

  return (
    <>
      <ScreenBg />
      <StatusBar />

      <div className="onb">
        <h1 className="onb-title">Why you should learn investing?</h1>

        <div className="onb-toggle" role="tablist" aria-label="Time horizon">
          {PERIODS.map((p, i) => (
            <button
              key={p.years}
              role="tab"
              aria-selected={i === periodIndex}
              className={i === periodIndex ? 'is-active' : ''}
              onClick={() => setPeriodIndex(i)}
            >
              {p.years} years
            </button>
          ))}
        </div>

        <div className="onb-chart">
          <div className="onb-col">
            <span
              className="onb-amount"
              style={{ animationDelay: `${SPENT_DELAY}ms` }}
            >
              <b>₹{inr.format(spent)}</b> gone
            </span>
            <div
              /* key restarts the grow keyframe when the horizon changes */
              key={`spent-${period.years}`}
              className="onb-bar is-spent"
              style={
                {
                  '--bar-h': `${spentHeight}px`,
                  animationDelay: `${SPENT_DELAY}ms`,
                  animationDuration: `${SPENT_DURATION}ms`,
                } as React.CSSProperties
              }
            >
              <span>over {period.years} years</span>
            </div>
          </div>

          <div className="onb-col">
            <span
              className="onb-amount"
              style={{ animationDelay: `${INVESTED_DELAY}ms` }}
            >
              <b>₹{inr.format(invested)}</b> yours
              <br />
              {period.note}
            </span>
            <div
              key={`invested-${period.years}`}
              className="onb-bar is-invested"
              style={
                {
                  '--bar-h': `${MAX_BAR}px`,
                  animationDelay: `${INVESTED_DELAY}ms`,
                  animationDuration: `${INVESTED_DURATION}ms`,
                } as React.CSSProperties
              }
            >
              <span>over {period.years} years</span>
            </div>
          </div>
        </div>

        <div className="onb-captions">
          <p>₹2000 monthly zomato expense</p>
          <p>Save that ₹2000 and start SIP</p>
        </div>
      </div>

      <div className="footer onb-footer">
        <PrimaryButton onClick={onDone}>Next</PrimaryButton>
      </div>

      <HomeBar />
    </>
  )
}
