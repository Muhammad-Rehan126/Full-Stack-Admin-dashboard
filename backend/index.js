const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// --- 1. SARE ROUTES YAHAN IMPORT KAREIN ---
const customerProductRoute = require('./routes/CustomerProduct');
const dashboardRoute = require('./routes/DashboardPage');
const mainLayoutRoute = require('./routes/MainLayout');
const manageProductRoute = require('./routes/ManageProduct');
const productSalesRoute = require('./routes/ProductSales');
const settingRoutes = require('./routes/Settingroutes');

// --- 2. YAHAN REGISTER (MOUNT) KAREIN ---
app.use('/api/customers', customerProductRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/layout', mainLayoutRoute);
app.use('/api/products', manageProductRoute);
app.use('/api/sales', productSalesRoute);
app.use('/api/settings', settingRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('Database connection failed:', err.message));
