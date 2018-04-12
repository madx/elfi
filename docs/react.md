---
layout: page
title: React bindings
---

# React bindings

*elfi* ships with some React bindings so you can quickly start working on an
application using both of them. They are available in the `elfi/react` module.

## `storeShape`

The `storeShape` object allows you to specify that a property or a context
element of a component should behave like a store, which means it has the
`dispatch`, `getState` and `subscribe` methods available.

```js
import {storeShape} from "elfi/react"

function Counter(props, context) {
  const store = props.store

  return <div>{store.getState()}</div>
}

MyComponent.propTypes = {
  store: storeShape.isRequired,
}
```

## `Provider`

The `Provider` is used as a container component that will trigger renders of its
children every time the store is updated. It also passes the `store` to its
children through context.

```js
// Root.js
function Root(props) {
  return (
    <Provider store={props.store}>
      <App />
    </Provider>
  )
}

// App.js
function App(props, context) {
  // App has access to the store through context
  const store = context.store

  function increment(s) {
    return s + 1
  }

  function onClick() {
    store.dispatch(increment)
  }

  return (
    <div>
      <span>{store.getState()}</span>
      <button onClick={onClick}>Increment</button>
    </div>
  )
}

App.contextTypes = {
  store: storeShape.isRequired
}
```

## `HoC`


```javascript
import React from "react"
import PropTypes from "prop-types"
import { storeShape } from "elfi/react"

const connect = WrappedComponent => {
  return class extends React.Component {
    static contextTypes = {
      store: storeShape.isRequired,
    }

    render() {
      return <WrappedComponent {...this.props} store={this.context.store} storeState={this.context.store.getState()} />
    }
  }
}

export default connect
```

How to use it:

```javascript
const connectedComponent = connect(Component)
```
