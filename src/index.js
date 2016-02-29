export function createStore (initialState) {
  let state = initialState
  const subscribers = []

  return {
    getState () {
      return state
    },

    dispatch (action, ...args) {
      if (typeof action !== 'function') {
        throw new Error('action must be a function')
      }

      const oldState = state
      state = action(state, ...args)

      if (state === oldState) {
        return
      }

      for (const subscriber of subscribers) {
        subscriber(state, oldState)
      }
    },

    subscribe (subscriber) {
      subscribers.push(subscriber)

      return function unsubscribe () {
        const index = subscribers.indexOf(subscriber)

        if (index >= 0) {
          subscribers.splice(index, 1)
        }
      }
    }
  }
}
