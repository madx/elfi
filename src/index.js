export function createStore(initialState, middleware = []) {
  if (!initialState) {
    throw new Error("Missing initial state in store creation")
  }
  let state = initialState
  const subscribers = new Set()

  // Final middleware, simply applies the change to the state
  middleware.push((next, state, change, ...args) => change(state, ...args))

  const updater = middleware.reduceRight((chain, mw) => {
    const next = chain[0]
    chain.unshift((state, change, ...args) => {
      return mw(next, state, change, ...args)
    })
    return chain
  }, []).shift()

  return {
    getState() {
      return state
    },

    dispatch(change, ...args) {
      if (typeof change !== "function") {
        throw new Error("change must be a function")
      }

      const oldState = state
      state = updater(state, change, ...args)

      if (state === oldState) {
        return
      }

      subscribers.forEach((subscriber) => subscriber(state, oldState))
    },

    subscribe(subscriber) {
      if (typeof subscriber !== "function") {
        throw new Error("subscriber must be a function")
      }

      subscribers.add(subscriber)

      return function unsubscribe() {
        if (subscribers.has(subscriber)) {
          subscribers.delete(subscriber)
        }
      }
    },
  }
}
