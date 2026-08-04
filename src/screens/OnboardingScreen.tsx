import { useCallback, useEffect, useRef, useState } from 'react'
import { StatusBar, HomeBar } from '../components/Chrome'

interface OnboardingScreenProps {
  /** Both the SKIP button and the pull past the last card land on the path. */
  onDone: () => void
}

interface Slide {
  /** Headline split into runs so the green phrases can be marked up inline. */
  parts: { text: string; accent?: boolean }[]
  art: string
  /** The illustration's native ratio — each card sizes its own art box. */
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

/** The intro counts as a slide, so the progress bar has five stops. */
const STOPS = SLIDES.length + 1

/** The wordmark has no control, so it hands over on a timer. */
const SPLASH_MS = 1500

/** Slack when testing against the two scroll extremes. */
const EDGE = 8

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [showDeck, setShowDeck] = useState(false)
  const [index, setIndex] = useState(0)
  const deck = useRef<HTMLDivElement>(null)
  const left = useRef(false)

  useEffect(() => {
    const t = window.setTimeout(() => setShowDeck(true), SPLASH_MS)
    return () => window.clearTimeout(t)
  }, [])

  // The snapped slide drives the progress bar. Pulling past the last card is
  // what ends onboarding — the chevrons never stop inviting it, so the gesture
  // that got you through the deck is the one that drops you on the path.
  const onScroll = useCallback(() => {
    const box = deck.current
    if (!box || left.current) return

    const slides = box.querySelectorAll<HTMLElement>('.onb-slide')
    if (slides.length < 2) return

    const pitch = slides[1].offsetTop - slides[0].offsetTop
    const top = box.scrollTop
    const lastCard = pitch * (STOPS - 1)
    const end = box.scrollHeight - box.clientHeight

    setIndex(Math.min(STOPS - 1, Math.max(0, Math.round(top / pitch))))

    // The tail past the last card is its own snap point, so landing on it is
    // a deliberate flick rather than a bounce.
    if (top > lastCard + EDGE && top >= end - EDGE) {
      left.current = true
      onDone()
    }
  }, [onDone])

  return (
    <div className="light-screen onb">
      <div className="dot-grid" />
      <StatusBar />

      {!showDeck ? (
        <div className="onb-splash">
          <h1>Stock up</h1>
        </div>
      ) : (
        <>
          <div className="onb-head">
            <div className="onb-progress">
              <span style={{ width: `${((index + 1) / STOPS) * 100}%` }} />
            </div>
            <button className="onb-skip" onClick={onDone}>
              SKIP
            </button>
          </div>

          <div className="onb-deck" ref={deck} onScroll={onScroll}>
            <section className="onb-slide">
              <div className="onb-intro">
                <img
                  className="onb-mark"
                  src="/assets/onb/icon-graph.svg"
                  alt=""
                  width={36}
                  height={36}
                />
                <p className="onb-eyebrow">FIRST, THE WHY</p>
                <div className="onb-intro-copy">
                  <h1>You don’t need money to start. You need time.</h1>
                  <p>
                    The bits nobody explains,
                    <br />
                    in thirty seconds. Swipe up.
                  </p>
                </div>
              </div>
              <Chevrons />
            </section>

            {SLIDES.map((slide, i) => (
              <section className="onb-slide" key={i}>
                <div className="onb-card">
                  <img
                    src={slide.art}
                    alt=""
                    style={{ aspectRatio: slide.ratio }}
                  />
                  <h2>
                    {slide.parts.map((part, k) => (
                      <span
                        key={k}
                        className={part.accent ? 'is-accent' : undefined}
                      >
                        {part.text}
                      </span>
                    ))}
                  </h2>
                </div>
                <Chevrons />
              </section>
            ))}

            <div className="onb-tail" />
          </div>
        </>
      )}

      <HomeBar />
    </div>
  )
}

// Three carets bobbing in sequence — the only thing telling you the deck
// moves, since there is no button anywhere on it.
function Chevrons() {
  return (
    <span className="onb-chevrons" aria-hidden="true">
      <img src="/assets/lesson/icon-back.svg" alt="" width={11.25} height={6.25} />
      <img src="/assets/lesson/icon-back.svg" alt="" width={11.25} height={6.25} />
      <img src="/assets/lesson/icon-back.svg" alt="" width={11.25} height={6.25} />
    </span>
  )
}
