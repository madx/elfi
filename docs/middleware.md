---
layout: page
title: Built-in middleware
---

# Built-in middleware

*elfi* provides some builtin middleware. You'll find documentation about them in
this document.

## logger ([source](https://github.com/madx/elfi/blob/master/src/middleware/logger.js))

This middleware is used to log each change to whatever logging system you are
using (a simple console.log by default)

```js
import {createStore} from "elfi"
import createLoggerMiddleware from "elfi/middleware/logger"

const logger = createLoggerMiddleware()

const store = createStore(1, [logger])
```

You can define a custom logger by passing a function to
`createLoggerMiddleware`. This function accepts a single argument which is
object with the following shape `{oldState, newState, change}`.

```js
import {createStore} from "elfi"
import createLoggerMiddleware from "elfi/middleware/logger"

function logOldState({oldState}) {
  console.log(oldState)
}

const logger = createLoggerMiddleware(({oldState}) => console.log(oldState))

const store = createStore(1, [logger])
```

## versioning ([source](https://github.com/madx/elfi/blob/master/src/middleware/versioning.js))

This middleware is used to add a version number to the state without triggering
another state change.

```js
import {createStore} from "elfi"
import createVersioningMiddleware from "elfi/middleware/versioning"

const versioning = createVersioningMiddleware()

const store = createStore(1, [versioning])
```

By default, it acts as if state is a simple object and sets the `version` field
of that object. You will probably want to define how to set the version and for
this you can pass a custom setter function to `createVersioningMiddleware`.

It will be called with the new state as the sole argument. Here's an example
with [Immutable.js][immutable]:

```js
import Immutable from "immutable"
import {createStore} from "elfi"
import createVersioningMiddleware from "elfi/middleware/versioning"

const versioning = createVersioningMiddleware(state => (
  state.set((state.get("version") || 0) + 1)
))
const store = createStore(new Immutable.Map(), [versioning])
```

[immutable]: https://facebook.github.io/immutable-js/
