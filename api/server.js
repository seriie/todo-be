// server.js
const express = require('express');
const { PORT } = require('../config');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const todoRoutes = require('../routes/todo');
const cors = require('cors');

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware untuk CORS
app.use(cors());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/todos', todoRoutes);

// Export sebagai serverless function untuk Vercel
module.exports = app;