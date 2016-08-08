'use strict';

import _ from 'lodash';

/**
 * Send error response using defined response handler if available
 * @param  {Object} res
 * @param  {Function} [cb]
 * @return {Function}
 */
export default function sendResponse(res, cb) {
    const self = this;
    let handler = this.responseHandler;

    // define default response handler
    if (!_.isFunction(handler)) {
        handler = function defaultResponseHandler(res, err) {
            if (!_.isError(err) || !err.isBoom) {
                err = self.initialize(err, 500);
            }
            res.status(err.output.statusCode).json(err.output.payload);
        };
    }

    // if no cb provided, return a function that should only be called on error
    if (!_.isFunction(cb)) {
        return function(err) {
            handler.call(self, res, err);
        };
    }

    // otherwise, wrap the callback and intercept any error passed to it.
    return function(err, ...args) {
        if (err) {
            return handler.call(self, res, err);
        }
        cb.apply(null, args);
    };
}
