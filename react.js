"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.storeShape = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.connect = connect;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var storeShape = exports.storeShape = _propTypes2.default.shape({
  dispatch: _propTypes2.default.func.isRequired,
  getState: _propTypes2.default.func.isRequired,
  subscribe: _propTypes2.default.func.isRequired
});

var Provider = exports.Provider = function (_React$PureComponent) {
  _inherits(Provider, _React$PureComponent);

  function Provider() {
    _classCallCheck(this, Provider);

    return _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
  }

  _createClass(Provider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        store: this.props.store
      };
    }
  }, {
    key: "render",
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);

  return Provider;
}(_react2.default.PureComponent);

Provider.propTypes = {
  store: storeShape.isRequired,
  children: _propTypes2.default.element.isRequired
};
Provider.childContextTypes = {
  store: storeShape.isRequired
};
function connect(WrappedComponent) {
  var _class, _temp;

  var mapStateToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (storeState) {
    return { storeState: storeState };
  };

  return _temp = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this3 = this;

        var store = this.context.store;
        // We always forceUpdate here because elfi skips updating us if the
        // underlying state hasn't changed, so we only receive updates when data
        // actually changed.

        this.unsubscribe = store.subscribe(function () {
          return _this3.forceUpdate();
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.unsubscribe();
      }
    }, {
      key: "render",
      value: function render() {
        var store = this.context.store;

        var propsFromStore = mapStateToProps(store.getState(), store);

        return _react2.default.createElement(WrappedComponent, _extends({}, this.props, propsFromStore, { store: store }));
      }
    }]);

    return _class;
  }(_react2.default.Component), _class.contextTypes = {
    store: storeShape.isRequired
  }, _class.displayName = "Connect$" + WrappedComponent.name, _temp;
}