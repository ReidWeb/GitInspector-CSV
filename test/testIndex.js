var mocha = require('mocha');
var chai = require('chai');
var should = chai.should();

describe('Array', function() {
    it('should start empty', function() {
        var arr = [];

        (arr.length).should.equal(0);
    });
});