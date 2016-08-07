'use strict';

/**
 * Loop through notifiers and call each with the provided errors/args.
 * @type  {Function}
 */
export default function notify(...args) {
    this.notifiers.forEach(function(_notify) {
        _notify.apply(null, args);
    });
}
