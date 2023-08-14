
const events: Map<Function, NodeJS.Timeout> = new Map<Function, NodeJS.Timeout>()

export default function debounce(fn: Function, ms: number = 44) {

  events.has(fn) ? clearTimeout(events.get(fn)) : null

  events.set(fn, setTimeout(() => {
    fn()
    events.delete(fn)
  }, ms))
}