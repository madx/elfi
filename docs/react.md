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

function Counter(props, context) {
  const store = props.store

  return <div>{store.getState()}</div>
}

MyComponent.propTypes = {
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

import App from "./components/App"

const store = createStore(0) // Our state is a simple integer
const root = document.getElementById("app-root")

document.addEventListener("DOMContentLoaded", renderApp)
store.subscribe(renderApp)

function renderApp() {
  ReactDOM.render(
    <ElfiContext.Provider value={store}>
      <App />
    </ElfiContext.Provider>,
    root,
  )
}
```

In order to simplify consumption of store data in your components, _elfi_ ships
with a `connect` _higher order component_ that does all the dirty work for you.
It takes a component as a first argument and an function that maps store data to
proops as a second argument.

Using the previous app bootstrap code, here's an example usage of the `connect`
HOC to build a component:

```js
// Counter.js
import React from "react"
import { connect } from "elfi/react"

function Counter({ value }) {
  return `Current value is ${value}`
}

export default connect(
  Counter,
  value => ({ value }),
)
```
