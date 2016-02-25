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
         * Intercept a traditional node style callback. If a truthy error is
         * encountered, pass it to `notify()` and optionally strip it from the
         * curried arguments to `cb`
         *
         * @param  {Boolean} [passErrorToCallback=false] - whether to pass any error argument to the callback
         * @param  {Function} cb - callback
         * @param  {*} [context=null] - optional context to bind to the callback
         */
        intercept(passErrorToCallback, cb, context) {
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
                    self.notify(err);
                    if (passErrorToCallback === false) {
                        return;
                    }
                }
                if (passErrorToCallback !== true) {
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
                        return res.json(500, {errors: [err]});
                    } else {
                        return self.responseHandler(res, err);
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
        }
    };
};
