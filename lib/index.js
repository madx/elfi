'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
function createStore(initialState) {
  var state = initialState;
  var subscribers = [];

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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = subscribers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var subscriber = _step.value;

          subscriber(state, oldState);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    subscribe: function subscribe(subscriber) {
      subscribers.push(subscriber);

      return function unsubscribe() {
        var index = subscribers.indexOf(subscriber);

        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      };
    }
  };
}