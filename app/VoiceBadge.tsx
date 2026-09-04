'use client'

import { useEffect, useState } from 'react'

type VoiceState = { online: boolean; since: string | null; known: boolean }

function duration(since: string): string {
  const mins = Math.floor((Date.now() - new Date(since).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  return hours < 24 ? `${hours}h ${mins % 60}m` : `${Math.floor(hours / 24)}d`
}

export default function VoiceBadge() {
  const [state, setState] = useState<VoiceState | null>(null)

  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      try {
        const res = await fetch('/api/voice')
        if (!cancelled) setState(await res.json())
      } catch {
        if (!cancelled) setState({ online: false, since: null, known: false })
      }
    }
    poll()
    const id = setInterval(poll, 15000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  // Render nothing until the first response, and nothing when the answer is unknown. A badge
  // that says "offline" because the VM is unreachable is worse than no badge — it is the same
  // pixels as a true answer.
  if (!state || !state.known || !state.online) return null

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-muted"
      title={state.since ? `In voice since ${new Date(state.since).toLocaleString()}` : undefined}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <span className="text-fg">in voice</span>
      {state.since && <span aria-hidden>·</span>}
      {state.since && <span>{duration(state.since)}</span>}
    </span>
  )
}
