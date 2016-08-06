'use strict';

const methods = {
    addNotifier: require('./add-notifier'),
    get: require('./get'),
    initialize: require('./initialize'),
    notify: require('./notify'),
    validateErrorDefinitions: require('./validate-error-definitions'),
    wrap: require('./wrap')
};

/**
 * ErrorService constructor
 * @param {Object} errors - defined errors
 */
function ErrorService(errors) {
    this.notifiers = [];

    Object.keys(methods).forEach(function(method) {
        this[method] = this[method].bind(this);
    }.bind(this));

    this.errors = this.validateErrorDefinitions(errors);
}

// attach prototype methods
Object.keys(methods).forEach(function(method) {
    const fn = methods[method];
    ErrorService.prototype[method] = fn;
});


module.exports = ErrorService;
