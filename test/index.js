var expect = require('expect.js'),
    runkeeper2garmin = require('..');

describe('runkeeper2garmin', function() {
  it('should say hello', function(done) {
    expect(runkeeper2garmin()).to.equal('Hello, world');
    done();
  });
});
