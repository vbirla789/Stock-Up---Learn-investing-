import { useEffect, useState } from 'react'
import { StatusBar, HomeBar } from '../components/Chrome'

interface OnboardingScreenProps {
  onDone: () => void
}

interface Slide {
  /** Headline split into runs so the green phrases can be marked up inline. */
  parts: { text: string; accent?: boolean }[]
  art: string
  /** The illustration's native ratio — each frame sizes its own art box. */
  ratio: string
}

const SLIDES: Slide[] = [
  {
    parts: [
      { text: 'Owning a company ' },
      { text: 'starts at ₹100', accent: true },
      { text: ', not ₹1 crore.' },
    ],
    art: '/assets/onb/step1.png',
    ratio: '532 / 508',
  },
  {
    parts: [
      { text: 'Money compounds itself.', accent: true },
      { text: ' You just wait.' },
    ],
    art: '/assets/onb/step2.png',
    ratio: '736 / 820',
  },
  {
    parts: [
      { text: 'Your first investment ' },
      { text: 'costs one Zomato order.', accent: true },
    ],
    art: '/assets/onb/step3.png',
    ratio: '760 / 790',
  },
  {
    parts: [
      { text: 'Invest now to be ' },
      { text: '15 years ahead', accent: true },
      { text: ' of most people.' },
    ],
    art: '/assets/onb/step4.png',
    ratio: '660 / 788',
  },
]

/** The wordmark frame has no button, so it hands over on a timer. */
const SPLASH_MS = 1500

const SPLASH = -1

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState(SPLASH)

  useEffect(() => {
    if (step !== SPLASH) return
    const t = window.setTimeout(() => setStep(0), SPLASH_MS)
    return () => window.clearTimeout(t)
  }, [step])

  const slide = SLIDES[step]

  return (
    <div className="onb">
      <div className="onb-dots" />
      <StatusBar />

      {step === SPLASH ? (
        <div className="onb-splash">
          <h1>Stock up</h1>
        </div>
      ) : (
        <div className="onb-body">
          <div className="onb-head">
            {/* The track stays mounted across steps so the fill can slide. */}
            <div className="onb-progress">
              <span
                style={{ width: `${((step + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
            <h1 className="onb-title" key={`title-${step}`}>
              {slide.parts.map((part, i) => (
                <span key={i} className={part.accent ? 'is-accent' : undefined}>
                  {part.text}
                </span>
              ))}
            </h1>
          </div>

          <img
            className="onb-art"
            key={`art-${step}`}
            src={slide.art}
            alt=""
            style={{ aspectRatio: slide.ratio }}
          />

          <button
            className="onb-next"
            onClick={() =>
              step === SLIDES.length - 1 ? onDone() : setStep(step + 1)
            }
          >
            Next
          </button>
        </div>
      )}

      <HomeBar />
    </div>
  )
}
