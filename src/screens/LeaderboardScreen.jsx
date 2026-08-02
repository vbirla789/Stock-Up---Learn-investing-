import { useState } from 'react'
import { StatusBar, HomeBar, BackButton } from '../components/Chrome'
import { boardFor } from '../data/leaderboard'

const badge = {
  gold: '/assets/badge-gold.svg',
  blue: '/assets/badge-blue.svg',
  grey: '/assets/badge-grey.svg',
}

// Podium geometry lifted from the Figma frame so the blocks sit under the art.
const blocks = [
  {
    place: 2,
    left: 19,
    top: 289,
    h: 100,
    capTop: 272,
    capH: 17,
    cap: '/assets/podium-top-2.svg',
    fill: 'rgba(158,214,46,0.8)',
    numTop: 16,
  },
  {
    place: 1,
    left: 131,
    top: 255,
    h: 134,
    capTop: 235,
    capH: 20,
    cap: '/assets/podium-top-1.svg',
    fill: '#9ed62e',
    numTop: 23,
  },
  {
    place: 3,
    left: 243,
    top: 305,
    h: 84,
    capTop: 291,
    capH: 14,
    cap: '/assets/podium-top-3.svg',
    fill: 'rgba(158,214,46,0.93)',
    numTop: 14,
  },
]

const seats = [
  { place: 2, left: 'calc(50% - 108.1px)', top: 163 },
  { place: 1, left: 'calc(50% + 0.9px)', top: 125 },
  { place: 3, left: 'calc(50% + 107.9px)', top: 182 },
]

const fallbackAvatars = [
  '/assets/avatar-2.png',
  '/assets/avatar-1.png',
  '/assets/avatar-3.png',
]

export default function LeaderboardScreen({ onBack, xp }) {
  const { podium, rows } = boardFor(xp)
  const [stuck, setStuck] = useState(false)

  return (
    <>
      {/* Sits above the scroll layer so the list can never cover the back button */}
      <div className={`lb-header ${stuck ? 'is-stuck' : ''}`}>
        <StatusBar />
        <div className="lb-title-row">
          <BackButton onClick={onBack} />
          <span className="lb-title">Leaderboard</span>
        </div>
      </div>

      <div
        className="lb"
        onScroll={(e) => setStuck(e.currentTarget.scrollTop > 330)}
      >
        <div className="lb-top">
          <img className="podium-bg" src="/assets/podium-bg.svg" alt="" />

          {blocks.map((b) => (
            <div key={b.place}>
              <img
                className="podium-cap"
                src={b.cap}
                alt=""
                style={{ left: b.left, top: b.capTop, height: b.capH }}
              />
              <div
                className="podium-block"
                style={{
                  left: b.left,
                  top: b.top,
                  width: 112,
                  height: b.h,
                  background: b.fill,
                }}
              >
                <p style={{ marginTop: b.numTop }}>{b.place}</p>
              </div>
            </div>
          ))}

          {seats.map((seat, i) => {
            const person = podium[i]
            return (
              <div
                key={seat.place}
                className="podium-person"
                style={{
                  left: seat.left,
                  top: seat.top,
                  transform: 'translateX(-50%)',
                }}
              >
                <img
                  className="avatar"
                  src={person.avatar || fallbackAvatars[i]}
                  alt=""
                />
                <span>{person.name}</span>
                <span className="podium-points">{person.points}</span>
              </div>
            )
          })}

        </div>

        <div className="lb-list-wrap">
          <div className="lb-list">
            <div className="lb-list-head">
              <span>Rank</span>
              <span>Points</span>
            </div>
            <div className="lb-rows">
              {rows.map((row) => (
                <div
                  key={row.rank}
                  className={`lb-row ${row.tier === 'gold' ? 'gold' : ''} ${
                    row.isYou ? 'me' : ''
                  }`}
                >
                  <img src={badge[row.tier]} alt="" />
                  <div className="lb-row-body">
                    <span className="lb-row-label">
                      {row.rank}. {row.isYou ? 'You' : row.name}
                      {row.isYou && (
                        <span className="lb-you">
                          <img
                            src="/assets/icon-diamond.svg"
                            alt=""
                            width={4}
                            height={4}
                            style={{ transform: 'rotate(-45deg)' }}
                          />
                          YOU
                        </span>
                      )}
                    </span>
                    <span>{row.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HomeBar />
    </>
  )
}
