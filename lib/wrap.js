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
    const wrapped = createWrapped.call(this, {});
    return wrapped.apply(wrapped, arguments);
};

function createWrapped(data) {
    const self = this;

    return function wrapped() {
        // process arguments
        for (let i = 0; i < arguments.length; i++) {
            const arg = arguments[i];
            switch (typeof arg) {
            case 'string':
                if (data.code === undefined) {
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

        if (_.isFunction(data.cb)) {
            const codeOrStatus = data.code ? data.code : data.status;
            const msg = data.msg;
            const props = data.props;
            return function(err) {
                if (err) {
                    err = self.create(codeOrStatus, msg || err.message, props);
                    self.notify(err);
                }
                const args = [err];
                for (let i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                data.cb.apply(null, args);
            };
        } else {
            return createWrapped.call(self, data);
        }
    };
}
