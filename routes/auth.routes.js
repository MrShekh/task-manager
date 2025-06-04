// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

//get /api/auth/logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
