const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGO_URI || !email || !password || password.length < 12) {
    throw new Error('Set MONGO_URI, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, role: 'admin' } },
    { upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  console.log(`Administrator account is ready for ${email}.`);
}

createAdmin()
  .catch((error) => {
    console.error('Could not provision administrator:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
