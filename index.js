"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createStore(initialState) {
  var middleware = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (initialState === undefined) {
    throw new Error("Missing initial state in store creation");
  }
  var state = initialState;
  var subscribers = new Set();

  // Final middleware, simply applies the change to the state
  middleware.push(function finalize(next, state, change) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    return change.apply(undefined, [state].concat(args));
  });

  var updater = middleware.reduceRight(function (chain, mw) {
    var next = chain[0];
    chain.unshift(function (state, change) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      return mw.apply(undefined, [next, state, change].concat(args));
    });
    return chain;
  }, []).shift();

  return {
    getState: function getState() {
      return state;
    },
    dispatch: function dispatch(change) {
      if (typeof change !== "function") {
        throw new Error("change must be a function");
      }

      var oldState = state;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      state = updater.apply(undefined, [state, change].concat(_toConsumableArray(args)));

      if (state === oldState) {
        return;
      }

      subscribers.forEach(function (subscriber) {
        return subscriber(state, oldState);
      });
    },
    subscribe: function subscribe(subscriber) {
      if (typeof subscriber !== "function") {
        throw new Error("subscriber must be a function");
      }

      subscribers.add(subscriber);

      return function unsubscribe() {
        if (subscribers.has(subscriber)) {
          subscribers.delete(subscriber);
        }
      };
    }
  };
}