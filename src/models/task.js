var mongoose = require('mongoose')
  , Schema   = mongoose.Schema;

var schema = Schema({
  creator		: { type: String, required: true  },
  name          : { type: String, required: true  },
  shoot         : {
      name: { type: String, required: true  },
      id: { type: String, required: true  }
  },
  template_id   : { type: Schema.Types.ObjectId, ref: 'TaskTemplate', required: true },
  created 		: { type: Date, default: Date.now },
  updated		: { type: Date, default: Date.now },
  running       : { type: Boolean, default: false, required: true },
  ref_images    : [{ url: {type: String, required: true} }],
  instructions  : { type: String, required: true  },
  jobs          : { type: Number, required: true  }, /* number of jobs to generate */
  passes        : { type: Number, required: true  }, /* number of passes over each item of data */
  tokens        : [{
      token: {type: String},
      issued_to: {type: String},
      completed_at: {type: Date},
      result: {type: String}
  }]
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
  model: mongoose.model('Task', schema),
  schema: schema
}
