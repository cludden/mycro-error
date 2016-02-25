/* jshint expr:true */
'use strict';

var chai = require('chai'),
    sinon = require('sinon');

let expect = chai.expect;

describe('#addNotifer()', function() {
    let test = {
        notifyError: function() {
            console.error('test.notify()');
        }
    };

    it('should add a notifer to the list of notifiers', function(done) {
        sinon.spy(test, 'notifyError');
        mycro.services.error.addNotifier(test.notifyError);
        mycro.services.error.notify(new Error('something unexpected'), {user: 1}, function(err) {
            expect(err).to.not.exist;
            expect(test.notifyError).to.have.been.called;
            expect(test.notifyError.lastCall.args).to.have.lengthOf(2);
            test.notifyError.restore();
            done();
        });
    });
});
