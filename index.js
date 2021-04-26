export class RateLimiter {
  constructor (config) {
    this.window = config?.window || 1e3
    this.limit = config?.limit || 100
    this.entries = {}
  }

  getCurrentWindow () {
    let now = Math.ceil(Date.now())
    let offset = now % this.window
    return [(now - offset), offset]
  }

  hit (id) {
    const [curWindow, offset] = this.getCurrentWindow()
    let entry = this.entries[id]
    if (!entry) {
      entry = this.entries[id] = {
        window: curWindow,
        prevHits: 0,
        hits: 0
      }
    }
    if (entry.window !== curWindow) {
      let immediatelyPrecedingWindow = curWindow - this.window
      entry.prevHits = entry.window === immediatelyPrecedingWindow ? entry.hits : 0
      entry.window = curWindow
      entry.hits = 0
    }

    const weight = offset / this.window
    const hits = Math.round(entry.hits + (entry.prevHits * (1 - weight)))
    if (hits >= this.limit) {
      return false
    }
    entry.hits++
    return true
  }
}

