"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLoggerMiddleware;
var DEFAULT_LOGGER = function defaultLogger(_ref) {
  var oldState = _ref.oldState;
  var newState = _ref.newState;
  var change = _ref.change;

  console.log(change.name, oldState, newState);
};

function createLoggerMiddleware() {
  var logger = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_LOGGER : arguments[0];

  return function loggerMiddleware(next, oldState, change) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    var newState = next.apply(undefined, [oldState, change].concat(args));
    logger({ oldState: oldState, newState: newState, change: change });
    return newState;
  };
}