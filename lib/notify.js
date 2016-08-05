'use strict';


/**
 * Loop through notifiers and call each with the provided errors/args.
 * @type  {Function}
 */
module.exports = function notify() {
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    this.notifiers.forEach(function(_notify) {
        _notify.apply(null, args);
    });
};
