var restful  = require('node-restful')
  , mongoose = restful.mongoose
  , Schema   = mongoose.Schema

var schema = Schema({
  creator		    : { type: String, required: true  },
  name          : { type: String, required: true  },
  shoot_id      : { type: String, required: true  },
  template_id   : { type: Schema.Types.ObjectId, ref: 'TaskTemplate', required: true },
  created 		  : { type: Date, default: Date.now },
  updated		    : { type: Date, default: Date.now },
  running       : { type: Boolean, default: false, required: true },
  ref_images    : [{ url: {type: String, required: true} }],
  instructions  : { type: String, required: true  },
  job_count     : { type: Number, required: true  }, /* number of jobs to generate */
  passes        : { type: Number, required: true  }, /* number of passes over each item of data */
  segment_size : { type: Number, required: true },   /* size (in seconds) of desired segment */
  jobs          : [{
      id: {type: String},
      video_id: { type: String, required: true },
      start: { type: Number, required: true },
      finish: { type: Number, required: true },
      issued_to: {type: String},
      completed_at: {type: Date},
      result: {type: String}
  }],
  meta_object  : { type: String, required: true },
  meta_key     : { type: String, required: true },
  meta_value   : [{ type: String, required: true }]
});

schema.pre('save', function (next) {
  var currentDate = new Date();
  this.updated = currentDate;
  if (!this.created) {
    this.created = currentDate;
  }
  next();
});

module.exports = {
  model: restful.model('task', schema),
  schema: schema
}
