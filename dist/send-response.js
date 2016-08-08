'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = sendResponse;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Send error response using defined response handler if available
 * @param  {Object} res
 * @param  {Function} [cb]
 * @return {Function}
 */
function sendResponse(res, cb) {
    var self = this;
    var handler = this.responseHandler;

    // define default response handler
    if (!_lodash2.default.isFunction(handler)) {
        handler = function defaultResponseHandler(res, err) {
            if (!_lodash2.default.isError(err) || !err.isBoom) {
                err = self.initialize(err);
            }
            res.status(err.output.statusCode).json(err.output.payload);
        };
    }

    // if no cb provided, return a function that should only be called on error
    if (!_lodash2.default.isFunction(cb)) {
        return function (err) {
            handler.call(self, res, err);
        };
    }

    // otherwise, wrap the callback and intercept any error passed to it.
    return function (err) {
        if (err) {
            return handler.call(self, res, err);
        }

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        cb.apply(null, args);
    };
}
module.exports = exports['default'];