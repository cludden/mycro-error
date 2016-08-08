'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = addNotifier;
function addNotifier(notifier) {
    if (typeof notifier !== 'function') {
        return;
    }
    this.notifiers.push(notifier);
}
module.exports = exports['default'];