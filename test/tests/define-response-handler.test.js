'use strict';

import ErrorService from '../../lib/service';
import test from 'tape';

const errorService = new ErrorService();

test('#defineResponseHandler should be defined', function(t) {
    t.equal(typeof errorService.defineResponseHandler, 'function', 'should be a function');
    t.end();
});

test('#defineResponseHandler should throw if a non function is passed as the handler', function(t) {
    const handler = 'hello';
    t.throws(errorService.defineResponseHandler.bind(errorService, handler), Error, 'should throw');
    t.end();
});

test('#defineResponseHandler should set the `responseHandler` property of the service', function(t) {
    const handler = function() {};
    errorService.defineResponseHandler(handler);
    t.equal(errorService.responseHandler, handler, 'should set the `responseHandler` property');
    t.end();
});
