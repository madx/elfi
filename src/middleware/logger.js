const DEFAULT_LOGGER = function defaultLogger({ oldState, newState, change }) {
  console.log(change.name, oldState, newState)
}

export default function createLoggerMiddleware(logger = DEFAULT_LOGGER) {
  return function loggerMiddleware(next, oldState, change, ...args) {
    const newState = next(oldState, change, ...args)
    logger({ oldState, newState, change, args })
    return newState
  }
}
