'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapSync;

var _getCreateWrapped = require('./_get-create-wrapped');

var _getCreateWrapped2 = _interopRequireDefault(_getCreateWrapped);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wrap a synchronous function that could potentially throw. If it does throw, convert
 * the error using the available info. Any argument of type number will be used as the
 * http status. if a string argument is passed before a number argument, it will be
 * used as the error code and status will be ignored. any string passed after the
 * status or code will be used as the message. any objects (not functions) will be
 * merged with existing properties. If no function is passed, a new wrapping function
 * will be returned.
 * @return {Function} [description]
 */
function wrapSync() {
  var createWrapped = (0, _getCreateWrapped2.default)(true);
  var w = createWrapped.call(this, {});

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return w.apply(w, args);
}
module.exports = exports['default'];