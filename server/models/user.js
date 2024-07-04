const mongoose = require('mongoose');

const userSchema1 = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('User1', userSchema1);
