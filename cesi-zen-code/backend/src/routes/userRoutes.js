const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/test', userController.createTestUser);
router.get('/', userController.getAllUsers);

module.exports = router;