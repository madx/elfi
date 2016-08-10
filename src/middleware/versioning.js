const DEFAULT_SETTER = function setter(newState) {
  newState.version = (newState.version || 0) + 1
  return newState
}

export default function createVersioningMiddleware(setter = DEFAULT_SETTER) {
  return function versioningMiddleware(next, state, change, ...args) {
    let newState = next(state, change, ...args)

    if (newState !== state) {
      newState = setter(newState)
    }

    return newState
  }
}
