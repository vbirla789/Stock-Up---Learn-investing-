import { useState } from 'react'
import {
  StatusBar,
  HomeBar,
  ScreenBg,
  PrimaryButton,
  BackButton,
} from '../components/Chrome'
import levels from '../data/levels'

// A level is five steps: a signboard, a video card, then three questions.
// Wrong answers explain themselves and let you retry — there are no lives,
// because being wrong is the point of the exercise.

export default function LevelScreen({ levelId, onExit, onComplete }) {
  const level = levels.find((l) => l.id === levelId)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [checked, setChecked] = useState(false)

  const step = level.steps[index]
  const total = level.steps.length
  const isQuiz = step.type === 'quiz'
  const correct = isQuiz && picked === step.answer

  function back() {
    if (index === 0) return onExit()
    setIndex(index - 1)
    setPicked(null)
    setChecked(false)
  }

  function advance() {
    if (isQuiz && !checked) {
      setChecked(true)
      return
    }
    if (isQuiz && checked && !correct) {
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

  const label = !isQuiz
    ? 'Next'
    : !checked
      ? 'Check'
      : correct
        ? index + 1 === total
          ? 'Finish'
          : 'Next'
        : 'Try again'

  const disabled = isQuiz && picked === null

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

          {isQuiz && (
            <div className="quiz">
              <h1>
                {step.lead}
                <em>{step.accent}</em>
              </h1>
              <div className="quiz-options">
                {step.options.map((option, i) => {
                  let cls = 'quiz-option'
                  if (!checked && picked === i) cls += ' is-picked'
                  if (checked && i === step.answer) cls += ' is-correct'
                  if (checked && picked === i && i !== step.answer)
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
                  {step.why}
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
