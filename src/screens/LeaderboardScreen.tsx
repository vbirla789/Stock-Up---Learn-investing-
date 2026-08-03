import { useState } from 'react'
import { StatusBar, HomeBar, BackButton, ScreenBg } from '../components/Chrome'
import { boardFor } from '../data/leaderboard'
import type { Tier } from '../types'

interface LeaderboardScreenProps {
  onBack: () => void
  xp: number
}

const badge: Record<Tier, string> = {
  gold: '/assets/badge-gold.svg',
  blue: '/assets/badge-blue.svg',
  grey: '/assets/badge-grey.svg',
}

// Podium geometry, all relative to the 335 x 268 podium frame. The blocks
// bottom out at exactly 268, so the frame is filled edge to edge.
const blocks = [
  {
    place: 2,
    left: 4,
    top: 168,
    h: 100,
    capTop: 151,
    capH: 17,
    cap: '/assets/podium-top-2.svg',
    fill: 'rgba(34, 197, 94, 0.8)',
    numTop: 16,
  },
  {
    place: 1,
    left: 116,
    top: 134,
    h: 134,
    capTop: 114,
    capH: 20,
    cap: '/assets/podium-top-1.svg',
    fill: '#22c55e',
    numTop: 23,
  },
  {
    place: 3,
    left: 228,
    top: 184,
    h: 84,
    capTop: 170,
    capH: 14,
    cap: '/assets/podium-top-3.svg',
    fill: 'rgba(34, 197, 94, 0.93)',
    numTop: 14,
  },
]

// podium[] arrives as [rank 2, rank 1, rank 3] — left, centre, right.
// The avatar art is transparent, so each sits on its own pastel disc.
const seats = [
  { place: 2, left: 24, top: 42, avatarBg: '#ffc0c5' },
  { place: 1, left: 137, top: 6, avatarBg: '#e1e4ea' },
  { place: 3, left: 248, top: 62, avatarBg: '#ffecc0' },
]

const fallbackAvatars = [
  '/assets/avatar-2.png',
  '/assets/avatar-1.png',
  '/assets/avatar-3.png',
]

export default function LeaderboardScreen({
  onBack,
  xp,
}: LeaderboardScreenProps) {
  const { podium, rows } = boardFor(xp)
  const [stuck, setStuck] = useState(false)

  return (
    <>
      <ScreenBg />

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
        onScroll={(e) => setStuck(e.currentTarget.scrollTop > 8)}
      >
        <div className="lb-content">
          <div className="lb-podium">
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
                  style={{ left: seat.left, top: seat.top }}
                >
                  <img
                    className="avatar"
                    src={person.avatar || fallbackAvatars[i]}
                    alt=""
                    style={{ background: seat.avatarBg }}
                  />
                  <span>{person.name}</span>
                  <span className="podium-points">{person.points}</span>
                </div>
              )
            })}
          </div>

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
                    <span className={row.isYou ? 'lb-row-label is-you' : 'lb-row-label'}>
                      {row.rank}. {row.isYou ? 'You' : row.name}
                    </span>
                    <span className="lb-row-points">{row.points}</span>
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
