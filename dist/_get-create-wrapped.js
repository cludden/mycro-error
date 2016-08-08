'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = getCreateWrapped;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Factory function for creating a synchronous or async version of the wrapping
 * factory function
 * @param  {Boolean} sync
 * @return {Function}
 */
function getCreateWrapped(sync) {
    /**
     * factory function for creating wrapping functions
     * @param  {Object} data - initial data
     * @param  {Function} data.cb - the callback to wrap. as soon as this argument is passed, this function will returned a wrapped version
     * @param  {String} data.code - the error code
     * @param  {String} data.msg - the error messsage/detail
     * @param  {Object} data.props - additional properties to decorate the error with
     * @param  {Number} data.status - the http status of the error
     * @return {Function}
     */
    return function _createWrapped(data) {
        var self = this;

        /**
         * Curried function that accepts arguments until a function is passed, at
         * which point it returns a wrapped version of the function.
         * @return {Function}
         */
        return function wrapper() {
            // process arguments
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
                    case 'string':
                        if (data.code === undefined && data.status === undefined) {
                            data.code = arg;
                        } else {
                            data.msg = arg;
                        }
                        break;
                    case 'number':
                        data.status = arg;
                        break;
                    case 'function':
                        data.cb = arg;
                        break;
                    case 'object':
                        data.props = data.props ? _lodash2.default.merge({}, data.props, arg) : arg;
                        break;
                }
            }

            // if a function is already present, return wrapped function
            if (_lodash2.default.isFunction(data.cb)) {
                var _ret = function () {
                    var codeOrStatus = data.code ? data.code : data.status;
                    var msg = data.msg;
                    var props = data.props;
                    if (sync === true) {
                        return {
                            v: function wrappedSync() {
                                try {
                                    return data.cb.apply(null, arguments);
                                } catch (e) {
                                    var _msg = msg ? msg : e.message;
                                    var err = self.initialize(e, codeOrStatus, _msg, props);
                                    self.notify(err);
                                    throw err;
                                }
                            }
                        };
                    } else {
                        return {
                            v: function wrapped(err) {
                                if (err) {
                                    var _msg = msg ? msg : err.message;
                                    err = self.initialize(err, codeOrStatus, _msg, props);
                                    self.notify(err);
                                }
                                var args = [err];
                                for (var _i = 1; _i < arguments.length; _i++) {
                                    args.push(arguments[_i]);
                                }
                                data.cb.apply(null, args);
                            }
                        };
                    }
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            } else {
                // otherwise, return a curried wrapping function
                return _createWrapped.call(self, data);
            }
        };
    };
}
module.exports = exports['default'];