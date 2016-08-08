'use strict';

import Errlich from 'errlich';
import hook from '../../lib';
import Mycro from '../utils/mycro';
import test from 'tape';


test('should instantiate a new errlich instance and export it at `mycro.services.error`', function(t) {
    const mycro = new Mycro();
    hook.call(mycro, function(err) {
        t.equal(err, undefined, 'should not error');
        t.equal(typeof mycro.services.error, 'object', 'should have error service');
        t.ok(mycro.services.error instanceof Errlich, 'should be an errlich instance');
        t.end();
    });
});

test('should allow for a custom service name', function(t) {
    const mycro = new Mycro({
        'mycro-error': {
            serviceName: 'bob'
        }
    });
    hook.call(mycro, function(err) {
        t.equal(err, undefined, 'should not error');
        t.equal(typeof mycro.services.bob, 'object', 'should have bob service');
        t.ok(mycro.services.bob instanceof Errlich, 'should be an errlich instance');
        t.end();
    });
});

test('should allow for named errors to be defined at config.errors', function(t) {
    const mycro = new Mycro({
        'mycro-error': {
            errors: {
                myError: {
                    status: 403,
                    title: 'Bob'
                }
            }
        }
    });
    hook.call(mycro, function(err) {
        t.equal(err, undefined, 'should not error');
        t.equal(typeof mycro.services.error.errors.myError, 'object', 'should have "myError"');
        t.equal(mycro.services.error.errors.myError.status, 403, 'should have status 403');
        t.equal(mycro.services.error.errors.myError.title, 'Bob', 'should have title Bob');
        t.end();
    });
});

test('should pass errlich instance to #configure hook if defined', function(t) {
    let callCount = 0;
    const mycro = new Mycro({
        'mycro-error': {
            configure(errlich, done) {
                callCount++;
                t.ok(errlich instanceof Errlich, 'should pass errlich instance to #configure');
                process.nextTick(done);
            }
        }
    });
    hook.call(mycro, function(err) {
        t.equal(err, undefined, 'should not error');
        t.equal(callCount, 1, 'should call #configure');
        t.end();
    });
});
