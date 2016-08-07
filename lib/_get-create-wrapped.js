'use strict';

import _ from 'lodash';


/**
 * Factory function for creating a synchronous or async version of the wrapping
 * factory function
 * @param  {Boolean} sync
 * @return {Function}
 */
export default function getCreateWrapped(sync) {
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
        const self = this;

        /**
         * Curried function that accepts arguments until a function is passed, at
         * which point it returns a wrapped version of the function.
         * @return {Function}
         */
        return function wrapper() {
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
                if (sync === true) {
                    return function wrappedSync() {
                        try {
                            return data.cb.apply(null, arguments);
                        } catch (e) {
                            const _msg = msg ? msg : e.message;
                            const err = self.initialize(e, codeOrStatus, _msg, props);
                            self.notify(err);
                            throw err;
                        }
                    };
                } else {
                    return function wrapped(err) {
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
                }
            } else {
                // otherwise, return a curried wrapping function
                return _createWrapped.call(self, data);
            }
        };
    };
}
