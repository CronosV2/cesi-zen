const { verifyToken } = require('../utils/jwt');

const protect = async (req, res, next) => {
  try {
    // Récupérer le token du header ou du cookie
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Vérifier le token
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Ajouter l'utilisateur à la requête
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Erreur d\'authentification' });
  }
};

module.exports = { protect }; 