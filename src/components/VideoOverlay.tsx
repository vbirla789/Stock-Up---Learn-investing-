import { useEffect } from 'react'

interface VideoOverlayProps {
  videoId: string
  onClose: () => void
}

// Full-screen player over the lesson. Uses the nocookie host so the demo
// doesn't drop tracking cookies, and autoplays since the tap was the intent.
export default function VideoOverlay({ videoId, onClose }: VideoOverlayProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="video-overlay" onClick={onClose}>
      <button className="video-overlay-close" onClick={onClose} aria-label="Close video">
        <img src="/assets/icon-cross.svg" alt="" width={11.5} height={11.5} />
      </button>

      <div className="video-overlay-frame" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title="Lesson video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
