// The squad board. Everyone is ranked on XP earned from finishing levels —
// never on returns — so the board rewards showing up, not gambling.
// Your own rank is derived from your XP against this list, which is why it
// climbs as you work through the path.

import type { Board, Entry, Rival, Row, Tier } from '../types'

const rivals: Rival[] = [
  { name: 'Ishita', points: 1500, avatar: '/assets/avatar-1.png' },
  { name: 'Aarav', points: 1430, avatar: '/assets/avatar-2.png' },
  { name: 'Kabir', points: 1380, avatar: '/assets/avatar-3.png' },
  { name: 'Meera', points: 1330 },
  { name: 'Rohan', points: 1290 },
  { name: 'Diya', points: 1250 },
  { name: 'Vihaan', points: 1210 },
  { name: 'Anaya', points: 1170 },
  { name: 'Arjun', points: 1130 },
  { name: 'Saanvi', points: 1090 },
  { name: 'Reyansh', points: 1050 },
  { name: 'Aadhya', points: 1010 },
  { name: 'Krish', points: 970 },
  { name: 'Myra', points: 930 },
  { name: 'Ayaan', points: 890 },
  { name: 'Kiara', points: 850 },
  { name: 'Dhruv', points: 810 },
  { name: 'Navya', points: 770 },
  { name: 'Ved', points: 730 },
  { name: 'Riya', points: 690 },
  { name: 'Yash', points: 650 },
  { name: 'Tara', points: 610 },
  { name: 'Nikhil', points: 560 },
  { name: 'Zara', points: 470 },
  { name: 'Om', points: 380 },
  { name: 'Sara', points: 270 },
  { name: 'Rudra', points: 160 },
  { name: 'Ira', points: 92 },
  { name: 'Advik', points: 80 },
  { name: 'Nia', points: 66 },
  { name: 'Kabir S', points: 48 },
  { name: 'Aria', points: 30 },
]

export function rankFor(xp: number): number {
  return rivals.filter((r) => r.points > xp).length + 1
}

function tierFor(entry: Entry): Tier {
  if (entry.isYou) return 'grey'
  return entry.rank <= 3 ? 'gold' : 'blue'
}

/** Merged board with you slotted in by XP. */
export function boardFor(xp: number): Board {
  const all: Entry[] = [...rivals, { name: 'You', points: xp, isYou: true }]
    .sort((a, b) => b.points - a.points)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  const top = all.slice(0, 10)
  // the synthetic 'You' entry is always present, so this can't miss
  const you = all.find((e) => e.isYou)!
  const listed = top.some((e) => e.isYou) ? top : [...top, you]
  const rows: Row[] = listed.map((e) => ({ ...e, tier: tierFor(e) }))

  return {
    podium: [all[1], all[0], all[2]], // rendered left, centre, right
    rows,
    you,
  }
}
