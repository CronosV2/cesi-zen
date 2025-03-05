const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const profileRoutes = require('./routes/profileRoutes');

// Configurer dotenv avec le chemin explicite
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('Current directory:', __dirname);
console.log('Environment variables:', process.env);

// Importer les routes correctement
const userRoutes = require('./routes/userRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/profile', profileRoutes);

// Vérification de l'URI MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  console.error('Make sure .env file exists in:', path.join(__dirname, '../.env'));
  process.exit(1);
}

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Utiliser les routes
app.use('/api/users', userRoutes);  // userRoutes est un Router Express

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // MongoDB connection avec string explicite
  mongoose.connect(String(MONGODB_URI))
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
});