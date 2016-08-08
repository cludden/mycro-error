'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrap;

var _getCreateWrapped = require('./_get-create-wrapped');

var _getCreateWrapped2 = _interopRequireDefault(_getCreateWrapped);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wrap a callback function. If an error is passed to the callback, convert the
 * error using the available data. Any argument of type number will be used as the
 * http status. if a string argument is passed before a number argument, it will
 * be used as the error code and status will be ingored. any string passed after
 * the status or code will be used as the message. any objects (not functions) will
 * be merged with existing properties. If no function is passed, a new wrapping
 * function will be returned.
 * @return {Function}
 */
function wrap() {
  var createWrapped = (0, _getCreateWrapped2.default)(false);
  var w = createWrapped.call(this, {});

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return w.apply(w, args);
}
module.exports = exports['default'];