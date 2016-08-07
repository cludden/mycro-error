'use strict';

import ErrorService from '../../lib/service';
import td from 'testdouble';
import test from 'tape';

const errorService = new ErrorService();

test('#notify should be defined', function(t) {
    t.equal(typeof errorService.notify, 'function', 'should be a function');
    t.end();
});

test('#notify should call notifiers with same arguments', function(t) {
    const notify = td.function();
    errorService.addNotifier(notify);
    errorService.notify('a', 'b', 'c');
    t.error(td.verify(notify('a', 'b', 'c')), 'should call notifier with a, b, c');
    errorService.notifiers = [];
    t.end();
});

test('#notify should call all notifiers', function(t) {
    const e = new Error();
    const notifiers = [td.function(), td.function()];
    notifiers.forEach(errorService.addNotifier);
    errorService.notify(e);
    notifiers.forEach(function(notify, i) {
        t.error(td.verify(notify(e)), 'should call notifier(' + i +')');
    });
    errorService.notifiers = [];
    t.end();
});
