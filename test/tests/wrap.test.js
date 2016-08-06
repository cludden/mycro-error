'use strict';

const ErrorService = require('../../lib/service');
const test = require('tape');

const errors = {
    myError: { status: 499, title: 'MY ERROR'},
    myOtherError: { status: 421, title: 'MY OTHER ERROR' }
};

const errorService = new ErrorService(errors);


test('#wrap should be defined', function(t) {
    t.equal(typeof errorService.wrap, 'function', 'should be a function');
    t.end();
});

test('#wrap should return a curried function until a callback is passed', function(t) {
    const myError = errors.myError;
    const myMessage = 'some detail';
    const id = 5;
    const e = new Error('Uh oh!');
    const first = errorService.wrap('myError');
    const second = first(myMessage);
    const third = second({ id });
    const fourth = third(function(err) {
        t.ok(err instanceof Error, 'should return an error');
        t.equal(err.output.statusCode, myError.status, 'should have status: ' + myError.status);
        t.equal(err.data.code, 'my-error', 'should have code: my-error');
        t.equal(err.data.title, myError.title, 'should have title: ' + myError.title);
        t.equal(err.message, myMessage, 'should have message: ' + myMessage);
        t.equal(err.data.detail, myMessage, 'should have detail: ' + myMessage);
        t.equal(err.data.id, id, 'should have property "id": ' + id);
        t.end();
    });
    fourth(e);
});

test('#wrap should return a wrapped function immediately if callback is present', function(t) {
    const myError = errors.myError;
    const e = new Error('uh oh!');
    const wrapped = errorService.wrap('myError', function(err) {
        t.ok(err instanceof Error, 'should return an error');
        t.equal(err.output.statusCode, myError.status, 'should have status: ' + myError.status);
        t.equal(err.data.code, myError.code, 'should have code: ' + myError.code);
        t.equal(err.data.detail, e.message, 'should use error message as detail if not specified in call');
        t.equal(err.data.title, myError.title, 'should have title: ' + myError.title);
        t.end();
    });
    wrapped(e);
});

test('#wrap should work with status instead of code', function(t) {
    const u = errorService.get('undefined');
    const e = new Error('uh oh!');
    const status = 421;
    const detail = 'some detail';
    const wrapped = errorService.wrap(status, detail, function(err) {
        t.ok(err instanceof Error, 'should return an error');
        t.equal(err.output.statusCode, status, 'should have status: ' + status);
        t.equal(err.data.code, u.code, 'should have code: ' + u.code);
        t.equal(err.data.detail, detail, 'should use specified detail');
        t.equal(err.message, detail, 'should use specified detail as message');
        t.equal(err.data.title, u.title, 'should have title: ' + u.title);
        t.end();
    });
    wrapped(e);
});

test('#wrap should merge curried properties', function(t) {
    const myError = errors.myError;
    const d1 = { foo: 'bar' };
    const d2 = { bar: 'baz' };
    const e = new Error('uh oh!');
    const detail = 'blah blah blah';
    const first = errorService.wrap(d1);
    const wrapped = first('myError', detail, d2, function(err) {
        t.ok(err instanceof Error, 'should return an error');
        t.equal(err.output.statusCode, myError.status, 'should have status: ' + myError.status);
        t.equal(err.data.code, myError.code, 'should have code: ' + myError.code);
        t.equal(err.data.detail, detail, 'should use specified detail');
        t.equal(err.message, detail, 'should use specified detail as message');
        t.equal(err.data.title, myError.title, 'should have title: ' + myError.title);
        t.equal(err.data.foo, d1.foo, 'should contain initial data');
        t.equal(err.data.bar, d2.bar, 'should contain later data');
        t.end();
    });
    wrapped(e);
});

test('#wrap should pass additional args to wrapped function if successful', function(t) {
    const d = { foo: 'bar' };
    const wrapped = errorService.wrap(500, 'uh oh', function(err, data) {
        t.equal(err, null, 'should not error');
        t.deepEqual(data, d, 'should pass data');
        t.end();
    });
    wrapped(null, d);
});
