# Using elfi

This guide details the basic concepts of *elfi* and it's usage.

## Basic concepts

*elfi* allows you to create a _store_ which holds the whole _state_ of your
application. The state is updated by dispatching functions that return a new
state based on the previous ones. Such functions are called _changes_, and they
should be pure functions (_i.e._ having no side effects).

If you are familiar with [Flux][flux] or [Redux][redux] this might sound
familiar to you, but it strives to remain simple by eliminating most of the
boilerplate that you would expect to find with them. There are no dispatchers,
no reducers, no actions and no action creators in *elfi*, only simple functions.

Finally, the store can accept _subscribers_ which are also functions and which
are called when a state change occurs.

## Creating a store

Creating your *elfi* store is done by importing `createStore` and calling it
with an initial state.

```js
import {createStore} from "elfi"

const store = createStore(1)
```

In the example above, the state of our application is a number. This is
perfectly valid and *elfi* enforces no specific type for the internal state of
the store.

You can query for the current state of the store using `getState`:

```js
store.getState() // => 1
```

## Dispatching changes

As mentioned previously, a _change_ is a function that returns a new state based
on the current state of the store.

Continuing our integer store example, we can write an `increment` change like
this:

```js
function increment(state) {
  return state + 1
}
```

Such a change can be dispatched using `store.dispatch`:

```js
store.dispatch(increment)
store.getState() // => 2
```

Any extraneous arguments passed to dispatched will be passed to the change as
well. This allows us to write and `add` change like this:

```js
function add(state, n) {
  return state + n
}

store.dispatch(add, 40)
store.getState() // => 42
```

## Listening for changes

You can add a subscriber by using `store.subscribe`. A subscriber is a function
that takes two arguments: the old state and the new state. All subscribers of
the store are called when a change occurs, and only if this change actually
modifies the internal state of the store.

```js
store.subscribe((oldState, newState) => console.log(newState))
store.dispatch(increment) // logs 43
store.dispatch(x => x) // does not log anything since state is unchanged
```

`store.subscribe` returns a function that can be used to stop listening for
changes:

```js
const unsubscribe = store.subscribe(mySubscriber)
// do things
unsubscribe()
```

## Middleware

Middleware is a thin layer that allows you to customize the behavior of the
store by hooking into the dispatching process.

A middleware is a function (again!) that takes at least 3 arguments:

- The next middleware function to call,
- The current store state,
- The change function that is being dispatched,
- And any extra arguments to pass to the change.

You define what middleware you want to use at store creation time. `createStore`
takes a second argument which is an array of middleware functions to use.

Here's an example of a simple logging middleware:

```js
function loggerMiddleware(next, oldState, change, ...args) {
  const newState = next(oldState, change, ...args)
  console.log(change.name, oldState, newState)
  return newState
}
```

Calling `next` chains to the next middleware piece, or to the internal
dispatching mechanism. You should always return a valid state in your middleware
or the internal state of your store will take the value of `undefined`.

[flux]: https://github.com/facebook/flux
[redux]: https://github.com/reactjs/redux
