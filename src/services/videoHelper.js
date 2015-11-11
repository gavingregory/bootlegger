var moment = require('moment');

module.exports = {
  /**
   * distributeVideoIndexes takes a viideo clip length, the desired segment size and
   */
  distributeVideoIndexes : function (clip_length, seg_size, cb) {
    var ms = this.secondsToMillis(clip_length);
    var seg_size_ms = seg_size * 1000;
    // no_segments - the exact number of segments ie 2.53
    var no_segments = ms / seg_size_ms;
    var int_segments = ~~(no_segments + 0.99);

    var segments = [];

    cb(int_segments);
  },
  secondsToMillis : function (seconds) {
    return seconds * 1000;
  },
  durationToMillis : function (duration) {
    return moment.duration(duration, "HH:MM:SS.SSSS").asMilliseconds();
  }
}
