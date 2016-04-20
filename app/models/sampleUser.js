var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var sampleUserModel = new Schema({
  mandatoryField: { type: Object, required: true},
  date: String,
  otherField: String,
  username: String
});

module.exports = mongoose.model('user', sampleUserModel);
