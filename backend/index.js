const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
let databaseConnection;

function ensureDatabaseConnection() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!process.env.MONGO_URI) return Promise.reject(new Error('MONGO_URI is not configured.'));
  if (!databaseConnection) {
    databaseConnection = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      databaseConnection = undefined;
      throw error;
    });
  }
  return databaseConnection;
}

const allowedOrigins = new Set([
  'https://full-stack-admin-dashboard-zeta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.CLIENT_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean),
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(503).json({ message: 'The database is temporarily unavailable.' });
  }
});

const { router: authRoute, requireSession } = require('./routes/Auth');
app.use('/api/auth', authRoute);
app.use('/api', requireSession);

const customerProductRoute = require('./routes/CustomerProduct');
const dashboardRoute = require('./routes/DashboardPage');
const mainLayoutRoute = require('./routes/MainLayout');
const manageProductRoute = require('./routes/ManageProduct');
const productSalesRoute = require('./routes/ProductSales');
const settingRoutes = require('./routes/Settingroutes');

app.use('/api/customers', customerProductRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/layout', mainLayoutRoute);
app.use('/api/products', manageProductRoute);
app.use('/api/sales', productSalesRoute);
app.use('/api/settings', settingRoutes);

module.exports = app;

if (!process.env.VERCEL) {
  ensureDatabaseConnection()
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database connection failed:', error.message);
      process.exitCode = 1;
    });
}
