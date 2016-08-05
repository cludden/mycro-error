'use strict';

const ErrorService = require('../../lib/service');
const test = require('tape');

const errorService = new ErrorService();

test('#addNotifer should exist', function(t) {
    t.equal(typeof errorService.addNotifier, 'function', 'is defined');
    t.end();
});

test('#addNotifer should add functions to notifier array', function(t) {
    function myNotifier() {
        console.error.apply(console, arguments);
    }
    errorService.addNotifier(myNotifier);
    t.equal(errorService.notifiers.length, 1, 'should add notifier');
    errorService.notifiers.pop();
    t.end();
});

test('#addNotifier should skip non function argument', function(t) {
    errorService.addNotifier(1);
    t.equal(errorService.notifiers.length, 0, 'should ignore notifier');
    t.end();
});
