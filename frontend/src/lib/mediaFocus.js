// Tracks which project is most visible on screen, and whether the visitor
// wants sound. Shared by every ProjectCard so only one video is ever
// "active" (and allowed to play with sound) at a time.

const visibility = new Map() // projectId -> how much of its media is on screen (0 to 1)
const listeners = new Set()

// Sound is wanted by default; the browser decides whether it actually allows it.
let state = { activeId: null, soundOn: true }

const MIN_VISIBLE = 0.4

function pickActive() {
  let best = null
  let bestRatio = MIN_VISIBLE
  visibility.forEach((ratio, id) => {
    if (ratio > bestRatio) {
      best = id
      bestRatio = ratio
    }
  })
  return best
}

function update(patch) {
  const next = { ...state, ...patch }
  if (next.activeId === state.activeId && next.soundOn === state.soundOn) return
  state = next
  listeners.forEach((listener) => listener())
}

export function reportVisibility(id, ratio) {
  if (ratio > 0) visibility.set(id, ratio)
  else visibility.delete(id)
  update({ activeId: pickActive() })
}

export function forgetProject(id) {
  visibility.delete(id)
  update({ activeId: pickActive() })
}

export function setSoundOn(soundOn) {
  update({ soundOn })
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot() {
  return state
}