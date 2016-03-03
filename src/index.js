export function createStore(initialState, middleware = []) {
  if (!initialState) {
    throw new Error("Missing initial state in store creation")
  }
  let state = initialState
  const subscribers = new Set()

  middleware.push((next, state, change, ...args) => change(state, ...args))

  const middlewareChain = middleware.reduceRight((acc, mw) => {
    const next = acc[0]
    acc.unshift((state, change, ...args) => {
      return mw(next, state, change, ...args)
    })
    return acc
  }, [])[0]

  return {
    getState() {
      return state
    },

    dispatch(change, ...args) {
      if (typeof change !== "function") {
        throw new Error("change must be a function")
      }

      const oldState = state
      state = middlewareChain(state, change, ...args)

      if (state === oldState) {
        return
      }

      subscribers.forEach((subscriber) => subscriber(state, oldState))
    },

    subscribe(subscriber) {
      subscribers.add(subscriber)

      return function unsubscribe() {
        if (subscribers.has(subscriber)) {
          subscribers.delete(subscriber)
        }
      }
    },
  }
}
