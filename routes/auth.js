const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const { DATA_PATH, JWT_SECRET } = require('../config');

const router = express.Router();

// Fungsi untuk membaca file JSON dan mengembalikan sebagai objek JavaScript
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
};

// Fungsi untuk menulis data kembali ke file JSON
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
};

// Route untuk registrasi user baru
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Log request data
    console.log('Request data:', req.body);

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const data = readData();

    // Periksa apakah username sudah ada
    const existingUser = data.find(user => user.username === username);
    if (existingUser) {
        console.log('user already exists');
        return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password sebelum menyimpannya
    // try {
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Buat objek user baru
        const newUser = {
            id: data.length + 1,
            username,
            password: password,
        };

        // Tambahkan user baru ke data
        data.push(newUser);
        writeData(data);

        // Generate token JWT
        const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);

        // Kirim respons dengan token
        res.status(201).json({ message: 'User registered successfully.', token });
    // } catch (error) {
        // console.error('Error hashing password:', error);
        // res.status(500).json({ message: 'Internal server error' });
    // }
});

// Route untuk login user
router.post('/login', async (req, res) => {
    // const { email, password } = req.body;
    const { username, password } = req.body;

    // Validasi input
    // if (!email || !password) {
    //     return res.status(400).json({ message: 'Email and password are required.' });
    // }
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const data = readData();

    // Periksa apakah email ada
    // const existingUser = data.find(user => user.email === email);
    const existingUser = data.find(user => user.username === username);
    if (!existingUser) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if(existingUser.password !== password) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Verifikasi password
    // try {
        // const isMatch = await bcrypt.compare(password, existingUser.password);
        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Invalid email or password.' });
        // }

        // Generate token JWT
        // const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET);
        const token = jwt.sign({ id: existingUser.id, username: existingUser.username }, JWT_SECRET);

        // Kirim respons dengan token
        res.status(200).json({ success: true, token });
        // res.se
    // } catch (error) {
        // console.error('Error comparing passwords:', error);
        // res.status(500).json({ message: 'Internal server error' });
    // }
});

module.exports = router;
