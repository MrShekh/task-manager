// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Manager', 'Employee'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
