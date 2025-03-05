const express = require('express');
const router = express.Router();

// Route temporaire pour tester
router.get('/test', (req, res) => {
  res.json({
    name: "John Doe",
    status: "En forme",
    level: 5,
    xp: "2.5k",
    rank: "Gold",
    stats: {
      stress: 60,
      meditation: 45,
      achievements: 12
    }
  });
});

module.exports = router;
