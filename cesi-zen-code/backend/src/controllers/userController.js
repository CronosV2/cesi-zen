const User = require('../models/user');

const userController = {
  // Créer un utilisateur test
  createTestUser: async (req, res) => {
    try {
      const testUser = new User({
        name: "John Doe",
        email: "john@test.com",
        level: 5,
        stressLevel: 60,
        healthStatus: "Good",
        achievements: [
          { name: "Premier pas", unlockedAt: new Date() }
        ],
        meditationTime: 45
      });

      await testUser.save();
      res.status(201).json(testUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;