var restful  = require('node-restful')
  , mongoose = restful.mongoose
  , Schema   = mongoose.Schema

var schema = Schema({
  creator		: { type: String, required: true  },
  name          : { type: String, required: true  },
  description   : { type: String, required: true  },
  imageUrl      : { type: String, required: true  },
  created 		: { type: Date, default: Date.now },
  updated		: { type: Date, default: Date.now },
  refImageReq   : { type: Boolean, default: true  },
  showVideo     : { type: Boolean, default: true  }
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
  model: restful.model('tasktemplate', schema),
  schema: schema
}
