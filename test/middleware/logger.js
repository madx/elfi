import { createStore } from "../../src"
import createLoggerMiddleware from "../../src/middleware/logger"
import test from "tape"

test("createLoggerMiddleware(logger)", t => {
  t.plan(3)
  const _change = s => s + 1
  const logger = ({ oldState, newState, change }) => {
    t.equal(oldState, 1, "passes the new state to the logger function")
    t.equal(newState, 2, "passes the new state to the logger function")
    t.equal(change, _change, "passes the change to the logger function")
  }
  const store = createStore(1, [ createLoggerMiddleware(logger) ])

  store.dispatch(_change)
})
