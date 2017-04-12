import test from "tape"

import { createStore } from "../../src"
import createVersioningMiddleware from "../../src/middleware/versioning"

test("createVersioningMiddleware()", t => {
  t.plan(3)
  const _change = s => Object.assign({}, s, { x: s.x + 1 })
  const store = createStore({ x: 0 }, [ createVersioningMiddleware() ])

  store.dispatch(_change)
  t.equal(store.getState().x, 1, "should correctly dispatch the change")
  t.equal(store.getState().version, 1, "should initialize the version")
  store.dispatch(_change)
  t.equal(store.getState().version, 2, "should update the version")
})
