import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import adminRoutes from './routes/adminRoutes';
import holmesRaheRoutes from './routes/holmesRaheRoutes';

// Configuration dotenv
dotenv.config({ path: path.join(__dirname, '../.env') });

// Création de l'application Express
const app: Express = express();

// Middlewares
app.use(helmet()); // Sécurité
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Accepte les deux ports
  credentials: true // Important pour les cookies
}));
app.use(cookieParser());
app.use(express.json());

// Connexion MongoDB
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/holmes-rahe', holmesRaheRoutes);

// Gestion des erreurs globale
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5001;
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur de démarrage du serveur:', error);
  }
};

startServer();
