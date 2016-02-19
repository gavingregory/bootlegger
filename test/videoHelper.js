var videoHelper = require('../src/services/videoHelper');
var assert = require('chai').assert;

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
  describe('count', function () {
    it('should accept a formatted text clip_length \'00:00:17.2171043\'', function () {
      videoHelper.distributeVideoIndexes('00:00:17.2171043', 5, function (result) {
        assert.equal(4, result.count);
        assert.equal(4, result.segments.length);
      })
    });
    it('should split a 10s video with desired segment 5s into 2 segments', function () {
      videoHelper.distributeVideoIndexes(10, 5, function (result) {
        assert.equal(2, result.count);
        assert.equal(2, result.segments.length);
      });
    });
    it('should split a 9s video with desired segment 5s into 2 segments', function () {
      videoHelper.distributeVideoIndexes(9,5,function (result) {
        assert.equal(2, result.count);
        assert.equal(2, result.segments.length);
      });
    });
    it('should split an 11s video with desired segment 5s into 3 segments', function () {
      videoHelper.distributeVideoIndexes(11,5,function (result) {
        assert.equal(3, result.count);
        assert.equal(3, result.segments.length);
      });
    });
    it('should split a 15s video with desired segment 5s into 3 segments', function () {
      videoHelper.distributeVideoIndexes(15,5,function (result) {
        assert.equal(3, result.count);
        assert.equal(3, result.segments.length);
      });
    });
    it('should split a 1s video with desired segment 15s into 1 segments', function () {
      videoHelper.distributeVideoIndexes(1,15,function (result) {
        assert.equal(1, result.count);
        assert.equal(1, result.segments.length);
      });
    });
  });

  describe('segments', function () {
    it('should return a valid array', function () {
      videoHelper.distributeVideoIndexes(10,5, function (result) {
        assert(Array.isArray(result.segments));
      });
    });
    it('should have a start segment at ms 0', function () {
      videoHelper.distributeVideoIndexes(10,5, function (result) {
        assert.equal(0, result.segments[0].start);
      });
    });
    it('should have a final segment at the total ms of video file', function () {
      videoHelper.distributeVideoIndexes(10,5, function (result) {
        assert.equal(videoHelper.secondsToMillis(10), result.segments[result.segments.length -1].end);
      });
    });
    it('should not overlap the time between segments', function () {
      videoHelper.distributeVideoIndexes(10,5, function (result) {
        console.log(result);
        assert.isBelow(result.segments[0].end, result.segments[1].start);
      });
    });
  });

});