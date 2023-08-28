
const events: Map<Function, NodeJS.Timer> = new Map<Function, NodeJS.Timer>()
const eventsN: Map<string, Function> = new Map<string, Function>()

export function debounce(fn: Function, ms: number = 44) {

  events.has(fn) ? clearTimeout(events.get(fn)) : null

  events.set(fn, setTimeout(() => {
    fn()
    events.delete(fn)
  }, ms))
}

export function debounceByName(name: string, fn: Function, ms: number = 44) {
  
  let realFn: Function = fn

  if (eventsN.has(name)) {
    clearTimeout(events.get(eventsN.get(name) as Function))
    realFn = eventsN.get(name)!
  } else {
    eventsN.set(name, realFn)
  }

  events.set(realFn, setTimeout(() => {
    realFn()
    events.delete(realFn)
    eventsN.delete(name)
  }, ms))
}