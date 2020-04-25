const mongoose = require('mongoose');
const validator = require('validator');

const designSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  creator: {
    type: String,
    required: true,
    trim: true,
  },
  creatorID: {
    type: String,
    required: true,
    trim: true
  },
  island: {
    type: String,
    required: true,
    trim: true
  },
  designtype: {
    type: String,
    required: true,
    trim: true
  },
  designID: {
    type: String,
    trim: true,
    required: true,
  },
  rating: {
    type: Number
  },
  screenshot: {
    type: Buffer
  }
}, {
  timestamps: true
})

const Design = mongoose.model('Design', designSchema);

module.exports = Design;
