"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createVersioningMiddleware;
var DEFAULT_SETTER = function setter(newState) {
  newState.version = (newState.version || 0) + 1;
  return newState;
};

function createVersioningMiddleware() {
  var setter = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_SETTER : arguments[0];

  return function versioningMiddleware(next, state, change) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    var newState = next.apply(undefined, [state, change].concat(args));

    if (newState !== state) {
      newState = setter(newState);
    }

    return newState;
  };
}