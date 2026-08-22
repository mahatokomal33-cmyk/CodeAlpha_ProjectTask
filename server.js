const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(session({ secret: 'eshop-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'build')));

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'ecommerceDB';
const PORT = 5000;
const JWT_SECRET = 'eshop-jwt-secret-2025';

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log('MongoDB connected!');
}

// ========== AUTH MIDDLEWARE ==========
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch {}
  }
  next();
}

// ========== PASSPORT SOCIAL LOGIN ==========
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  let user = await db.collection('users').findOne({ googleId: profile.id });
  if (!user) {
    const result = await db.collection('users').insertOne({
      name: profile.displayName, email: profile.emails?.[0]?.value || '',
      googleId: profile.id, avatar: profile.photos?.[0]?.value || '', role: 'user', createdAt: new Date()
    });
    user = { _id: result.insertedId, name: profile.displayName, email: profile.emails?.[0]?.value || '' };
  }
  done(null, user);
}));

passport.use(new FacebookStrategy({
  clientID: 'YOUR_FACEBOOK_APP_ID',
  clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  let user = await db.collection('users').findOne({ facebookId: profile.id });
  if (!user) {
    const result = await db.collection('users').insertOne({
      name: profile.displayName, email: profile.emails?.[0]?.value || '',
      facebookId: profile.id, avatar: profile.photos?.[0]?.value || '', role: 'user', createdAt: new Date()
    });
    user = { _id: result.insertedId, name: profile.displayName, email: profile.emails?.[0]?.value || '' };
  }
  done(null, user);
}));

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });
    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.collection('users').insertOne({
      name, email, phone: phone || '', password: hashed, avatar: '', role: 'user', createdAt: new Date()
    });
    const token = jwt.sign({ _id: result.insertedId, name, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: result.insertedId, name, email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });
    if (!user || !user.password) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    await db.collection('users').updateOne({ _id: new ObjectId(req.user._id) }, { $set: { name, phone, avatar } });
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Social Login Routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ _id: req.user._id, name: req.user.name, email: req.user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`http://localhost:3000/auth-success?token=${token}`);
});

app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/api/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  const token = jwt.sign({ _id: req.user._id, name: req.user.name, email: req.user.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`http://localhost:3000/auth-success?token=${token}`);
});

// ========== PRODUCTS ==========
app.get('/api/products', optionalAuth, async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    let cursor = db.collection('products').find(filter);
    if (sort === 'price_low') cursor = cursor.sort({ price: 1 });
    else if (sort === 'price_high') cursor = cursor.sort({ price: -1 });
    else if (sort === 'newest') cursor = cursor.sort({ createdAt: -1 });
    const products = await cursor.toArray();

    if (req.user) {
      const wishlist = await db.collection('wishlists').findOne({ userId: req.user._id.toString() });
      const wishIds = wishlist?.items || [];
      products.forEach(p => { p.isWishlisted = wishIds.includes(p._id.toString()); });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', optionalAuth, async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const reviews = await db.collection('reviews').find({ productId: req.params.id }).sort({ createdAt: -1 }).toArray();
    product.reviews = reviews;
    product.avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
    product.reviewCount = reviews.length;

    if (req.user) {
      const wishlist = await db.collection('wishlists').findOne({ userId: req.user._id.toString() });
      product.isWishlisted = wishlist?.items?.includes(req.params.id) || false;
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id/related', async (req, res) => {
  try {
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const sameCategory = await db.collection('products')
      .find({ category: product.category, _id: { $ne: new ObjectId(req.params.id) } })
      .limit(8).toArray();
    if (sameCategory.length >= 8) return res.json(sameCategory);
    const ids = sameCategory.map(p => p._id);
    const others = await db.collection('products')
      .find({ _id: { $ne: new ObjectId(req.params.id), $nin: ids } })
      .limit(8 - sameCategory.length).toArray();
    res.json([...sameCategory, ...others]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== WISHLIST ==========
app.get('/api/wishlist', auth, async (req, res) => {
  try {
    let wishlist = await db.collection('wishlists').findOne({ userId: req.user._id.toString() });
    if (!wishlist) return res.json({ items: [] });
    const products = await db.collection('products').find({ _id: { $in: wishlist.items.map(id => new ObjectId(id)) } }).toArray();
    res.json({ items: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wishlist/toggle', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await db.collection('wishlists').findOne({ userId: req.user._id.toString() });
    if (!wishlist) wishlist = { userId: req.user._id.toString(), items: [] };
    const idx = wishlist.items.indexOf(productId);
    let action;
    if (idx >= 0) {
      wishlist.items.splice(idx, 1);
      action = 'removed';
    } else {
      wishlist.items.push(productId);
      action = 'added';
    }
    await db.collection('wishlists').updateOne({ userId: req.user._id.toString() }, { $set: { items: wishlist.items } }, { upsert: true });
    res.json({ action, count: wishlist.items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== REVIEWS ==========
app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const reviews = await db.collection('reviews').find({ productId: req.params.productId }).sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    if (!productId || !rating) return res.status(400).json({ error: 'Product ID and rating required' });
    const existing = await db.collection('reviews').findOne({ productId, userId: req.user._id.toString() });
    if (existing) return res.status(400).json({ error: 'You already reviewed this product' });
    const review = {
      productId, userId: req.user._id.toString(), userName: req.user.name,
      rating: Number(rating), title: title || '', comment: comment || '', createdAt: new Date()
    };
    await db.collection('reviews').insertOne(review);

    const allReviews = await db.collection('reviews').find({ productId }).toArray();
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await db.collection('products').updateOne({ _id: new ObjectId(productId) }, { $set: { avgRating, reviewCount: allReviews.length } });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== COUPONS ==========
app.post('/api/coupons/validate', auth, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await db.collection('coupons').findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) return res.status(400).json({ error: 'Invalid coupon code' });
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) return res.status(400).json({ error: 'Coupon expired' });
    if (coupon.minOrder && cartTotal < coupon.minOrder) return res.status(400).json({ error: `Minimum order ₹${coupon.minOrder} required` });
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.min((cartTotal * coupon.value) / 100, coupon.maxDiscount || Infinity);
    } else {
      discount = coupon.value;
    }
    res.json({ code: coupon.code, discount, type: coupon.type, value: coupon.value, finalTotal: cartTotal - discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== CART ==========
app.get('/api/cart', auth, async (req, res) => {
  try {
    let cart = await db.collection('carts').findOne({ userId: req.user._id.toString() });
    if (!cart) cart = { userId: req.user._id.toString(), items: [] };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    let cart = await db.collection('carts').findOne({ userId: req.user._id.toString() });
    if (!cart) cart = { userId: req.user._id.toString(), items: [] };
    const existingIndex = cart.items.findIndex(i => i.productId === productId);
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        productId, name: product.name, price: product.price,
        image: product.image, quantity: quantity || 1
      });
    }
    await db.collection('carts').updateOne({ userId: req.user._id.toString() }, { $set: { items: cart.items } }, { upsert: true });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await db.collection('carts').findOne({ userId: req.user._id.toString() });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId !== productId);
    } else {
      const item = cart.items.find(i => i.productId === productId);
      if (item) item.quantity = quantity;
    }
    await db.collection('carts').updateOne({ userId: req.user._id.toString() }, { $set: { items: cart.items } });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/cart/clear', auth, async (req, res) => {
  try {
    await db.collection('carts').updateOne({ userId: req.user._id.toString() }, { $set: { items: [] } });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== ORDERS ==========
app.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = await db.collection('orders').find({ userId: req.user._id.toString() }).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders/checkout', auth, async (req, res) => {
  try {
    const { address, phone, couponCode, discount } = req.body;
    const cart = await db.collection('carts').findOne({ userId: req.user._id.toString() });
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalAmount = totalAmount - (discount || 0);
    const order = {
      userId: req.user._id.toString(), items: cart.items, totalAmount, discount: discount || 0,
      finalAmount, couponCode: couponCode || '', address, phone,
      status: 'confirmed', createdAt: new Date()
    };
    await db.collection('orders').insertOne(order);
    await db.collection('carts').updateOne({ userId: req.user._id.toString() }, { $set: { items: [] } });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== REPORTS ==========
app.get('/api/report', async (req, res) => {
  try {
    const result = await db.collection('orders').aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalEarning: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }, count: { $sum: "$items.quantity" } } },
      { $sort: { totalEarning: -1 } }
    ]).toArray();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/report/summary', async (req, res) => {
  try {
    const totalOrders = await db.collection('orders').countDocuments();
    const revenue = await db.collection('orders').aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]).toArray();
    const totalProducts = await db.collection('products').countDocuments();
    const totalUsers = await db.collection('users').countDocuments();
    res.json({ totalOrders, totalRevenue: revenue[0]?.total || 0, totalProducts, totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== CHAT ==========
const chatMessages = {};
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join', (userId) => { socket.join(userId); });
  socket.on('chat-message', (data) => {
    const { from, to, message } = data;
    if (!chatMessages[from]) chatMessages[from] = [];
    chatMessages[from].push({ from, to, message, time: new Date() });
    io.to(to).emit('chat-message', { from, message, time: new Date() });
    io.to(from).emit('chat-message', { from, message, time: new Date() });
  });
  socket.on('disconnect', () => {});
});

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
});
