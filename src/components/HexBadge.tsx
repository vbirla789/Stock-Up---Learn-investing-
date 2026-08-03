interface HexBadgeProps {
  number: number
}

// The celebration badge is six Figma layers in a 139.29 x 156 box: a radial
// burst, the green face, then the gold rim and gloss painted back over the
// number. Offsets are the frame's own, in px.
const UNDER = [
  { src: 'badge-1.svg', left: -31.98, top: -31.69, width: 203.207, height: 219.372 },
  { src: 'badge-2.svg', left: 2.28, top: 2.57, width: 134.684, height: 150.85 },
  { src: 'badge-3.svg', left: 2.28, top: 3.03, width: 134.686, height: 149.943 },
]

const OVER = [
  { src: 'badge-4.svg', left: 0, top: 0, width: 139.285, height: 155.997 },
  { src: 'badge-5.svg', left: -4.02, top: -2.01, width: 147.347, height: 164.061 },
  { src: 'badge-6.svg', left: -0.33, top: -0.65, width: 139.952, height: 98.9435 },
]

export default function HexBadge({ number }: HexBadgeProps) {
  return (
    <span className="hex">
      {UNDER.map((l) => (
        <img key={l.src} src={`/assets/success/${l.src}`} alt="" style={l} />
      ))}

      <span className="hex-text">
        <span className="hex-label">Level</span>
        <span className="hex-num">{number}</span>
      </span>

      {OVER.map((l) => (
        <img key={l.src} src={`/assets/success/${l.src}`} alt="" style={l} />
      ))}
    </span>
  )
}
