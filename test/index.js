import { createStore } from "../src"
import test from "tape"

function nextState(store) {
  return store.dispatch(() => store.getState() + 1)
}

test("createStore", t => {
  const initialState = {}
  const store = createStore(initialState)

  t.ok(store.getState() === initialState,
    "creates a store with an initial state")

  t.throws(() => createStore(),
    /missing initial state/i,
    "the initial state is mandatory")

  t.end()
})

test("subscribe", t => {
  const store = createStore(1)
  t.plan(3)

  const unsubscribe = store.subscribe(() => {
    t.pass("adds a subscriber to be called upon dispatch")
  })
  nextState(store)

  unsubscribe()
  nextState(store)
  t.pass("returns a function that can be used to stop subscribing")

  const subscriber = () => t.pass("ignores duplicate subscribers")
  store.subscribe(subscriber)
  store.subscribe(subscriber)
  nextState(store)
})

test("dispatch", t => {
  const store = createStore(1)

  nextState(store)
  t.equal(2, store.getState(),
    "updates the state with the result of the dispatched change")

  store.dispatch(s => s - 1)
  t.equal(1, store.getState(),
    "passes the current state to the dispatched change")

  store.dispatch((s, i) => s + i, 1)
  t.equal(2, store.getState(),
    "passes extra arguments to the dispatched change")

  store.subscribe((newState, oldState) => {
    t.pass("notifies subscribers if the state changes")
    t.equal(3, newState, "passes the new to the subscriber")
    t.equal(2, oldState, "passes the old state to the subscriber")
  })
  nextState(store)

  store.subscribe(() => {
    t.fail("does not notifies subscribers if the state does not change")
  })
  store.dispatch(s => s)

  t.end()
})

test("middleware", t => {
  t.plan(4)

  const setStateTo2 = () => 2
  const changeArg = "some argument"
  const middleware = (next, state, change, ...args) => {
    t.pass("is called when a change is dispatched")
    t.equal(state, store.getState(),
      "is passed the store state")
    t.equal(change, setStateTo2,
      "is passed the dispatched change")
    t.equal(args[0], changeArg,
      "is passed the dispatched change arguments")

    return next(state, change, ...args)
  }

  const store = createStore(1, [ middleware ])
  store.dispatch(setStateTo2, changeArg)
})
