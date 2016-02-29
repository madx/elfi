export function createStore(initialState) {
  let state = initialState
  const subscribers = new Set()

  return {
    getState() {
      return state
    },

    dispatch(action, ...args) {
      if (typeof action !== "function") {
        throw new Error("action must be a function")
      }

      const oldState = state
      state = action(state, ...args)

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
