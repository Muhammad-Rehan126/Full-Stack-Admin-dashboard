const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Settings route active' });
});

module.exports = router;
