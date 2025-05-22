import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
}

export const generateTokens = (userId: string): { accessToken: string; refreshToken: string } => {
  // Vérifier les secrets JWT
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  
  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets not configured in environment variables');
  }

  // Token d'accès (courte durée - 15min)
  const accessToken = jwt.sign(
    { userId } as TokenPayload,
    accessSecret,
    { expiresIn: '15m' }
  );

  // Token de rafraîchissement (longue durée - 7 jours)
  const refreshToken = jwt.sign(
    { userId } as TokenPayload,
    refreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string): TokenPayload | null => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
};
