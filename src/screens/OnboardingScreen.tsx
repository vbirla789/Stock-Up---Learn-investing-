import { useEffect, useRef, useState } from 'react'
import { StatusBar, HomeBar, ScreenBg, PrimaryButton } from '../components/Chrome'

interface OnboardingScreenProps {
  onDone: () => void
}

const SPENT = 240000
const INVESTED = 465000
/** Tallest bar in px; the other is scaled off the same rupee-per-px. */
const MAX_BAR = 385

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
  const spent = useCountUp(SPENT, SPENT_DELAY, SPENT_DURATION)
  const invested = useCountUp(INVESTED, INVESTED_DELAY, INVESTED_DURATION)

  const spentHeight = Math.round((SPENT / INVESTED) * MAX_BAR)

  return (
    <>
      <ScreenBg />
      <StatusBar />

      <div className="onb">
        <h1 className="onb-title">Why you should learn investing?</h1>

        <div className="onb-chart">
          <div className="onb-col">
            <span
              className="onb-amount"
              style={{ animationDelay: `${SPENT_DELAY}ms` }}
            >
              ₹{inr.format(spent)} gone
            </span>
            <div
              className="onb-bar is-spent"
              style={
                {
                  '--bar-h': `${spentHeight}px`,
                  animationDelay: `${SPENT_DELAY}ms`,
                  animationDuration: `${SPENT_DURATION}ms`,
                } as React.CSSProperties
              }
            >
              <span>over 10 years</span>
            </div>
          </div>

          <div className="onb-col">
            <span
              className="onb-amount"
              style={{ animationDelay: `${INVESTED_DELAY}ms` }}
            >
              ₹{inr.format(invested)} yours
              <br />
              (~double)
            </span>
            <div
              className="onb-bar is-invested"
              style={
                {
                  '--bar-h': `${MAX_BAR}px`,
                  animationDelay: `${INVESTED_DELAY}ms`,
                  animationDuration: `${INVESTED_DURATION}ms`,
                } as React.CSSProperties
              }
            >
              <span>over 10 years</span>
            </div>
          </div>
        </div>

        <div className="onb-captions">
          <p style={{ animationDelay: '900ms' }}>₹2000 monthly zomato expense</p>
          <p style={{ animationDelay: '960ms' }}>Save that ₹2000 and start SIP</p>
        </div>
      </div>

      <div className="footer onb-footer">
        <PrimaryButton onClick={onDone}>Next</PrimaryButton>
      </div>

      <HomeBar />
    </>
  )
}
