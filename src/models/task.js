var restful  = require('node-restful')
  , mongoose = restful.mongoose
  , Schema   = mongoose.Schema

var schema = Schema({
  creator		    : { type: String, required: true  },
  type          : { type: String }, 
  name          : { type: String, required: true  },
  shoot_id      : { type: String, required: true  },
  template_id   : { type: Schema.Types.ObjectId, ref: 'TaskTemplate' },
  created 		  : { type: Date, default: Date.now },
  updated		    : { type: Date, default: Date.now },
  running       : { type: Boolean, default: false, required: true },
  ref_images    : [{
    originalname: {type: String, required: true},
    encoding: {type: String, required: true},
    mimetype: {type: String, required: true},
    destination: {type: String, required: true},
    filename: {type: String, required: true},
    path: {type: String, required: true},
    size: {type: Number, required: true}
  }],
  CML           : { type: String, default: ' ' },
  CSS           : { type: String, default: ' ' },
  JS            : { type: String, default: ' ' },
  support_email : { type: String, default: ' ' },
  instructions  : { type: String, required: true  },
  passes        : { type: Number, required: true  }, /* number of passes over each item of data */
  segment_size  : { type: Number, required: true },   /* size (in seconds) of desired segment */
  cent_per_job  : { type: Number, required: true },
  videos        : [{}],
  jobs          : [{
      id: {type: String},
      video: {
        index: { type: String, required: true },
        start: { type: Number, required: true },
        bootlegger_id: { type: String },
        end: { type: Number, required: true },
        filename: { type: String },
        path: { type: String },
        length: { type: Number, required: true },
        filesize: { type: Number, required: true },
        template_id : { type: Number },
        template_url : { type: String },
        template_desc : { type: String }
      },
      judgments: [{
        // created_at: { type: Date },
        // golden: { type: Boolean, default: false },
        // missed: { type: Boolean, default: false },
        // started_at: { type: Date },
        // tainted: { type: Boolean },
        // channel: { type: String },
        // trust: { type: Number },
        // worker_id: { type: Number },
        // country: { type: String },
        // region: { type: String },
        // city: { type: String },
        // ip: { type: String },
        result: { type: String }
      }],
      issued_to: {type: String },
      completed_at: {type: Date },
      result: {type: String},
      cf_job_id: { type: Number }
  }],
  cf_job_id     : { type: Number },
  meta_object   : { type: String, required: true },
  meta_key      : { type: String, required: true },
  meta_value    : [{ type: String, required: true }]
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
