var moment = require('moment');

module.exports = {

   // distributeVideoIndexes takes a viideo clip length, the desired segment
   // size and provides you the total segments and the start/end time in MS
   // for each segment
   // callback with object:
   // { count: 2, segments: [{start: 0 =, end: 5000 }, ... ]}
  distributeVideoIndexes : function (clip_length, seg_size, cb) {
    var ms = this.secondsToMillis(clip_length);
    var seg_size_ms = seg_size * 1000;
    // no_segments - the exact number of segments ie 2.53
    var no_segments = ms / seg_size_ms;
    // round up, so we don't have tiny segments at end of clip
    var rounded_segments = ~~(no_segments + 0.99);

    var segments = [];
    var current_index = 0;
    for (var i = 0; i < no_segments; i++) {
      var start = i * (ms / no_segments);
      var end = (i+1) * (ms / no_segments) - 1;
      if (i == (no_segments - 1)) end += 1; // don't lose last ms of video!
      segments.push({start: start, end: end});
    }
    cb({count: rounded_segments, segments: segments});
  },
  secondsToMillis : function (seconds) {
    return seconds * 1000;
  },
  durationToMillis : function (duration) {
    return moment.duration(duration, "HH:MM:SS.SSSS").asMilliseconds();
  }
}
