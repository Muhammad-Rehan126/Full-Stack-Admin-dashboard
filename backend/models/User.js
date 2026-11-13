const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80, default: 'Administrator' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    dateOfBirth: { type: Date },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true }
);

userSchema.index(
  { role: 1 },
  { unique: true, partialFilterExpression: { role: 'admin' } }
);

module.exports = mongoose.model('User', userSchema);
