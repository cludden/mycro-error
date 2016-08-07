'use strict';

import ErrorService from '../../lib/service';
import test from 'tape';
import _ from 'lodash';

const errors = {
    notFound: {
        status: 404,
        title: 'Not.... found.'
    }
};

function allFalse() {
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i]) {
            throw new Error('uh oh');
        }
    }
    return true;
}

const errorService = new ErrorService(errors);

test('#wrapSync should be defined', function(t) {
    t.equal(typeof errorService.wrapSync, 'function', 'should be a function');
    t.end();
});

test('#wrapSync should return a curried function until a function is passed', function(t) {
    const notFound = errors.notFound;
    const msg = 'hello';
    const id = 5;
    const first = errorService.wrapSync('notFound');
    const second = first(msg);
    const third = second({ id });
    const fourth = third(allFalse);

    const result = fourth(false, false, false);
    t.equal(result, true, 'should behave as normal if no error is thrown');

    const err = _.attempt(function() {
        return fourth(false, false, true);
    });
    t.ok(err instanceof Error, 'throws an error');
    t.equal(err.isBoom, true, 'throws a boom error');
    t.equal(err.data.code, notFound.code, 'should have code: ' + notFound.code);
    t.equal(err.data.detail, msg, 'should have detail: ' + notFound.detail);
    t.equal(err.data.title, notFound.title, 'should have title: ' + notFound.title);
    t.equal(err.output.statusCode, notFound.status, 'should have status: ' + notFound.status);
    t.end();
});

test('#wrapSync should return a wrapped function immediately if function is passed', function(t) {
    const notFound = errors.notFound;
    const id = 5;
    const wrapped = errorService.wrapSync('notFound', { id }, allFalse);

    const result = wrapped(false, false, false);
    t.equal(result, true, 'should behave as normal if no error is thrown');

    const err = _.attempt(function() {
        return wrapped(false, false, true);
    });
    t.ok(err instanceof Error, 'throws an error');
    t.equal(err.isBoom, true, 'throws a boom error');
    t.equal(err.data.code, notFound.code, 'should have code: ' + notFound.code);
    t.equal(err.data.detail, 'uh oh', 'should use error message as detail if not specified in call');
    t.equal(err.data.title, notFound.title, 'should have title: ' + notFound.title);
    t.equal(err.output.statusCode, notFound.status, 'should have status: ' + notFound.status);
    t.end();
});

test('#wrapSync should work with status instead of code', function(t) {
    const wrapped = errorService.wrapSync(403, 'Not Allowed', allFalse);
    const err = _.attempt(function() {
        return wrapped(false, false, false, false, true);
    });
    t.ok(err instanceof Error, 'throws an error');
    t.equal(err.isBoom, true, 'throws a boom error');
    t.equal(err.output.statusCode, 403, 'should have status: 403');
    t.equal(err.output.payload.error, 'Forbidden', 'should have error: Forbidden');
    t.end();
});

test('#wrapSync should merge curried properties', function(t) {
    const wrapped = errorService.wrapSync(403, { foo: 'bar' }, { bar: 'baz' }, allFalse);
    const err = _.attempt(function() {
        return wrapped(true);
    });
    t.equal(err.data.foo, 'bar', 'should have property foo from first object');
    t.equal(err.data.bar, 'baz', 'should have property bar from second object');
    t.end();
});
