'use strict';

import _ from 'lodash';

export default function defineResponseHandler(handler) {
    if (!_.isFunction(handler)) {
        throw new Error('Invalid handler passed to #defineResponseHandler');
    }
    this.responseHandler = handler;
}
