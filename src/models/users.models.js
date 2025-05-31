const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  wantsToTeach: {
    type: Boolean,
    default: false
  },
  expertise: {
    type: String
  },
  bio: {
    type: String
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
