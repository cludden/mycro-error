'use strict';

import getCreateWrapped from './_get-create-wrapped';


/**
 * Wrap a synchronous function that could potentially throw. If it does throw, convert
 * the error using the available info. Any argument of type number will be used as the
 * http status. if a string argument is passed before a number argument, it will be
 * used as the error code and status will be ignored. any string passed after the
 * status or code will be used as the message. any objects (not functions) will be
 * merged with existing properties. If no function is passed, a new wrapping function
 * will be returned.
 * @return {Function} [description]
 */
export default function wrapSync(...args) {
    const createWrapped = getCreateWrapped(true);
    const w = createWrapped.call(this, {});
    return w.apply(w, args);
}
