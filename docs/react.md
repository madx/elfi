---
layout: page
title: React bindings
---

# React bindings

_elfi_ ships with some React bindings so you can quickly start working on an
application using both of them. They are available in the `elfi/react` module.

## `storeShape`

The `storeShape` object allows you to specify that a component's prop should be
a store, which means it has the `dispatch`, `getState` and `subscribe` methods
available.

```js
import { storeShape } from "elfi/react"

function Counter({ store }) {
  return <p>{store.getState()}</p>
}

Counter.propTypes = {
  store: storeShape.isRequired,
}
```

## `ElfiContext` and `connect`

_elfi_ ships with an integration for the official React Context API that's been
available since React 16.3.0. To use it, you must wrap your app in the context
provider `ElfiContext.Provider` and you can use `ElfiContext.Consumer` in your
child components to consume store data.

You'll also probably want to automatically trigger updates using the `subscribe`
method from the store. Here is a typical app startup code using _elfi/react_:

```js
// app.js
import React from "react"
import ReactDOM from "react-dom"
import { createStore } from "elfi"
import { ElfiContext } from "elfi/react"

import Counter from "./Counter"

const store = createStore(0) // Our state is a simple integer
const root = document.getElementById("app-root")

document.addEventListener("DOMContentLoaded", renderApp)
store.subscribe(renderApp)

function renderApp() {
  ReactDOM.render(
    <ElfiContext.Provider value={store}>
      <Counter />
    </ElfiContext.Provider>,
    root,
  )
}
```

In order to simplify consumption of store data in your components, _elfi_ ships
with a `connect` _higher order component_ that does all the dirty work for you.
It takes a component as a first argument and an function that maps store data to
props as a second argument. This mapping function takes the store state and the
store itself as arguments, and must return an object of props.

Using the previous app bootstrap code, here's an example usage of the `connect`
HOC to build a component:

```js
// Counter.js
import React from "react"
import { connect } from "elfi/react"

function Counter({ value }) {
  return <p>Current value is {value}</p>
}

export default connect(
  Counter,
  value => ({ value }),
)
```

## Dispatching actions from components

Dispatching actions from your React components is no different than using _elfi_
outside of the React environment. To continue on our counter example, here's how
you would increment the counter's value when clicking on it:

```js
// Counter.js
import React from "react"
import PropTypes from "prop-types"
import { storeShape, connect } from "elfi/react"

// Our increment action
function increment(state) {
  return state + 1
}

class Counter extends React.Component {
  static propTypes = {
    store: storeShape.isRequired,
    value: PropTypes.number.isRequired,
  }

  handleClick = () => {
    const { store } = this.props
    store.dispatch(increment)
  }

  render() {
    const { value } = this.props
    return <p onClick={this.handleClick}>Current value is {value}</p>
  }
}

export default connect(
  Counter,
  value => ({ value }),
)
```

You can [try this demo online](https://codepen.io/madx/pen/MBLvPg)
