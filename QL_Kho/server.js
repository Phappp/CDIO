require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Database connection
require('./src/config/db');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Thêm sau các import nhưng trước các route chính
if (process.env.NODE_ENV === 'development') {
    app.get('/generate-password', async (req, res) => {
        try {
            const hashed = await bcrypt.hash(req.query.password || '123', 10);
            res.send(`
          <h1>Generated Hash</h1>
          <p>${hashed}</p>
          <pre>INSERT INTO users (username, password, role) VALUES ('admin2', '${hashed}', 'admin');</pre>
        `);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
}
// View engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./src/routes/authRoutes'));
app.use('/admin', require('./src/routes/adminRoutes'));
app.use('/staff', require('./src/routes/staffRoutes'));
app.use('/manager', require('./src/routes/managerRoutes'));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});