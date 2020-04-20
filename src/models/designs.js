const mongoose = require('mongoose');
const validator = require('validator');

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  }
})

const Design = mongoose.model('Design', designSchema);

module.exports = Design;
