'use strict';

const expect = require('chai').expect;

describe('get', function() {
    let Err;

    before(function() {
        Err = mycro.services.error;
    });

    it('should return the appropriate error', function() {
        let err = Err.get('forbidden');
        expect(err).to.be.an('object');
        expect(err).to.have.property('status', 403);
        expect(err).to.have.property('title', 'Forbidden');
    });

    it('should allow the user to provide detail', function() {
        let err = Err.get('badRequest', 'uh oh');
        expect(err).to.be.an('object');
        expect(err).to.have.property('status', 400);
        expect(err).to.have.property('title', 'Bad Request');
        expect(err).to.have.property('detail', 'uh oh');
    });

    it('should return an undefined error if not found', function() {
        let err = Err.get('missing');
        expect(err).to.have.property('status', 500);
        expect(err).to.have.property('title', 'Undefined Error');
    });
})
