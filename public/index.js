"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This function takes a component...
//function withSubscription(WrappedComponent, ctx, getDataFn, addChangeListenerFn, removeChangeListenerFn, propName) {
function withSubscription(WrappedComponent) {
  // ...and returns another component...
  return function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.handleChange = _this.handleChange.bind(_this);
      _this.state = {
        //data: getDataFn.call(ctx, [props])
        data: props.onGetRows.call(props.context, props)
      };
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        // ... that takes care of the subscription...
        //addChangeListenerFn.call(ctx, this.handleChange);
        this.props.onAddChangeListener.call(this.props.context, this.handleChange);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        //removeChangeListenerFn.call(ctx, this.handleChange);
        this.props.onRemoveChangeListener.call(this.props.context, this.handleChange);
      }
    }, {
      key: "handleChange",
      value: function handleChange() {
        this.setState({
          //data: getDataFn.call(ctx, this.props)
          data: this.props.onGetRows.call(this.props.context, this.props)
        });
      }
    }, {
      key: "render",
      value: function render() {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return React.createElement(WrappedComponent, _extends({ data: this.state.data }, this.props));
      }
    }]);

    return _class;
  }(React.Component);
}
// -------------------------------------------------------------------------------

var prompt = "tecmint@tecmint ~ ";
var termOut = [];
termOut[0] = {
  cmd: "$ cal",
  out: ["September 2015", "Su Mo Tu We Th Fr Sa", "1  2  3  4  5", "6  7  8  9 10 11 12", "13 14 15 16 17 18 19", "20 21 22 23 24 25 26", "27 28 29 30"]
};
termOut[1] = {
  cmd: "w",
  out: ["14:49:40 up  4:06,  2 users,  load average: 1.37, 1.56, 1.62", "USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT", "tecmint  tty8     :0               10:45    4:06m  7:40   0.36s x-session-manager", "tecmint  pts/5    :0               13:42    4.00s  0.07s  0.00s script script.log"]
};
termOut[2] = {
  cmd: "uptime",
  out: ["14:49:43 up  4:06,  2 users,  load average: 1.37, 1.56, 1.62"]
};
termOut[3] = {
  cmd: "whoami",
  out: ["tecmint"]
};
termOut[4] = {
  cmd: "echo 'using script",
  out: ["using script"]
};
termOut[5] = {
  cmd: "exit",
  out: ["exit", "Script done, file is script.log"]
};
var DataSource = {
  cl: [],
  rows: [],
  getRows: function getRows() {
    return this.rows;
  },
  addChangeListener: function addChangeListener(handle) {
    this.cl.push(handle);
  },
  removeChangeListener: function removeChangeListener(handle) {
    var foundIdx = this.cl.lastIndexOf(handle);
    this.cl = [].concat(_toConsumableArray(this.cl.slice(0, foundIdx)), _toConsumableArray(this.cl.slice(foundIdx + 1, this.cl.length)));
  },
  removeAllListeners: function removeAllListeners() {
    this.cl = [];
  },
  onChange: function onChange() {
    this.cl.forEach(function (fn) {
      fn.apply(null, null);
    }, this);
  },
  addRow: function addRow(text) {
    this.rows = [].concat(_toConsumableArray(this.rows), [text]);
    this.onChange();
  },
  start: function start() {
    var _this2 = this;

    setInterval(function () {
      var idx = Math.floor(Math.random() * 5);
      _this2.addRow(prompt + " " + termOut[idx].cmd);
      setTimeout(function () {
        termOut[idx].out.forEach(function (el) {
          this.addRow(el);
        }, _this2);
      }, 200);
    }, 1000);
  }
};

var RowList = function RowList(props) {
  var i = 0;
  if (props.data instanceof Array) return React.createElement(
    "div",
    null,
    props.data.map(function (el) {
      return React.createElement(
        "div",
        { className: "", key: i++ },
        el
      );
    })
  );
};

var Terminal = withSubscription(RowList);

// Change names of the methods
var App = function App() {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "span",
      { className: "cursor" },
      "A"
    ),
    React.createElement(Terminal, {
      onGetRows: DataSource.getRows,
      onAddChangeListener: DataSource.addChangeListener,
      onRemoveChangeListener: DataSource.removeChangeListener,
      context: DataSource })
  );
};

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));

DataSource.start();

setTimeout(function () {
  DataSource.addRow("enough..........removing all listeners");
  DataSource.removeAllListeners();
}, 10000);