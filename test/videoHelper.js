var videoHelper = require('../src/services/videoHelper');
var assert = require('assert');

describe('videoHelper#durationToMillis', function () {
  it('should return "00:00:5.217" as 5217 milliseconds', function () {
    assert.equal(5217, videoHelper.durationToMillis('00:00:5.217'));
  });
});

describe('videoHelper#secondsToMillis', function () {
  it('should return 5 seconds as 5000 milliseconds', function () {
    assert.equal(5000, videoHelper.secondsToMillis(5));
  });
  it('should return 5.2 seconds as 5200 milliseconds', function () {
    assert.equal(5200, videoHelper.secondsToMillis(5.2));
  });
});

describe('videoHelper#distributeVideoIndexes', function () {
  it('should split a 10s video with desired segment 5s into 2 segments', function () {
    videoHelper.distributeVideoIndexes(10, 5, function (result) {
      assert.equal(2, result);
    });
  });
  it('should split a 9s video with desired segment 5s into 2 segments', function () {
    videoHelper.distributeVideoIndexes(9,5,function (result) {
      assert(2, result);
    })
  });
  it('should split an 11s video with desired segment 5s into 2 segments', function () {
    videoHelper.distributeVideoIndexes(11,5,function (result) {
      assert(2, result);
    })
  });
  it('should split a 15s video with desired segment 5s into 3 segments', function () {
    videoHelper.distributeVideoIndexes(15,5,function (result) {
      assert(3, result);
    })
  });
  it('should split a 1s video with desired segment 15s into 1 segments', function () {
    videoHelper.distributeVideoIndexes(1,15,function (result) {
      assert(1, result);
    })
  });
});
