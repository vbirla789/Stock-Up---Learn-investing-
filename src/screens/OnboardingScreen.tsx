import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar, HomeBar } from "../components/Chrome";

interface OnboardingScreenProps {
  /** Both the SKIP button and the pull past the last card land on the path. */
  onDone: () => void;
}

interface Slide {
  /** Headline split into runs so the green phrases can be marked up inline. */
  parts: { text: string; accent?: boolean }[];
  art: string;
  /**
   * Drawn size inside the fixed art box. The first two illustrations carry far
   * more ink than the others, so they sit smaller — the box itself does not
   * change, which is what keeps every card the same height.
   */
  artSize?: number;
}

const SLIDES: Slide[] = [
  {
    parts: [
      { text: "Owning a company " },
      { text: "starts at ₹100", accent: true },
      { text: ", not ₹1 crore." },
    ],
    art: "/assets/onb/step1.png",
    artSize: 223,
  },
  {
    parts: [
      { text: "Money compounds itself.", accent: true },
      { text: " You just wait." },
    ],
    art: "/assets/onb/step2.png",
    artSize: 192,
  },
  {
    parts: [
      { text: "Your first investment " },
      { text: "costs one Zomato order.", accent: true },
    ],
    art: "/assets/onb/step3.png",
  },
];

/** The art box every card reserves, whatever is drawn inside it. */
const ART_BOX = 268;

/** The intro counts as a slide, so the progress bar has five stops. */
const STOPS = SLIDES.length + 1;

/** The wordmark has no control, so it hands over on a timer. */
const SPLASH_MS = 1500;

/** How long the wordmark and the deck overlap while they cross over. */
const HANDOVER_MS = 340;

/** Slack when testing against the two scroll extremes. */
const EDGE = 8;

type Phase = "splash" | "crossing" | "deck";

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  // The middle phase is what makes the hand-off readable: both the wordmark and
  // the deck are mounted, so one can leave while the other arrives instead of
  // the wordmark simply vanishing.
  const [phase, setPhase] = useState<Phase>("splash");
  const [index, setIndex] = useState(0);
  const deck = useRef<HTMLDivElement>(null);
  const left = useRef(false);

  useEffect(() => {
    if (phase === "deck") return;
    const next = phase === "splash" ? "crossing" : "deck";
    const t = window.setTimeout(
      () => setPhase(next),
      phase === "splash" ? SPLASH_MS : HANDOVER_MS,
    );
    return () => window.clearTimeout(t);
  }, [phase]);

  // The snapped slide drives the progress bar. Pulling past the last card is
  // what ends onboarding — the chevrons never stop inviting it, so the gesture
  // that got you through the deck is the one that drops you on the path.
  const onScroll = useCallback(() => {
    const box = deck.current;
    if (!box || left.current) return;

    const slides = box.querySelectorAll<HTMLElement>(".onb-slide");
    if (slides.length < 2) return;

    const pitch = slides[1].offsetTop - slides[0].offsetTop;
    const top = box.scrollTop;
    const lastCard = pitch * (STOPS - 1);
    const end = box.scrollHeight - box.clientHeight;

    setIndex(Math.min(STOPS - 1, Math.max(0, Math.round(top / pitch))));

    // The tail past the last card is its own snap point, so landing on it is
    // a deliberate flick rather than a bounce.
    if (top > lastCard + EDGE && top >= end - EDGE) {
      left.current = true;
      onDone();
    }
  }, [onDone]);

  return (
    <div className="light-screen onb">
      <div className="dot-grid" />
      <StatusBar />

      <div className="onb-stage">
        {phase !== "deck" && (
          <div
            className={
              phase === "crossing" ? "onb-splash is-leaving" : "onb-splash"
            }
          >
            <h1>Stock up</h1>
            <p>The stock market, explained for teenagers.</p>
          </div>
        )}

        {phase !== "splash" && (
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
                  {/* the mark and its label are one unit, tighter than the
                      gap that separates them from the copy */}
                  <div className="onb-intro-mark">
                    <img
                      className="onb-mark"
                      src="/assets/onb/icon-graph.svg"
                      alt=""
                      width={36}
                      height={36}
                    />
                    <p className="onb-eyebrow">BEFORE YOU START</p>
                  </div>
                  <div className="onb-intro-copy">
                    <h1>Investing is way simpler than it sounds.</h1>
                    <p>
                      Four things nobody explains.
                      <br />
                      30 seconds. Swipe up.
                    </p>
                  </div>
                </div>
                <Chevrons />
              </section>

              {SLIDES.map((slide, i) => (
                <section className="onb-slide" key={i}>
                  <div className="onb-card">
                    {/* same cell grid the success sheet uses, radially masked */}
                    <div className="cell-grid" />
                    <span className="onb-art">
                      <img
                        src={slide.art}
                        alt=""
                        style={{
                          width: `${((slide.artSize ?? ART_BOX) / ART_BOX) * 100}%`,
                        }}
                      />
                    </span>
                    <h2>
                      {slide.parts.map((part, k) => (
                        <span
                          key={k}
                          className={part.accent ? "is-accent" : undefined}
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
      </div>

      <HomeBar />
    </div>
  );
}

// Three carets bobbing in sequence — the only thing telling you the deck
// moves, since there is no button anywhere on it.
function Chevrons() {
  return (
    <span className="onb-chevrons" aria-hidden="true">
      <img
        src="/assets/lesson/icon-back.svg"
        alt=""
        width={11.25}
        height={6.25}
      />
      <img
        src="/assets/lesson/icon-back.svg"
        alt=""
        width={11.25}
        height={6.25}
      />
      <img
        src="/assets/lesson/icon-back.svg"
        alt=""
        width={11.25}
        height={6.25}
      />
    </span>
  );
}
