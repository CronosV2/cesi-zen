const User = require('../models/User');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTestUser: async (req, res) => {
    try {
      const user = await User.create({
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = userController; 