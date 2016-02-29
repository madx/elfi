'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
function createStore(initialState) {
  var state = initialState;
  var subscribers = new Set();

  return {
    getState: function getState() {
      return state;
    },
    dispatch: function dispatch(action) {
      if (typeof action !== 'function') {
        throw new Error('action must be a function');
      }

      var oldState = state;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      state = action.apply(undefined, [state].concat(args));

      if (state === oldState) {
        return;
      }

      subscribers.forEach(function (subscriber) {
        return subscriber(state, oldState);
      });
    },
    subscribe: function subscribe(subscriber) {
      subscribers.add(subscriber);

      return function unsubscribe() {
        if (subscribers.has(subscriber)) subscribers.delete(subscriber);
      };
    }
  };
}