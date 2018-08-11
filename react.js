"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeShape = exports.ElfiContext = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.connect = connect;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ElfiContext = exports.ElfiContext = _react2.default.createContext(null);

var storeShape = exports.storeShape = _propTypes2.default.shape({
  dispatch: _propTypes2.default.func.isRequired,
  getState: _propTypes2.default.func.isRequired,
  subscribe: _propTypes2.default.func.isRequired
});

function connect(WrappedComponent) {
  var mapStateToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (storeState) {
    return {
      storeState: storeState
    };
  };

  function ConnectedComponent(props) {
    return _react2.default.createElement(
      ElfiContext.Consumer,
      null,
      function (store) {
        var propsFromStore = mapStateToProps(store.getState(), store);
        return _react2.default.createElement(WrappedComponent, _extends({}, props, propsFromStore, { store: store }));
      }
    );
  }

  ConnectedComponent.displayName = "Connect$" + WrappedComponent.name;

  return ConnectedComponent;
}