'use strict';

const _ = require('lodash');

/**
 * Wrap a callback function. If an error is passed to the callback, convert it
 * using the available info. See below for available signatures.
 *
 *  wrap(400, cb);
 *  wrap(400, 'Invalid Param', cb);
 *  wrap(400, 'Invalid Param', {id: req.id}, cb);
 *  wrap('my-error', cb);
 *  wrap('my-error', 'Invalid Param', cb);
 *  wrap('my-error', 'Invalid Param', {id: req.id}, cb);
 *
 * Also, the function will curry until a callback is passed, allowing you
 * to compose wrappers.
 *
 *  const wrapRequest = wrap({ id: req.id });
 *  const wrapMyError = wrapRequest('my-error', 'my custom detail message');
 *
 *  doSomethingAsync(wrapMyError(function(err, data) {
 *      console.log(err)
 *  }))
 *
 * @param  {Number|String} codeOrStatus
 * @param  {String} [msg] - override the error message
 * @param  {Object} [properties] - additional properties to include on the error
 * @param  {Function} cb
 * @return {Function}
 */
module.exports = function wrap() {
    const wrapped = _createWrapped.call(this, {});
    return wrapped.apply(wrapped, arguments);
};


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
function _createWrapped(data) {
    const self = this;

    return function wrapped() {
        // process arguments
        for (let i = 0; i < arguments.length; i++) {
            const arg = arguments[i];
            switch (typeof arg) {
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
                data.props = data.props ? _.merge({}, data.props, arg) : arg;
                break;
            }
        }

        // if a function is already present, return wrapped function
        if (_.isFunction(data.cb)) {
            const codeOrStatus = data.code ? data.code : data.status;
            const msg = data.msg;
            const props = data.props;
            return function(err) {
                if (err) {
                    const _msg = msg ? msg : err.message;
                    err = self.initialize(err, codeOrStatus, _msg, props);
                    self.notify(err);
                }
                const args = [err];
                for (let i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                data.cb.apply(null, args);
            };
        } else {
            // otherwise, return a curried wrapping function
            return _createWrapped.call(self, data);
        }
    };
}
