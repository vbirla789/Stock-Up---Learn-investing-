# nocap

A gamified stock-market learning app for Indian teenagers, built 1:1 from the
Figma frames in [unBox benchmarking](https://www.figma.com/design/JpvY95AgPKTKtBjZy9hmQ3/unBox-benchmarking?node-id=76-3892).

Twelve levels take a 13–17 year old from *what is a share* to *starting a real
SIP*. No trading, no options, no F&O — the path ends in a guardian-approved
monthly SIP, which is the only real-money instrument a minor can legally hold.

## Run it

```bash
npm install
npm run dev      # http://localhost:5195
```

Desktop shows the screen inside a phone frame. On a phone (< 768px) it goes
full-bleed with no frame. Progress persists in `localStorage`; the **Reset demo**
button clears it.

## The flow

```
Home  →  Level (5 steps)  →  Success  →  Leaderboard
         signboard
         video card
         question ×3
```

- **Home** — 12 hex badges. Only the next level is tappable; finished ones carry
  a green tick, locked ones are dimmed with a padlock. Tapping a locked badge
  says which level to finish first rather than doing nothing.
- **Level** — two teaching cards then three questions. Answers are checked
  properly: correct turns green, wrong turns red *and shows the correct answer
  plus a one-line explanation*, then lets you retry the same question.
- **Success** — level badge, +100 XP, and how far to the next level.
- **Leaderboard** — podium plus a top-10, with you slotted in by XP. Rank is
  computed from XP against a fixed squad, so it genuinely climbs as you learn.

## Design decisions worth knowing

**No hearts or lives.** The whole product says you learn by being wrong. Hearts
punish wrong answers, so they would penalise exactly the mistakes the questions
are designed to surface — and they exist mainly to sell refills, which isn't in
scope. A wrong answer explains itself and you try again.

**The leaderboard ranks XP, never returns.** Points come from finishing levels.
Ranking teenagers on profit would teach that the boldest bet wins.

**The header carries two counters, not five.** Streak and XP, plus rank on the
right. Every other counter (gems, hearts, PRO) needs a system behind it that
this product doesn't have.

**The nudge strip shows one line, priority-ordered.** Streak at risk beats
progress-to-SIP. It always names exactly one action.

## Deliberate deviations from the Figma

| Figma | Here | Why |
|---|---|---|
| 5 placeholder options per question | 4 real options | Real questions rarely need five plausible answers; the layout is unchanged |
| "Option A / Option B…" | Real questions and answers | The quiz has to be answerable |
| All badges identical | Locked badges dimmed, done badges ticked | The brief requires sequential unlocking, which needs three visible states |
| "Rank 1 / Rank 999+ / 180 pts" | Named squad, points derived from XP | Placeholder ranks contradicted each other once XP was live |

Everything else — colours, spacing, type, the signboard, the hanging video card,
the correct/wrong states (`#32440e`/`#9ed62e` and `#520000`/`#b20101`), the
podium geometry — is taken from the frames.

## Structure

```
src/
  data/levels.js        12 levels — copy, questions, answers, explanations
  data/leaderboard.js   squad list + rank/board derivation
  components/Chrome.jsx status bar, home bar, background, buttons
  components/HexBadge   the gold hexagon, three states
  screens/              Home, Level, Success, Leaderboard
public/assets/          exported straight from Figma
```

Fonts are Nunito (product) and Geist (numerals), both from Google Fonts.
