var moment = require('moment');

module.exports = {

  /**
   * Distribute Video Indexes segments a video into desired segment sizes.
   * Once completed, it calls the callback function with the following object:
   * { count: 2, segments: [{start: 0, end: 5000 }], ... }
   * @param {Number} clip_length
   * @param {Number} seg_size
   * @param {Function(Object)} cb
   */
  distributeVideoIndexes : function (clip_length, seg_size, cb) {
    var ms;
    if (typeof clip_length == 'number')
      ms = this.secondsToMillis(clip_length);
    else
      ms = this.durationToMillis(clip_length);

    var seg_size_ms = seg_size * 1000;
    // no_segments - the exact number of segments ie 2.53
    var no_segments = ms / seg_size_ms;
    // round up, so we don't have tiny segments at end of clip
    var rounded_segments = ~~(no_segments + 0.99);

    var segments = [];
    var current_index = 0;
    for (var i = 0; i < rounded_segments; i++) {
      var start = i * (ms / rounded_segments);
      var end = (i+1) * (ms / rounded_segments) - 1;
      end = Math.min(end, ms) // cap the end ms
      segments.push({start: start, end: end});
    }
    cb({count: rounded_segments, segments: segments});
  },

  /**
   * Converts seconds to milliseconds
   * @param {Number} seconds
   * @return {Number}
   */
  secondsToMillis : function (seconds) {
    return seconds * 1000;
  },

  /**
   * Converts moment duration to milliseconds
   * @param {Object} duration
   * @return {Number}
   */
  durationToMillis : function (duration) {
    return moment.duration(duration, "HH:MM:SS.SSSS").asMilliseconds();
  }
}
