const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Product Sales route active' });
});

module.exports = router;
