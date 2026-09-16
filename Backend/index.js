const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/config/db');
const { initializeDatabase, ensureAdminUser } = db;

// Routers
const authRoutes = require('./src/routers/authRoutes');
const userRoutes = require('./src/routers/userRoutes');
const productRoutes = require('./src/routers/productRoutes');
const categoryRoutes = require('./src/routers/categoryRoutes');
const comboRoutes = require('./src/routers/comboRoutes');
const cartRoutes = require('./src/routers/cartRoutes');
const favoriteRoutes = require('./src/routers/favoriteRoutes');
const couponRoutes = require('./src/routers/couponRoutes');
const invoiceRoutes = require('./src/routers/invoiceRoutes');
const stockRoutes = require('./src/routers/stockRoutes');
const orderRoutes = require('./src/routers/orderRoutes');
const healthRoutes = require('./src/routers/healthRoutes');
const addressRoutes = require('./src/routers/addressRoutes');
const dealerRoutes = require('./src/routers/dealerRoutes');
const stickerRoutes = require('./src/routers/stickerRoutes');
const seoRoutes = require('./src/routers/seoRoutes');
const settingsRoutes = require('./src/routers/settingsRoutes');
const reviewRoutes = require('./src/routers/reviewRoutes');
const contactFormRoutes = require('./src/routers/contactFormRoutes');
const bannerRoutes = require('./src/routers/bannerRoutes');
const pushRoutes = require('./src/routers/pushRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/stock-history', stockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/health-benefits', healthRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/stickers', stickerRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact-form', contactFormRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/push', pushRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to KAVI\'S Dry Fruits API');
});

// Database Initialization
(async () => {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('✓ MySQL Connected Successfully');
    
    // Run modular database initialization
    await initializeDatabase();
    await ensureAdminUser();
  } catch (error) {
    console.error('✗ Unable to initialize database:', error.message);
  }
})();

// Start Server
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Attach io to app to use in controllers
app.set('io', io);

io.on('connection', (socket) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      if (String(socket.user.role || '').toLowerCase() === 'admin') socket.join('admins');
    } catch {
      socket.user = null;
    }
  }
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});