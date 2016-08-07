'use strict';

import getCreateWrapped from './_get-create-wrapped';


/**
 * Wrap a callback function. If an error is passed to the callback, convert the
 * error using the available data. Any argument of type number will be used as the
 * http status. if a string argument is passed before a number argument, it will
 * be used as the error code and status will be ingored. any string passed after
 * the status or code will be used as the message. any objects (not functions) will
 * be merged with existing properties. If no function is passed, a new wrapping
 * function will be returned.
 * @return {Function}
 */
export default function wrap(...args) {
    const createWrapped = getCreateWrapped(false);
    const w = createWrapped.call(this, {});
    return w.apply(w, args);
}
