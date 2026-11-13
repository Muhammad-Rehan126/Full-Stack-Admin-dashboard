const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { rateLimit } = require('express-rate-limit');

const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many sign-in attempts. Try again in 15 minutes.' },
});
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many account setup attempts. Try again in an hour.' },
});
const COOKIE_NAME = 'berry_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: SESSION_DURATION_MS,
};

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

function requireSession(req, res, next) {
  const secret = getJwtSecret();
  const token = req.cookies?.[COOKIE_NAME];

  if (!secret || !token) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }

  try {
    req.user = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return next();
  } catch {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
}

router.post('/login', loginLimiter, async (req, res) => {
  if (!getJwtSecret()) {
    return res.status(503).json({ message: 'Authentication is not configured on the server.' });
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1 || password.length > 128) {
    return res.status(400).json({ message: 'Enter a valid email and password.' });
  }

  try {
    const user = await User.findOne({ email }).select('+passwordHash');
    const isValid = user && await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { algorithm: 'HS256', expiresIn: '8h' }
    );

    res.cookie(COOKIE_NAME, token, cookieOptions);
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({ message: 'Unable to sign in right now.' });
  }
});

router.get('/registration-status', async (req, res) => {
  try {
    const adminExists = await User.exists({ role: 'admin' });
    return res.json({ canCreateAdmin: !adminExists });
  } catch (error) {
    console.error('Could not check account setup:', error.message);
    return res.status(500).json({ message: 'Unable to check account setup right now.' });
  }
});

router.post('/register', registerLimiter, async (req, res) => {
  if (!getJwtSecret()) {
    return res.status(503).json({ message: 'Authentication is not configured on the server.' });
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const dateOfBirth = typeof req.body?.dateOfBirth === 'string' ? req.body.dateOfBirth : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const parsedDateOfBirth = new Date(`${dateOfBirth}T00:00:00.000Z`);
  const hasValidDateOfBirth = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
    && Number.isFinite(parsedDateOfBirth.getTime())
    && parsedDateOfBirth.toISOString().slice(0, 10) === dateOfBirth
    && parsedDateOfBirth < new Date(new Date().toISOString().slice(0, 10));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !hasValidDateOfBirth || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ message: 'Enter a valid email, a date of birth in the past, and a password of 8 to 72 characters.' });
  }

  try {
    const adminExists = await User.exists({ role: 'admin' });
    if (adminExists) {
      return res.status(409).json({ message: 'The administrator account has already been created. Please sign in.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      dateOfBirth: parsedDateOfBirth,
      passwordHash,
      role: 'admin',
    });

    return res.status(201).json({ message: 'Account created successfully.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An administrator account already exists. Please sign in.' });
    }
    console.error('Account setup failed:', error.message);
    return res.status(500).json({ message: 'Unable to create the account right now.' });
  }
});

router.get('/me', requireSession, (req, res) => {
  res.json({ user: { id: req.user.sub, email: req.user.email, role: req.user.role } });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
});

module.exports = { router, requireSession };
