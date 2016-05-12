'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

function errorProneFunction(obj, cb) {
    process.nextTick(function() {
        return cb(new Error('Something unexpected'));
    });
}

function okFunction(obj, cb) {
    process.nextTick(function() {
        return cb(null, 'ok!');
    });
}

describe('get', function() {
    let Err;

    before(function() {
        Err = mycro.services.error;
    });

    it('should catch an error and convert it to the appropriate error', function(done) {
        errorProneFunction({}, Err.wrap('badRequest', function(err) {
            expect(err).to.be.an('object');
            expect(err).to.have.property('status', 400);
            expect(err).to.have.property('title', 'Bad Request');
            expect(err).to.have.property('detail', 'Something unexpected');
            done();
        }));
    });

    it('should allow for interception', function(done) {
        sinon.spy(Err, 'notify')
        errorProneFunction({}, Err.wrap(true, 'badRequest', function(err) {
            expect(err).to.be.an('object');
            expect(err).to.have.property('status', 400);
            expect(err).to.have.property('title', 'Bad Request');
            expect(err).to.have.property('detail', 'Something unexpected');
            expect(Err.notify).to.have.been.called;
            Err.notify.restore();
            done();
        }));
    })
});
