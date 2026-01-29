const express = require('express');
const router = express.Router();

// Simple endpoint
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello world, TBD' });
});

module.exports = router;