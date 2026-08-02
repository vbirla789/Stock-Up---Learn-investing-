import { useState } from 'react'
import {
  StatusBar,
  HomeBar,
  ScreenBg,
  PrimaryButton,
  BackButton,
} from '../components/Chrome'
import levels from '../data/levels'
import type { Level } from '../types'

interface LevelScreenProps {
  levelId: number
  onExit: () => void
  onComplete: (id: number) => void
}

// A level is five steps: a signboard, a video card, then three questions.
// Wrong answers explain themselves and let you retry — there are no lives,
// because being wrong is the point of the exercise.

export default function LevelScreen({
  levelId,
  onExit,
  onComplete,
}: LevelScreenProps) {
  // levelId always comes from the home grid, so this lookup can't miss
  const level = levels.find((l) => l.id === levelId) as Level
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  const step = level.steps[index]
  const total = level.steps.length
  const quiz = step.type === 'quiz' ? step : null
  const correct = quiz !== null && picked === quiz.answer

  function back() {
    if (index === 0) return onExit()
    setIndex(index - 1)
    setPicked(null)
    setChecked(false)
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

  const label = quiz === null
    ? 'Next'
    : !checked
      ? 'Check'
      : correct
        ? index + 1 === total
          ? 'Finish'
          : 'Next'
        : 'Try again'

  const disabled = quiz !== null && picked === null

  return (
    <>
      <ScreenBg />
      <StatusBar />

      <div className="level-body">
        <div className="progress-row">
          <BackButton onClick={back} />
          <span className="progress-count">
            {index + 1}/{total}
          </span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="stage-area">
          {step.type === 'context' && (
            <div className="signboard-wrap">
              <div className="signboard" key={index}>
                <span className="signboard-icon">
                  <img
                    src="/assets/icon-book.svg"
                    alt=""
                    width={28}
                    height={28}
                  />
                </span>
                <h1>
                  {step.lead}
                  <em>{step.accent}</em>
                </h1>
                <p>{step.body}</p>
              </div>
              <div className="signboard-legs">
                <i />
                <i />
              </div>
            </div>
          )}

          {step.type === 'video' && (
            <div className="hang">
              <img className="hang-line" src="/assets/hang-line.svg" alt="" />
              <span className="hang-knot" />
              <div className="video-card" key={index}>
                <div className="video-thumb">
                  <img src="/assets/video-thumb.png" alt="" />
                  <span className="video-play">
                    <img
                      src="/assets/icon-play.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
                <p>{step.caption}</p>
              </div>
            </div>
          )}

          {quiz !== null && (
            <div className="quiz">
              <h1>
                {quiz.lead}
                <em>{quiz.accent}</em>
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
      </div>

      <div className="footer">
        <PrimaryButton onClick={advance} disabled={disabled}>
          {label}
        </PrimaryButton>
      </div>

      <HomeBar />
    </>
  )
}
