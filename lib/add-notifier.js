'use strict';

module.exports = function addNotifier(notifier) {
    if (typeof notifier !== 'function') {
        return;
    }
    this.notifiers.push(notifier);
};
