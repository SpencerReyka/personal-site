'use client'

import { useEffect, useState } from 'react'

type VoiceState = {
  online: boolean
  since: string | null
  lastSeen: string | null
  known: boolean
}

function ago(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'yesterday' : `${days}d ago`
}

function duration(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just joined'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  return `${hours}h ${mins % 60}m`
}

export default function VoiceStatus() {
  const [state, setState] = useState<VoiceState | null>(null)

  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      try {
        const res = await fetch('/api/voice')
        if (!cancelled) setState(await res.json())
      } catch {
        if (!cancelled) setState({ online: false, since: null, lastSeen: null, known: false })
      }
    }
    poll()
    const id = setInterval(poll, 15000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  // Render nothing at all until we know something. "Unknown" and "not in voice" are different
  // answers and this section refuses to render the first as the second — the collector only
  // recently went always-on, and a status line that is confidently wrong is worse than absent.
  if (!state || !state.known) return null
  if (!state.online && !state.lastSeen) return null

  return (
    <>
      <h2 className="section-heading">Now</h2>
      <p className="text-[0.875rem] text-[#aaa] flex items-center gap-2 flex-wrap">
        {state.online ? (
          <>
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-fg">In a voice channel</span>
            {state.since && <span className="text-muted">· {duration(state.since)}</span>}
          </>
        ) : (
          <>
            <span className="inline-flex h-2 w-2 rounded-full bg-border" aria-hidden />
            <span className="text-muted">
              Last in a voice channel {state.lastSeen ? ago(state.lastSeen) : ''}
            </span>
          </>
        )}
      </p>
      <p className="text-[0.75rem] text-muted mt-2">
        Live, via{' '}
        <a
          href="https://github.com/SpencerReyka/backbone"
          target="_blank"
          rel="noopener"
          className="text-accent hover:underline"
        >
          backbone
        </a>{' '}
        — a Discord collector emits an event, a subscriber writes the session, this polls it.
      </p>
    </>
  )
}
