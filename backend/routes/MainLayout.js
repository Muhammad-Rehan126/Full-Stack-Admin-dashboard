const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Main Layout route active' });
});

module.exports = router;
