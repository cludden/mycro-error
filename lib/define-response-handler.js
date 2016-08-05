'use strict';

const _ = require('lodash');

module.exports = function defineResponseHandler(handler) {
    if (_.isFunction(handler)) {
        throw new Error('Invalid handler passed to #defineResponseHandler');
    }
    this.responseHandler = handler;
};
