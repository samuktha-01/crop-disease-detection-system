// ── services/history.js ──
// Saves and retrieves diagnosis history from localStorage

const KEY = 'krishidoc_history'

export function saveToHistory({ imageDataUrl, result, meta }) {
  const existing = getHistory()
  const entry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    imageDataUrl,
    result,
    meta, // { crop, stage, region, budget }
  }
  const updated = [entry, ...existing].slice(0, 50) // keep last 50
  localStorage.setItem(KEY, JSON.stringify(updated))
  return entry
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function deleteEntry(id) {
  const updated = getHistory().filter(e => e.id !== id)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
