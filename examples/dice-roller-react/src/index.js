import React from "react"
import ReactDOM from "react-dom"
import {createStore} from "elfi"
import createLoggerMiddleware from "elfi/middleware/logger"
import {storeShape, Provider} from "elfi/react"
import {Record, List} from "immutable"

// Data types and constants
const DICE = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]

const AppState = Record({
  diceCount: 1,
  roll: List.of(d6())
}, "AppState")

function d6() {
  return DICE[~~(Math.random() * 6)]
}

// Changes
const changes = {
  addDie(state, newDie) {
    if (state.diceCount === 6) {
      return state
    }

    return state
      .set("diceCount", state.diceCount + 1)
      .update("roll", r => r.push(newDie))
  },

  removeDie(state) {
    if (state.diceCount === 1) {
      return state
    }

    return state
      .set("diceCount", state.diceCount - 1)
      .update("roll", r => r.pop())
  },

  updateRoll(state, roll) {
    return state.set("roll", new List(roll))
  },
}

// React App
function App(_, context) {
  const store = context.store
  const state = store.getState()

  function removeDie() {
    store.dispatch(changes.removeDie)
  }

  function rollDice() {
    const diceCount = state.diceCount
    const roll = Array.from({length: diceCount}, () => d6())

    store.dispatch(changes.updateRoll, roll)
  }

  function addDie() {
    store.dispatch(changes.addDie, d6())
  }

  return (
    <div className="App">
      <div className="Dice">
        {state.roll.join(" ")}
      </div>
      <div className="Buttons">
        <button onClick={removeDie}>-</button>
        <button onClick={rollDice} data-action="roll-dice">ROLL</button>
        <button onClick={addDie}>+</button>
      </div>
    </div>
  )
}
App.contextTypes = {
  store: storeShape
}


// Initialize application state
const logger = createLoggerMiddleware(({change, oldState, newState}) => {
  console.log(change.name, ":", oldState.toJS(), "=>", newState.toJS())
})
const initialState = new AppState()
const store = createStore(initialState, [logger])

// Bootstrap
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app-root")
)
