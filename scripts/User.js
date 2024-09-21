var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['receptionist', 'manager'], required: true }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
