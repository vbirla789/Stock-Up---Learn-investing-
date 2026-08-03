import { useState } from 'react'
import { StatusBar, HomeBar } from '../components/Chrome'
import VideoOverlay from '../components/VideoOverlay'
import levels from '../data/levels'
import type { Level } from '../types'

/** The explainer that plays behind every video card in the demo. */
const LESSON_VIDEO_ID = '9yqfiQy0Xjw'

interface LevelScreenProps {
  levelId: number
  streak: number
  xp: number
  onExit: () => void
  onComplete: (id: number) => void
}

// A level is five steps: a signboard, a video card, then three questions.
// Wrong answers explain themselves and let you retry — there are no lives,
// because being wrong is the point of the exercise.

export default function LevelScreen({
  levelId,
  streak,
  xp,
  onExit,
  onComplete,
}: LevelScreenProps) {
  // levelId always comes from the path, so this lookup can't miss
  const level = levels.find((l) => l.id === levelId) as Level
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [playing, setPlaying] = useState(false)

  const step = level.steps[index]
  const total = level.steps.length
  const quiz = step.type === 'quiz' ? step : null
  const correct = quiz !== null && picked === quiz.answer

  // Back leaves the level rather than rewinding a step — you never want to
  // re-answer a question you have already cleared to get out.
  function back() {
    onExit()
  }

  function advance() {
    if (quiz !== null && !checked) {
      setChecked(true)
      return
    }
    if (quiz !== null && checked && !correct) {
      // try again on the same question
      setPicked(null)
      setChecked(false)
      return
    }
    if (index + 1 < total) {
      setIndex(index + 1)
      setPicked(null)
      setChecked(false)
    } else {
      onComplete(level.id)
    }
  }

  const label =
    quiz === null
      ? 'Next'
      : !checked
        ? 'Check'
        : correct
          ? index + 1 === total
            ? 'Finish'
            : 'Next'
          : 'Try again'

  const disabled = quiz !== null && picked === null
  const remaining = total - index - 1

  return (
    <div className="light-screen lesson">
      <div className="dot-grid" />
      <StatusBar />

      <div className="lesson-body">
        <div className="lesson-head">
          <div className="lesson-head-row">
            <button className="icon-btn-light" onClick={back} aria-label="Back">
              <img
                src="/assets/lesson/icon-back.svg"
                alt=""
                width={11.25}
                height={6.25}
                style={{ transform: 'rotate(-90deg)' }}
              />
            </button>

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
          </div>

          {/* Cleared steps are stubs, the current one is a bar, and whatever
              is still ahead splits the leftover width between itself. */}
          <div className="steps">
            {Array.from({ length: index }, (_, i) => (
              <span className="steps-done" key={`d${i}`} />
            ))}
            <span className="steps-now" />
            {remaining > 0 && (
              <div className="steps-rest">
                {Array.from({ length: remaining }, (_, i) => (
                  <span key={`r${i}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {step.type === 'context' && (
          <div className="lesson-card" key={index}>
            <span className="lesson-chip">
              <img
                src="/assets/lesson/icon-book.svg"
                alt=""
                width={32}
                height={32}
              />
            </span>
            <div className="lesson-copy">
              <h1>
                {step.lead}
                {step.accent}
              </h1>
              <p>{step.body}</p>
            </div>
          </div>
        )}

        {step.type === 'video' && (
          <div className="lesson-card is-video" key={index}>
            <button
              className="video-thumb"
              onClick={() => setPlaying(true)}
              aria-label="Play the lesson video"
            >
              <img src="/assets/lesson/video-thumb.png" alt="" />
              <span className="video-play">
                <img
                  src="/assets/lesson/icon-play.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
            </button>
            <p className="video-caption">{step.caption}</p>
          </div>
        )}

        {quiz !== null && (
          <div className="quiz" key={index}>
            <h1>
              {quiz.lead}
              {quiz.accent}
            </h1>
            <div className="quiz-options">
              {quiz.options.map((option, i) => {
                let cls = 'quiz-option'
                if (!checked && picked === i) cls += ' is-picked'
                if (checked && i === quiz.answer) cls += ' is-correct'
                if (checked && picked === i && i !== quiz.answer)
                  cls += ' is-wrong'
                return (
                  <button
                    key={i}
                    className={cls}
                    disabled={checked}
                    onClick={() => setPicked(i)}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {checked && (
              <div className={`quiz-why ${correct ? 'ok' : 'no'}`}>
                {correct ? '' : 'Not quite. '}
                {quiz.why}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lesson-footer">
        <button className="btn-pill" onClick={advance} disabled={disabled}>
          {label}
        </button>
      </div>

      <HomeBar />

      {playing && (
        <VideoOverlay
          videoId={LESSON_VIDEO_ID}
          onClose={() => setPlaying(false)}
        />
      )}
    </div>
  )
}
