import {createStore} from "elfi"
import createLoggerMiddleware from "elfi/middleware/logger"
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

// UI elements
const ui = {
  dice: document.querySelector(".Dice"),
  rollBtn: document.querySelector("button[data-action=\"roll-dice\"]"),
  addDieBtn: document.querySelector("button[data-action=\"add-die\"]"),
  removeDieBtn: document.querySelector("button[data-action=\"remove-die\"]"),
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

// Helper function to perform a roll. The random generation must be done
// *outside* of a change since it is not a pure action
function rollDice(store) {
  const diceCount = store.getState().diceCount
  const roll = Array.from({length: diceCount}, () => d6())

  store.dispatch(changes.updateRoll, roll)
}

// Initialize application state
const logger = createLoggerMiddleware(({change, oldState, newState}) => {
  console.log(change.name, ":", oldState.toJS(), "=>", newState.toJS())
})
const initialState = new AppState()
const store = createStore(initialState, [logger])

// Handle store updates
store.subscribe(state => {
  ui.dice.textContent = state.roll.join(" ")
})

// Bind actions to buttons
ui.addDieBtn.addEventListener("click", (ev) => {
  ev.preventDefault()
  store.dispatch(changes.addDie, d6())
})

ui.removeDieBtn.addEventListener("click", (ev) => {
  ev.preventDefault()
  store.dispatch(changes.removeDie)
})

ui.rollBtn.addEventListener("click", (ev) => {
  ev.preventDefault()
  rollDice(store)
})

// Bootstrap
rollDice(store)

