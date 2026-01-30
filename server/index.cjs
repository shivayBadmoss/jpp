require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db-adapter.cjs');

const app = express();
// PORT moved to app.listen call below

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// DEBUG LOGGER
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Serve Static Frontend (Vite Build)
const path = require('path');
// Go up one level to root, then dist (assuming build runs in root)
const distPath = path.join(__dirname, '..', 'dist');
const fs = require('fs');

if (process.env.NODE_ENV === 'production') {
    if (fs.existsSync(path.join(distPath, 'index.html'))) {
        console.log("✅ Static Assets Found at:", distPath);
    } else {
        console.error("❌ CRTICAL: Static Assets MISSING at:", distPath);
        console.error("   Did you run 'npm run build'?");
    }
}

app.use(express.static(distPath));

// --- ROUTES ---

// 0. HEALTH CHECK
app.get('/api/health', async (req, res) => {
    try {
        await db.$queryRaw`SELECT 1`;
        res.json({
            status: 'ok',
            time: new Date().toISOString(),
            dbType: 'PostgreSQL (Prisma)',
            connected: true
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            error: err.message,
            dbType: 'PostgreSQL (Prisma)',
            connected: false
        });
    }
});

// 1. REGISTER USER
app.post('/api/register', async (req, res) => {
    console.log('[POST] /api/register', req.body);
    const { name, email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const id = 'user_' + Buffer.from(normalizedEmail).toString('base64').substring(0, 10);

    try {
        const newUser = await db.user.create({
            data: {
                id,
                name,
                email: normalizedEmail,
                password,
                role: role || 'user'
            }
        });
        console.log('User registered:', normalizedEmail);
        res.json(newUser);
    } catch (err) {
        console.error('Register Error:', err.message);
        return res.status(400).json({ error: 'Email already exists' });
    }
});

// 2. LOGIN USER
app.post('/api/login', async (req, res) => {
    console.log('[POST] /api/login', req.body);
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Vendor Hardcoded Check (Case Insensitive)
    if (role === 'vendor') {
        const normalizedEmail = email.toLowerCase().trim();
        const vendorEmail = 'kartikguleria12@gmail.com';

        if (normalizedEmail === vendorEmail && password === 'kk@123') {
            console.log('Vendor login success:', vendorEmail);
            return res.json({
                id: 'vendor_admin',
                name: 'Kartik Guleria',
                email: vendorEmail,
                role: 'vendor'
            });
        } else {
            console.warn('Vendor login failed for:', normalizedEmail);
            return res.status(401).json({ error: 'Invalid Vendor Credentials' });
        }
    }

    // Normal DB Login
    try {
        const user = await db.user.findFirst({
            where: {
                email: email.toLowerCase().trim(),
                password
            }
        });

        if (!user) {
            console.warn('Login failed: Invalid credentials for', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('User login success:', user.email);
        res.json(user);
    } catch (err) {
        console.error('Login DB Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
});

// 2.5. GET ALL USERS (Admin/Debug)
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.user.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(users);
    } catch (err) {
        console.error('Get Users Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// 3. GET ORDERS (For Vendor Dashboard & User History)
app.get('/api/orders', async (req, res) => {
    const { userId } = req.query; // Optional filter

    let where = {};
    if (userId) {
        where.userId = userId;
    }

    try {
        const orders = await db.order.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
});

// 4. CREATE ORDER
app.post('/api/orders', async (req, res) => {
    console.log('[POST] /api/orders', req.body);
    const { userId, userEmail, files, settings, totalAmount } = req.body;

    if (!files || totalAmount === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = Date.now().toString();

    // Unique OTP Generation
    let otp;
    let isUnique = false;
    let attempts = 0;

    try {
        while (!isUnique && attempts < 5) {
            otp = Math.floor(1000 + Math.random() * 9000).toString();
            const existingOrder = await db.order.findFirst({
                where: { otp, status: { not: 'collected' } }
            });
            if (!existingOrder) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) throw new Error("Could not generate unique OTP");

        const newOrder = await db.order.create({
            data: {
                id,
                userId,
                userEmail,
                files: files,
                settings: settings,
                totalAmount,
                status: 'paid',
                otp
            }
        });

        console.log('Order created successfully:', id);
        res.json(newOrder);

    } catch (err) {
        console.error('Order Insert Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
});

// 5. UPDATE ORDER STATUS (Vendor Actions)
// Supports both PATCH /api/orders/:id and PATCH /api/orders/:id/status
app.patch(['/api/orders/:id', '/api/orders/:id/status'], async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const order = await db.order.update({
            where: { id },
            data: { status }
        });
        res.json({ success: true, id, status: order.status });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(500).json({ error: err.message });
    }
});

// Catch-All Route
app.get('*', (req, res) => {
    console.log('Catch-all hit for:', req.url);
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('FINAL LISTEN PORT =>', PORT);
});

module.exports = app;
