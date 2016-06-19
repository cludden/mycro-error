'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = function(mycro) {
    let notifiers = [];
    return {
        /**
         * Add new notifier
         * @param {Function|Function[]} notifier
         */
        addNotifier(notifier) {
            let toAdd = notifier;
            if (!_.isArray(notifier)) {
                toAdd = [notifier];
            }
            toAdd.forEach(function(n) {
                if (!_.isFunction(n)) {
                    return;
                }
                notifiers.push(n);
            });
        },


        /**
         * Retreive an error and augment with additional detail if applicable
         * @param  {String} name - the error name
         * @param  {String} [detail]
         * @return {Object}
         */
        get(name, detail) {
            const error = _.get(mycro, '_config.errors.' + name) || {
                status: 500,
                title: 'Undefined Error',
                detail: 'Unable to locate error with name: ' + name
            };
            return _.merge({}, error, { detail });
        },


        /**
         * Intercept a traditional node style callback. If a truthy error is
         * encountered, pass it to `notify()` and optionally strip it from the
         * curried arguments to `cb`
         *
         * @param  {Boolean} [stripErrorFromCallback=false] - whether to pass any error argument to the callback
         * @param  {Function} cb - callback
         * @param  {*} [context=null] - optional context to bind to the callback
         */
        intercept(stripErrorFromCallback, cb, context) {
            let self = this;
            context = context || null;

            if (_.isFunction(stripErrorFromCallback)) {
                cb = stripErrorFromCallback;
                stripErrorFromCallback = false;
            }

            return function() {
                let args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                let err = args[0];
                if (err) {
                    self.notify(err);
                    if (stripErrorFromCallback === true) {
                        return;
                    }
                }
                if (stripErrorFromCallback === true) {
                    args.shift();
                }
                cb.apply(context, args);
            };
        },


        /**
         * Intercept a response handling callback, typically found as the final
         * callback in a controller's asynchronous workflow
         *
         * @param  {Response} res - the response object
         * @param  {Boolean} passErrorToCallback - whether to pass any error to the callback
         * @param  {Function} cb - callback
         * @param  {*} [context=null] - optional context to bind to the callback
         */
        interceptResponse(res, passErrorToCallback, cb, context) {
            let self = this;
            context = context || null;

            if (_.isFunction(passErrorToCallback)) {
                cb = passErrorToCallback;
                passErrorToCallback = false;
            }

            return function() {
                let args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                let err = args[0];
                if (err) {
                    if (!_.isFunction(self.responseHandler)) {
                        res.json(500, {errors: [err]});
                    } else {
                        self.responseHandler(res, err);
                    }
                }
                if (passErrorToCallback !== true) {
                    args.shift();
                }
                cb.apply(context, args);
            };
        },


        /**
         * Generic error handler
         */
        notify() {
            let args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            let cb;
            if (_.isFunction(args[args.length - 1])) {
                cb = args.pop();
            } else {
                cb = _.noop;
            }
            mycro.log.apply(mycro, ['error'].concat(args));
            async.each(notifiers, function(notifier, fn) {
                notifier.apply(notifier, args);
                fn();
            }, cb);
        },


        /**
         * Get a notifier at a specified index for testing
         * @return {[type]} [description]
         */
        _notifiers(i) {
            return notifiers[i];
        },


        /**
         * Wrap a callback, coerce any error into a named error, optionally
         * intercept the error
         * @param  {Boolean} [intercept=false]
         * @param  {String} name - error name
         * @param  {Function} cb
         * @return {Function}
         */
        wrap(intercept, name, cb) {
            // handle optional `intercept` argument
            if (!_.isBoolean(intercept)) {
                cb = name;
                name = intercept;
                intercept = false;
            }

            let callback = function(err) {
                if (err) {
                    err = mycro.services.error.get(name, _.get(err, 'message'));
                    return cb(err);
                }
                let args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                cb.apply(null, args);
            };

            if (intercept === true) {
                callback = mycro.services.error.intercept(callback);
            }
            return callback;
        }
    };
};
