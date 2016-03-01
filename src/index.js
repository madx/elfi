export function createStore(initialState) {
  if (!initialState) {
    throw new Error("Missing initial state in store creation")
  }
  let state = initialState
  const subscribers = new Set()

  return {
    getState() {
      return state
    },

    dispatch(change, ...args) {
      if (typeof change !== "function") {
        throw new Error("change must be a function")
      }

      const oldState = state
      state = change(state, ...args)

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
