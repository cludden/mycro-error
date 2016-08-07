'use strict';

export default function addNotifier(notifier) {
    if (typeof notifier !== 'function') {
        return;
    }
    this.notifiers.push(notifier);
}
