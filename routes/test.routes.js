const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

router.get('/protected', protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, you're authenticated as ${req.user.role}` });
});

module.exports = router;