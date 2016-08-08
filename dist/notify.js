'use strict';

/**
 * Loop through notifiers and call each with the provided errors/args.
 * @type  {Function}
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notify;
function notify() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    this.notifiers.forEach(function (_notify) {
        _notify.apply(null, args);
    });
}
module.exports = exports['default'];