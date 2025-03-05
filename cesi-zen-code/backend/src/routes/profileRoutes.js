const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route pour obtenir le profil
router.get('/test', async (req, res) => {
  try {
    // Chercher un profil ou en créer un par défaut
    let profile = await User.findOne();
    if (!profile) {
      profile = await User.create({
        name: "Utilisateur CESI",
        status: "Étudiant CESI",
        level: 5,
        exercicesCompleted: 15,
        stressLevel: "Enorme"
      });
      console.log('Profil créé:', profile);
    }
    res.json(profile);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route pour mettre à jour le profil
router.post('/test', async (req, res) => {
  try {
    const { name, status, level, exercicesCompleted, stressLevel } = req.body;
    
    const profile = await User.findOneAndUpdate(
      {}, // premier document trouvé
      {
        name: name || "Utilisateur CESI",
        status: status || "Étudiant CESI",
        level: level || 5,
        exercicesCompleted: exercicesCompleted || 15,
        stressLevel: stressLevel || "Enorme"
      },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
